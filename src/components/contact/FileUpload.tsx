import { useState, useRef } from "react";
import { Upload, X, FileText, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FileUploadProps {
  onFileSelect: (file: File | null) => void;
  tr: boolean;
  maxSizeMB?: number;
  allowedTypes?: string[];
}

export const FileUpload = ({ 
  onFileSelect, 
  tr, 
  maxSizeMB = 5, 
  allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/webp'] 
}: FileUploadProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = (selectedFile: File) => {
    setError(null);

    if (!allowedTypes.includes(selectedFile.type)) {
      const errorMsg = tr 
        ? "Desteklenmeyen dosya türü. Lütfen PDF veya resim yükleyin." 
        : "Unsupported file type. Please upload a PDF or an image.";
      setError(errorMsg);
      return;
    }

    if (selectedFile.size > maxSizeMB * 1024 * 1024) {
      const errorMsg = tr 
        ? `Dosya boyutu ${maxSizeMB}MB'ı geçemez.` 
        : `File size cannot exceed ${maxSizeMB}MB.`;
      setError(errorMsg);
      return;
    }

    setFile(selectedFile);
    onFileSelect(selectedFile);
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const removeFile = () => {
    setFile(null);
    setError(null);
    onFileSelect(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-foreground mb-2">
        {tr ? 'Ek Dosya (Opsiyonel)' : 'Attachment (Optional)'}
      </label>
      
      {!file ? (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`
            relative cursor-pointer border-2 border-dashed rounded-xl p-6 transition-all duration-200
            flex flex-col items-center justify-center text-center gap-3
            ${isDragging ? 'border-primary bg-primary/5' : 'border-border/60 hover:border-primary/40 hover:bg-background/40'}
            ${error ? 'border-destructive/50 bg-destructive/5' : ''}
          `}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={onFileChange}
            accept={allowedTypes.join(',')}
            className="hidden"
          />
          <div className="w-10 h-10 rounded-full bg-background flex items-center justify-center shadow-sm border border-border/40">
            <Upload className={`w-5 h-5 ${error ? 'text-destructive' : 'text-muted-foreground'}`} />
          </div>
          <div>
            <p className="text-sm font-medium">
              {tr ? 'Dosya yüklemek için tıklayın veya sürükleyin' : 'Click or drag file to upload'}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              PDF, PNG, JPG (Max {maxSizeMB}MB)
            </p>
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-3 p-3 rounded-xl border border-border/60 bg-background/60">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
            <FileText className="w-5 h-5 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{file.name}</p>
            <p className="text-xs text-muted-foreground">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={removeFile}
            className="h-8 w-8 text-muted-foreground hover:text-destructive shrink-0"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 text-xs text-destructive animate-in fade-in slide-in-from-top-1">
          <AlertCircle className="w-3.5 h-3.5" />
          <span>{error}</span>
        </div>
      )}
      
      {file && !error && (
        <div className="flex items-center gap-2 text-xs text-emerald-500 animate-in fade-in slide-in-from-top-1">
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>{tr ? 'Dosya hazır' : 'File ready'}</span>
        </div>
      )}
    </div>
  );
};