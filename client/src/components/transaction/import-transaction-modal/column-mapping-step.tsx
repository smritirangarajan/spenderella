import { useMemo, useState } from "react";
import {
  BanIcon,
  ChevronLeft,
  ChevronRight,
  FileSpreadsheet,
  HelpCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CsvColumn, TransactionField } from "@/@types/transaction.type";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type ColumnMappingStepProps = {
  csvColumns: CsvColumn[];
  transactionFields: TransactionField[];
  mappings: Record<string, string>;
  onComplete: (mappings: Record<string, string>) => void;
  onBack: () => void;
};

type AvailableAttributeType =
  | { fieldName: string; required?: never }
  | TransactionField;

const ColumnMappingStep = ({
  csvColumns,
  transactionFields,
  onComplete,
  onBack,
  ...props
}: ColumnMappingStepProps) => {
  const [mappings, setMappings] = useState<Record<string, string>>(
    props.mappings || {}
  );
  const [errors, setErrors] = useState<Record<string, string>>({});

  const availableAttributes: AvailableAttributeType[] = useMemo(
    () => [{ fieldName: "Skip" }, ...transactionFields],
    [transactionFields]
  );

  const handleMappingChange = (csvColumn: string, field: string) => {
    setMappings((prev) => ({
      ...prev,
      [csvColumn]: field,
    }));

    if (errors[csvColumn]) {
      const newErrors = { ...errors };
      delete newErrors[csvColumn];
      setErrors(newErrors);
    }
  };

  const validateMappings = () => {
    const newErrors: Record<string, string> = {};
    const usedFields = new Set<string>();

    Object.entries(mappings).forEach(([csvColumn, field]) => {
      if (field !== "Skip" && usedFields.has(field)) {
        newErrors[csvColumn] = "Field already mapped";
      }
      if (field !== "Skip") usedFields.add(field);
    });

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      const finalMappings = Object.fromEntries(
        Object.entries(mappings).filter(([_, field]) => field !== "Skip")
      );
      onComplete(finalMappings);
    }
  };

  const hasRequiredMappings = transactionFields.every(
    (field) =>
      !field.required || Object.values(mappings).includes(field.fieldName)
  );

  const validMappingsCount = Object.values(mappings).filter(
    (field) => field !== "Skip"
  ).length;

  const hasErrors = Object.keys(errors).length > 0;

  return (
    <div className="space-y-6">
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2">
          🗂️ Map CSV Columns
        </DialogTitle>
        <DialogDescription className="text-muted-foreground">
          Match the columns from your CSV file to Spenderella’s transaction fields
        </DialogDescription>
      </DialogHeader>

      <div className="rounded-lg border bg-card shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="pl-6">CSV Column</TableHead>
              <TableHead className="pl-8">Transaction Field</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {csvColumns.map((column) => (
              <TableRow
                key={column.id}
                className={column.hasError ? "!bg-red-50 dark:!bg-red-950/30" : ""}
              >
                <TableCell className="pl-6">
                  <div className="flex items-center gap-2">
                    <FileSpreadsheet className="h-5 w-5 text-green-500" />
                    <span className="truncate">{column.name}</span>
                  </div>
                </TableCell>
                <TableCell className="pl-8">
                  <div className="flex items-center gap-2">
                    <HelpCircle className="h-5 w-5 text-muted-foreground shrink-0" />
                    <Select
                      value={mappings[column.name] || ""}
                      onValueChange={(value) =>
                        handleMappingChange(column.name, value)
                      }
                    >
                      <SelectTrigger className="w-[200px] border-none shadow-none pl-0">
                        <SelectValue
                          className="text-muted-foreground capitalize"
                          placeholder="Select a field"
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {availableAttributes.map((attr) => {
                          const isDisabled =
                            attr.fieldName !== "Skip" &&
                            attr.fieldName !== mappings[column.name] &&
                            Object.values(mappings).includes(attr.fieldName);

                          return (
                            <SelectItem
                              key={attr.fieldName}
                              value={attr.fieldName}
                              disabled={isDisabled}
                              className="flex items-center justify-between gap-2"
                            >
                              <span className="capitalize">
                                {attr.fieldName}
                                {attr?.required && (
                                  <span className="text-red-500"> *</span>
                                )}
                              </span>
                              {isDisabled && (
                                <BanIcon className="text-muted-foreground size-4" />
                              )}
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                  </div>
                  {errors[column.name] && (
                    <p className="mt-1 text-xs text-red-500">
                      {errors[column.name]}
                    </p>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={onBack}
          className="gap-2"
        >
          <ChevronLeft className="w-4 h-4" /> Back
        </Button>
        <Button
          onClick={validateMappings}
          disabled={!hasRequiredMappings || hasErrors}
          className="gap-2"
        >
          Continue ({validMappingsCount}/{transactionFields.length})
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

export default ColumnMappingStep;
