import { useState, useRef } from "react";
import imageCompression from "browser-image-compression"; // <-- NEW
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ScanText, X } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { AIScanReceiptData } from "@/features/transaction/transactionType";
import { toast } from "sonner";
import { useProgressLoader } from "@/hooks/use-progress-loader";
import { useAiScanReceiptMutation } from "@/features/transaction/transactionAPI";
import { cn } from "@/lib/utils";

interface ReceiptScannerProps {
  loadingChange: boolean;
  onScanComplete: (data: AIScanReceiptData) => void;
  onLoadingChange: (isLoading: boolean) => void;
}

const MAX_FILE_MB = 5;

const ReceiptScanner = ({
  loadingChange,
  onScanComplete,
  onLoadingChange,
}: ReceiptScannerProps) => {
  const [receipt, setReceipt] = useState<string | null>(null);
  const [filename, setFilename] = useState<string>("");
  const inputRef = useRef<HTMLInputElement | null>(null);

  const { progress, startProgress, updateProgress, doneProgress, resetProgress } =
    useProgressLoader({ initialProgress: 12, completionDelay: 500 });

  const [aiScanReceipt] = useAiScanReceiptMutation();

  const validateFile = (file: File | undefined) => {
    if (!file) {
      toast.error("Please select a file");
      return false;
    }
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file (JPG/PNG)");
      return false;
    }
    const sizeMb = file.size / (1024 * 1024);
    if (sizeMb > MAX_FILE_MB) {
      toast.error(`File too large. Max ${MAX_FILE_MB}MB`);
      return false;
    }
    return true;
  };

  const compressFile = async (file: File) => {
    // Only compress if image
    if (!file.type.startsWith("image/")) return file;

    try {
      const options = {
        maxSizeMB: 1.5, // aim for ~1.5MB
        maxWidthOrHeight: 1600, // downscale large photos
        useWebWorker: true,
        initialQuality: 0.8,
      };
      const compressedFile = await imageCompression(file, options);
      return compressedFile;
    } catch (err) {
      console.error("Compression failed, using original file", err);
      return file;
    }
  };

  const kickOffScan = async (file: File) => {
    const formData = new FormData();
    formData.append("receipt", file);

    startProgress(12);
    onLoadingChange(true);
    setFilename(file.name);

    // preview
    const reader = new FileReader();
    reader.onload = (e) => setReceipt((e.target?.result as string) || null);
    reader.readAsDataURL(file);

    // playful “indeterminate → determinate” feel
    let current = 12;
    const interval = setInterval(() => {
      const bump = current < 88 ? 8 : 1;
      current = Math.min(current + bump, 92);
      updateProgress(current);
    }, 220);

    aiScanReceipt(formData)
      .unwrap()
      .then((res) => {
        updateProgress(100);
        onScanComplete(res.data);
        toast.success("Receipt scanned successfully");
      })
      .catch((error) => {
        toast.error(error?.data?.message || "Failed to scan receipt");
      })
      .finally(() => {
        clearInterval(interval);
        doneProgress();
        resetProgress();
        onLoadingChange(false);
      });
  };

  const handleReceiptUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!validateFile(file)) return;
    const compressed = await compressFile(file!); // <-- compress here
    await kickOffScan(compressed);
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (loadingChange) return;
    const file = e.dataTransfer.files?.[0];
    if (!validateFile(file)) return;
    const compressed = await compressFile(file!); // <-- compress here
    await kickOffScan(compressed);
  };

  const clearPreview = () => {
    setReceipt(null);
    setFilename("");
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div className="space-y-3">
      <Label htmlFor="receipt-input" className="text-sm font-medium">
        AI Scan Receipt
      </Label>

      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        className={cn(
          "rounded-xl border p-4 bg-white/60 dark:bg-input/20",
          "transition-colors",
          loadingChange ? "opacity-90" : "hover:bg-accent/40"
        )}
        aria-busy={loadingChange}
      >
        <div className="flex items-start gap-4">
          {/* Preview */}
          <div
            className={cn(
              "relative h-14 w-14 rounded-lg border bg-cover bg-center overflow-hidden",
              !receipt && "bg-muted grid place-items-center"
            )}
            style={receipt ? { backgroundImage: `url(${receipt})` } : undefined}
          >
            {!receipt && (
              <ScanText className="h-5 w-5 text-muted-foreground !stroke-1.5" />
            )}
            {!!receipt && (
              <button
                type="button"
                className="absolute -right-1 -top-1 grid place-items-center rounded-full bg-background/90 border p-0.5 shadow-xs"
                aria-label="Clear preview"
                onClick={clearPreview}
                disabled={loadingChange}
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          {/* Control */}
          <div className="flex-1">
            {!loadingChange ? (
              <>
                <label
                  htmlFor="receipt-input"
                  className="inline-block cursor-pointer"
                >
                  <Input
                    id="receipt-input"
                    ref={inputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleReceiptUpload}
                    className="max-w-[280px] h-9 cursor-pointer text-sm file:mr-2 file:rounded file:border-0 file:bg-primary file:px-3 file:py-px file:text-sm file:font-medium file:text-white hover:file:bg-primary/90"
                    disabled={loadingChange}
                  />
                </label>
                <div className="mt-2 px-1 text-[11px] text-muted-foreground">
                  Drag & drop an image here, or click to upload. JPG/PNG up to {MAX_FILE_MB}MB
                  {filename && (
                    <span className="ml-2 text-foreground/80">• {filename}</span>
                  )}
                </div>
              </>
            ) : (
              <div className="space-y-2 pt-1.5">
                <Progress value={progress} className="h-2 w-[280px] rounded-full" />
                <p className="text-xs text-muted-foreground">
                  Scanning receipt… {progress}%
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReceiptScanner;
