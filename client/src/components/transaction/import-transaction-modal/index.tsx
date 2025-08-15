import { useState } from "react";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ImportIcon } from "lucide-react";
import FileUploadStep from "./fileupload-step";
import ColumnMappingStep from "./column-mapping-step";
import { CsvColumn, TransactionField } from "@/@types/transaction.type";
import ConfirmationStep from "./confirmation-step";

const ImportTransactionModal = () => {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [file, setFile] = useState<File | null>(null);
  const [csvColumns, setCsvColumns] = useState<CsvColumn[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [csvData, setCsvData] = useState<any[]>([]);
  const [mappings, setMappings] = useState<Record<string, string>>({});
  const [open, setOpen] = useState(false);

  const transactionFields: TransactionField[] = [
    { fieldName: "title", required: true },
    { fieldName: "amount", required: true },
    { fieldName: "type", required: true },
    { fieldName: "date", required: true },
    { fieldName: "category", required: true },
    { fieldName: "paymentMethod", required: true },
    { fieldName: "description", required: false },
  ];

  // --- Step handlers ---
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleFileUpload = (nextFile: File, columns: CsvColumn[], data: any[]) => {
    setFile(nextFile);
    setCsvColumns(columns);
    setCsvData(data);
    setMappings({});
    setStep(2);
  };

  const resetImport = () => {
    setFile(null);
    setCsvColumns([]);
    setCsvData([]); // ensure we clear parsed data too
    setMappings({});
    setStep(1);
  };

  const handleClose = () => {
    setOpen(false);
    // give the close animation a moment before resetting
    setTimeout(() => resetImport(), 250);
  };

  const handleMappingComplete = (nextMappings: Record<string, string>) => {
    setMappings(nextMappings);
    setStep(3);
  };

  const handleBack = (toStep: 1 | 2 | 3) => setStep(toStep);

  const renderStep = () => {
    switch (step) {
      case 1:
        return <FileUploadStep onFileUpload={handleFileUpload} />;
      case 2:
        return (
          <ColumnMappingStep
            csvColumns={csvColumns}
            mappings={mappings}
            transactionFields={transactionFields}
            onComplete={handleMappingComplete}
            onBack={() => handleBack(1)}
          />
        );
      case 3:
        return (
          <ConfirmationStep
            file={file}
            mappings={mappings}
            csvData={csvData}
            onBack={() => handleBack(2)}
            onComplete={handleClose}
          />
        );
      default:
        return null;
    }
  };

  return (
    <>
      <Button
        variant="outline"
        className="gap-2"
        onClick={() => setOpen(true)}
      >
        <ImportIcon className="size-4" />
        Bulk Import
      </Button>

      <Dialog
        open={open}
        onOpenChange={(v) => (v ? setOpen(true) : handleClose())}
      >
        <DialogContent className="max-w-2xl min-h-[40vh] p-0 overflow-hidden">
          {/* Header / Stepper */}
          <div className="border-b px-6 py-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-semibold">Import Transactions</h3>
              <div className="text-xs text-muted-foreground">
                Step {step} of 3
              </div>
            </div>
            <div className="mt-3 grid grid-cols-3 gap-2">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className={[
                    "h-1.5 rounded-full transition-colors",
                    step >= (i as 1 | 2 | 3) ? "bg-primary" : "bg-muted",
                  ].join(" ")}
                />
              ))}
            </div>
          </div>

          {/* Body */}
          <div className="p-6">{renderStep()}</div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ImportTransactionModal;
