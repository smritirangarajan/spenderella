import { toast } from "sonner";
import { usePapaParse } from "react-papaparse";
import { FileUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useRef } from "react";
import {
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { MAX_FILE_SIZE, MAX_IMPORT_LIMIT } from "@/constant";
import { useProgressLoader } from "@/hooks/use-progress-loader";

interface CsvRow {
  [key: string]: string | undefined;
}

type FileUploadStepProps = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onFileUpload: (file: File, columns: any[], data: any[]) => void;
};

const FileUploadStep = ({ onFileUpload }: FileUploadStepProps) => {
  const { readString } = usePapaParse();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { progress, isLoading, startProgress, updateProgress, doneProgress, resetProgress } =
    useProgressLoader({ initialProgress: 10, completionDelay: 500 });

  const humanFileSize = `${Math.floor(MAX_FILE_SIZE / (1024 * 1024))}MB`;

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > MAX_FILE_SIZE) {
      toast.error(`File size exceeds the limit of ${humanFileSize}.`);
      // allow re-selecting the same file next time
      e.currentTarget.value = "";
      return;
    }

    resetProgress();
    startProgress();

    try {
      const fileText = await file.text();

      readString<CsvRow>(fileText, {
        header: true,
        skipEmptyLines: true,
        fastMode: true,
        complete: (results) => {
          if (results.data.length > MAX_IMPORT_LIMIT) {
            toast.error(`You can only import up to ${MAX_IMPORT_LIMIT} transactions.`);
            resetProgress();
            e.currentTarget.value = "";
            return;
          }

          updateProgress(40);

          const columns =
            results.meta.fields?.map((name: string) => ({
              id: name,
              name,
              sampleData: results.data[0]?.[name] ?? "",
            })) ?? [];

          doneProgress();

          setTimeout(() => {
            onFileUpload(file, columns, results.data);
          }, 300);
        },
        error: (error) => {
          console.error("Error parsing CSV:", error);
          toast.error("We couldn’t parse that file. Please check the CSV format and try again.");
          resetProgress();
          e.currentTarget.value = "";
        },
      });
    } catch (error) {
      console.error("Error reading file:", error);
      toast.error("We couldn’t read the file. Please try again.");
      resetProgress();
      e.currentTarget.value = "";
    }
  };

  const selectedFileName = fileInputRef.current?.files?.[0]?.name;

  return (
    <div className="space-y-6">
      <DialogHeader>
        <DialogTitle>Upload CSV File</DialogTitle>
        <DialogDescription>
          Select a CSV file containing your transaction data.
        </DialogDescription>
      </DialogHeader>

      <div
        className="
          rounded-xl border-2 border-dashed p-8 text-center
          bg-muted/20 hover:bg-muted/30 transition-colors
          focus-within:ring-2 focus-within:ring-ring
        "
      >
        <input
          id="import-csv-input"
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept=".csv,text/csv"
          className="hidden"
          aria-label="Upload CSV file"
        />

        <Button
          size="lg"
          onClick={() => fileInputRef.current?.click()}
          disabled={isLoading}
          className="gap-2"
        >
          <FileUp className="size-5" />
          Select CSV
        </Button>

        {selectedFileName ? (
          <p className="mt-3 text-sm text-muted-foreground">
            Selected: <span className="font-medium truncate inline-block max-w-[18rem] align-bottom">{selectedFileName}</span>
          </p>
        ) : (
          <div className="mt-3 space-y-1 text-xs text-muted-foreground">
            <p>Maximum file size: {humanFileSize}</p>
            <p>Format: CSV with headers (up to {MAX_IMPORT_LIMIT} rows)</p>
          </div>
        )}

        {isLoading && (
          <div className="mt-4 space-y-2">
            <Progress value={progress} className="h-2" />
            <p className="text-xs text-muted-foreground">Parsing file... {progress}%</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FileUploadStep;
