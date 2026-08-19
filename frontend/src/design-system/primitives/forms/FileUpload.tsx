import React, { useState, useRef } from 'react';
import { UploadCloud, FileText, X, AlertCircle } from 'lucide-react';
import { cn } from '../../../lib/utils';
import { Button } from '../buttons/Button';

export interface FileUploadProps {
  label: string;
  accept?: string;
  maxSizeMB?: number;
  multiple?: boolean;
  onFilesSelected?: (files: File[]) => void;
  error?: string;
  disabled?: boolean;
  className?: string;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  label,
  accept = '.pdf,.doc,.docx,.png,.jpg',
  maxSizeMB = 10,
  multiple = false,
  onFilesSelected,
  error,
  disabled = false,
  className,
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = (files: FileList | null) => {
    if (!files) return;
    const fileArray = Array.from(files);
    setSelectedFiles(fileArray);
    onFilesSelected?.(fileArray);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    handleFiles(e.dataTransfer.files);
  };

  const removeFile = (index: number) => {
    const updated = selectedFiles.filter((_, i) => i !== index);
    setSelectedFiles(updated);
    onFilesSelected?.(updated);
  };

  return (
    <div className={cn('w-full font-sans space-y-2', className)}>
      <label className="block text-sm font-medium text-neutral-900 select-none">
        {label}
      </label>

      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={cn(
          'p-6 border-2 border-dashed border-neutral-300 rounded-lg text-center bg-neutral-50/50 hover:bg-neutral-100/50 cursor-pointer transition-colors flex flex-col items-center justify-center min-h-[140px]',
          dragActive && 'border-primary-700 bg-primary-500/10',
          disabled && 'opacity-50 pointer-events-none cursor-not-allowed',
          error && 'border-danger bg-red-50/50'
        )}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          disabled={disabled}
          onChange={(e) => handleFiles(e.target.files)}
          className="sr-only"
        />

        <UploadCloud className="w-8 h-8 text-neutral-700 mb-2" aria-hidden="true" />
        <p className="text-sm font-medium text-neutral-900">
          Drag and drop files here, or <span className="text-primary-700 underline">browse</span>
        </p>
        <p className="text-xs text-neutral-700 mt-1">
          Supported types: {accept} (Max {maxSizeMB}MB)
        </p>
      </div>

      {selectedFiles.length > 0 && (
        <ul className="space-y-1.5 pt-1">
          {selectedFiles.map((file, idx) => (
            <li
              key={`${file.name}-${idx}`}
              className="flex items-center justify-between p-2.5 bg-white border border-neutral-200 rounded-md text-xs"
            >
              <div className="flex items-center gap-2 truncate">
                <FileText className="w-4 h-4 text-primary-700 shrink-0" />
                <span className="font-medium truncate">{file.name}</span>
                <span className="text-neutral-700">({(file.size / 1024 / 1024).toFixed(2)} MB)</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  removeFile(idx);
                }}
                className="min-h-[36px] min-w-[36px] p-1 text-danger hover:bg-red-50"
              >
                <X className="w-4 h-4" />
              </Button>
            </li>
          ))}
        </ul>
      )}

      {error && (
        <p role="alert" className="text-xs font-medium text-danger flex items-center gap-1">
          <AlertCircle className="w-3.5 h-3.5" />
          {error}
        </p>
      )}
    </div>
  );
};
