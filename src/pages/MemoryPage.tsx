import { useState, useRef } from "react";
import TopBar from "@/components/TopBar";
import { Upload, File, Trash2, X } from "lucide-react";

interface UploadedFile {
  name: string;
  size: number;
  type: string;
  url: string;
}

const MemoryPage = () => {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = (fileList: FileList) => {
    const newFiles = Array.from(fileList).map((file) => ({
      name: file.name,
      size: file.size,
      type: file.type,
      url: URL.createObjectURL(file),
    }));
    setFiles((prev) => [...prev, ...newFiles]);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files.length) handleFiles(e.dataTransfer.files);
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="flex h-full flex-col">
      <TopBar title="📁  Memory — File Upload" />

      <div className="flex-1 overflow-y-auto px-6 py-6">
        <div className="mx-auto max-w-2xl space-y-6">
          {/* Drop zone */}
          <div
            onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
            onDragLeave={() => setDragActive(false)}
            onDrop={handleDrop}
            onClick={() => inputRef.current?.click()}
            className={`flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed p-12 transition-all animate-fade-in ${
              dragActive
                ? "border-primary bg-primary/5"
                : "border-border hover:border-primary/50"
            }`}
          >
            <Upload className={`h-10 w-10 mb-3 ${dragActive ? "text-primary" : "text-muted-foreground"}`} />
            <p className="text-sm font-medium text-foreground mb-1">
              Drop files here or click to upload
            </p>
            <p className="text-xs text-muted-foreground">
              Supports any file type
            </p>
            <input ref={inputRef} type="file" multiple className="hidden" onChange={(e) => e.target.files && handleFiles(e.target.files)} />
          </div>

          {/* File list */}
          {files.length > 0 && (
            <div className="rounded-2xl border border-border bg-card p-5 animate-fade-in">
              <h3 className="mb-4 text-sm font-semibold text-foreground">
                Uploaded Files ({files.length})
              </h3>
              <div className="space-y-2">
                {files.map((file, i) => (
                  <div key={i} className="flex items-center justify-between rounded-xl border border-border px-4 py-3">
                    <div className="flex items-center gap-3 overflow-hidden">
                      <File className="h-4 w-4 shrink-0 text-primary" />
                      <div className="overflow-hidden">
                        <p className="text-sm font-medium text-foreground truncate">{file.name}</p>
                        <p className="text-xs text-muted-foreground">{formatSize(file.size)}</p>
                      </div>
                    </div>
                    <button onClick={() => removeFile(i)} className="text-destructive/60 hover:text-destructive shrink-0">
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MemoryPage;
