import { useState } from "react";
import { z } from "zod";
import { ChevronDown, ChevronLeft, FileCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { _TRANSACTION_TYPE, PAYMENT_METHODS_ENUM, MAX_IMPORT_LIMIT } from "@/constant";
import { toast } from "sonner";
import { BulkTransactionType } from "@/features/transaction/transactionType";
import { useProgressLoader } from "@/hooks/use-progress-loader";
import { useBulkImportTransactionMutation } from "@/features/transaction/transactionAPI";

// --- helpers ---------------------------------------------------------

// Normalize amount: remove currency symbols/commas and coerce to number.
const toNumber = (val: unknown): number | null => {
  if (val == null) return null;
  const s = String(val).replace(/[,\s$£€¥₦₵₽₹₩]+/g, "");
  const num = Number(s);
  return Number.isFinite(num) ? num : null;
};

// Normalize date: accept common CSV date formats.
const toDate = (val: unknown): Date | null => {
  if (!val) return null;
  if (val instanceof Date && !isNaN(val.getTime())) return val;
  const s = String(val).trim();
  // Support dd/mm/yyyy & mm/dd/yyyy & yyyy-mm-dd
  const parts = s.split(/[\/\-]/).map((p) => p.trim());
  let d: Date | null = null;

  if (parts.length === 3) {
    // try ISO first
    const iso = new Date(s);
    if (!isNaN(iso.getTime())) d = iso;
    else {
      // naive fallback: detect 4-digit year
      if (parts[0].length === 4) {
        // yyyy-mm-dd
        const [y, m, day] = parts.map((p) => Number(p));
        d = new Date(y, m - 1, day);
      } else if (parts[2].length === 4) {
        // assume mm/dd/yyyy or dd/mm/yyyy — let Date decide; if invalid, flip
        const a = new Date(`${parts[0]}/${parts[1]}/${parts[2]}`);
        if (!isNaN(a.getTime())) d = a;
        else {
          const b = new Date(`${parts[1]}/${parts[0]}/${parts[2]}`);
          if (!isNaN(b.getTime())) d = b;
        }
      }
    }
  } else {
    const parsed = new Date(s);
    if (!isNaN(parsed.getTime())) d = parsed;
  }

  return d && !isNaN(d.getTime()) ? d : null;
};

// Normalize transaction type
const normType = (val: unknown) => {
  const s = String(val || "").trim().toUpperCase();
  if (s === _TRANSACTION_TYPE.INCOME) return _TRANSACTION_TYPE.INCOME;
  if (s === _TRANSACTION_TYPE.EXPENSE) return _TRANSACTION_TYPE.EXPENSE;
  return null;
};

// Normalize payment method (case-insensitive, allow spaces/underscores)
const normPayment = (val: unknown) => {
  if (val == null || val === "") return undefined;
  const raw = String(val).trim().toUpperCase().replace(/\s+/g, "_");
  const allowed = Object.values(PAYMENT_METHODS_ENUM);
  const match = allowed.find((m) => m.toUpperCase() === raw);
  return match ?? undefined;
};

// --- validation schema -----------------------------------------------

const transactionSchema = z.object({
  title: z.string({ required_error: "Title is required" }).min(1, "Title is required"),
  amount: z.number({ invalid_type_error: "Amount must be a number" }).positive("Amount must be greater than zero"),
  date: z.preprocess(
    (val) => {
      const d = toDate(val);
      return d ?? val;
    },
    z.date({ invalid_type_error: "Invalid date format", required_error: "Date is required" })
  ),
  type: z.enum([_TRANSACTION_TYPE.INCOME, _TRANSACTION_TYPE.EXPENSE], {
    invalid_type_error: "Invalid transaction type",
    required_error: "Transaction type is required",
  }),
  category: z.string({ required_error: "Category is required" }).min(1, "Category is required"),
  paymentMethod: z
    .union([
      z.undefined(),
      z.enum(
        [
          PAYMENT_METHODS_ENUM.CARD,
          PAYMENT_METHODS_ENUM.BANK_TRANSFER,
          PAYMENT_METHODS_ENUM.MOBILE_PAYMENT,
          PAYMENT_METHODS_ENUM.AUTO_DEBIT,
          PAYMENT_METHODS_ENUM.CASH,
          PAYMENT_METHODS_ENUM.OTHER,
        ],
        {
          errorMap: (issue) => ({
            message:
              issue.code === "invalid_enum_value"
                ? `Payment method must be one of: ${Object.values(PAYMENT_METHODS_ENUM).join(", ")}`
                : "Invalid payment method",
          }),
        }
      ),
    ])
    .optional(),
});

type ConfirmationStepProps = {
  file: File | null;
  mappings: Record<string, string>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  csvData: any[];
  onComplete: () => void;
  onBack: () => void;
};

const ConfirmationStep = ({ file, mappings, csvData, onComplete, onBack }: ConfirmationStepProps) => {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { progress, isLoading, startProgress, updateProgress, doneProgress, resetProgress } =
    useProgressLoader({ initialProgress: 10, completionDelay: 500 });

  const [bulkImportTransaction] = useBulkImportTransactionMutation();

  const getAssignFieldToMappedTransactions = () => {
    let hasValidationErrors = false;
    const results: Partial<BulkTransactionType>[] = [];
    const newErrors: Record<string, string> = {};

    csvData.forEach((row, idx) => {
      // Build a normalized transaction object using the mapping
      const t: Record<string, unknown> = {};

      Object.entries(mappings).forEach(([csvColumn, transactionField]) => {
        if (transactionField === "Skip") return;
        const raw = row[csvColumn];

        switch (transactionField) {
          case "amount": {
            const n = toNumber(raw);
            t.amount = n ?? raw;
            break;
          }
          case "date": {
            const d = toDate(raw);
            t.date = d ?? raw;
            break;
          }
          case "type": {
            const typ = normType(raw);
            t.type = typ ?? raw;
            break;
          }
          case "paymentMethod": {
            t.paymentMethod = normPayment(raw);
            break;
          }
          case "title":
          case "category":
          case "description": {
            t[transactionField] = typeof raw === "string" ? raw.trim() : raw;
            break;
          }
          default: {
            // unknown mapped field — ignore
          }
        }
      });

      try {
        const validated = transactionSchema.parse(t);
        results.push(validated);
      } catch (err) {
        hasValidationErrors = true;
        const message =
          err instanceof z.ZodError
            ? err.errors
                .map((e) => {
                  if (e.path[0] === "type") return "Transaction type must be INCOME or EXPENSE";
                  if (e.path[0] === "paymentMethod")
                    return "Payment method must be one of: " + Object.values(PAYMENT_METHODS_ENUM).join(", ");
                  return `${String(e.path[0])}: ${e.message}`;
                })
                .join("\n")
            : "Invalid data";
        newErrors[idx + 1] = message;
      }
    });

    setErrors(newErrors);
    return { transactions: results, hasValidationErrors };
  };

  const hasErrors = Object.keys(errors).length > 0;

  const handleImport = () => {
    const { transactions, hasValidationErrors } = getAssignFieldToMappedTransactions();
    if (hasErrors || hasValidationErrors) {
      toast.error("Please resolve the validation issues before importing.");
      return;
    }

    if (transactions.length > MAX_IMPORT_LIMIT) {
      toast.error(`Cannot import more than ${MAX_IMPORT_LIMIT} transactions`);
      return;
    }

    resetProgress();
    startProgress(10);

    let currentProgress = 10;
    const interval = setInterval(() => {
      const increment = currentProgress < 90 ? 10 : 1;
      currentProgress = Math.min(currentProgress + increment, 90);
      updateProgress(currentProgress);
    }, 250);

    const payload = { transactions: transactions as BulkTransactionType[] };

    bulkImportTransaction(payload)
      .unwrap()
      .then(() => {
        updateProgress(100);
        toast.success("Imported transactions successfully");
      })
      .catch((error) => {
        resetProgress();
        toast.error(error?.data?.message || "Failed to import transactions");
      })
      .finally(() => {
        clearInterval(interval);
        setTimeout(() => {
          doneProgress();
          resetProgress();
          onComplete();
        }, 500);
      });
  };

  const mappedCount = Object.values(mappings).filter((v) => v && v !== "Skip").length;

  return (
    <div className="space-y-6">
      <DialogHeader>
        <DialogTitle className="flex items-center gap-1">Confirm Import</DialogTitle>
        <DialogDescription>Review your settings before importing</DialogDescription>
      </DialogHeader>

      <div className="space-y-4">
        {/* Summary */}
        <div className="rounded-md border p-4 w-full">
          <h4 className="mb-2 flex items-center gap-1 font-medium">
            <FileCheck className="size-4" />
            Import Summary
          </h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">File</p>
              <p className="truncate">{file?.name}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Columns Mapped</p>
              <p>{mappedCount}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Rows Detected</p>
              <p>{csvData.length}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Import Limit</p>
              <p>{MAX_IMPORT_LIMIT}</p>
            </div>
          </div>
        </div>

        {/* Errors */}
        {hasErrors && (
          <div className="max-h-60 w-full overflow-y-auto rounded border border-destructive/30 bg-destructive/10 text-sm">
            <p className="sticky top-0 bg-destructive/10 px-2 py-1 font-medium text-destructive">
              Issues found:
            </p>
            <div className="space-y-1 p-2">
              {Object.entries(errors).map(([row, msg]) => (
                <details key={row} className="group">
                  <summary className="flex cursor-pointer items-center justify-between text-sm text-destructive">
                    <span>Row {row}</span>
                    <ChevronDown className="size-4 transform transition-transform group-open:rotate-180" />
                  </summary>
                  <div className="mt-1 border-l-2 border-destructive/30 pl-2 text-xs text-destructive/90">
                    {msg.split("\n").map((line, i) => (
                      <p key={i}>{line}</p>
                    ))}
                  </div>
                </details>
              ))}
            </div>
          </div>
        )}

        {/* Progress */}
        {isLoading && (
          <div className="space-y-2">
            <Progress value={progress} className="h-2" />
            <p className="text-xs text-muted-foreground">Importing... {progress}%</p>
          </div>
        )}
      </div>

      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack} disabled={isLoading}>
          <ChevronLeft className="mr-2 size-4" />
          Back
        </Button>
        <Button onClick={handleImport} disabled={isLoading || hasErrors}>
          {isLoading ? "Importing..." : "Confirm Import"}
        </Button>
      </div>
    </div>
  );
};

export default ConfirmationStep;
