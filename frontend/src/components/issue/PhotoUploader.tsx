import React, { useState, useRef } from 'react';
import { Camera, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

const MIN_IMAGE_DIMENSION = 600;
const MAX_IMAGE_DIMENSION = 2048;

// Normalizes any supported source resolution before the evidence gate sees it.
// Upscaling makes small camera images processable; it cannot create missing visual detail.
const normalizeImage = (file: File): Promise<File> => {
  return new Promise((resolve) => {
    if (!file.type.startsWith('image/')) {
      resolve(file);
      return;
    }
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const sourceWidth = img.width;
        const sourceHeight = img.height;
        const shortestSide = Math.min(sourceWidth, sourceHeight);
        const longestSide = Math.max(sourceWidth, sourceHeight);

        let scale = shortestSide < MIN_IMAGE_DIMENSION
          ? MIN_IMAGE_DIMENSION / Math.max(shortestSide, 1)
          : 1;
        if (longestSide * scale > MAX_IMAGE_DIMENSION) {
          scale = MAX_IMAGE_DIMENSION / longestSide;
        }

        const width = Math.max(1, Math.round(sourceWidth * scale));
        const height = Math.max(1, Math.round(sourceHeight * scale));
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(file);
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              resolve(file);
              return;
            }
            const normalizedName = file.name.replace(/\.[^.]+$/, '') || 'community-demand';
            resolve(new File([blob], `${normalizedName}.jpg`, { type: 'image/jpeg', lastModified: Date.now() }));
          },
          'image/jpeg',
          0.85
        );
      };
      img.onerror = () => resolve(file);
    };
    reader.onerror = () => resolve(file);
  });
};

export interface PhotoUploaderProps {
  onCapture: (file: File, source: 'camera' | 'gallery') => void;
  className?: string;
}

export const PhotoUploader: React.FC<PhotoUploaderProps> = ({ onCapture, className }) => {
  const [isDragActive, setIsDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resizing, setResizing] = useState(false);
  const galleryInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const validateAndProcessFile = async (file: File, source: 'camera' | 'gallery') => {
    setError(null);

    // The backend normalizer accepts these common community-capture formats.
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setError('Unsupported image format. Please upload a JPG, PNG, or WebP image.');
      return;
    }

    // Keep the client limit aligned with the backend's 25MB evidence limit.
    const maxBytes = 25 * 1024 * 1024;
    if (file.size > maxBytes) {
      setError('File is too large. Maximum allowed size is 25MB.');
      return;
    }

    try {
      setResizing(true);
      const processedFile = await normalizeImage(file);
      onCapture(processedFile, source);
    } catch {
      setError('Error processing image. Please try again.');
    } finally {
      setResizing(false);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragActive(true);
    } else if (e.type === 'dragleave') {
      setIsDragActive(false);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      await validateAndProcessFile(e.dataTransfer.files[0], 'gallery');
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>, source: 'camera' | 'gallery') => {
    if (e.target.files && e.target.files[0]) {
      await validateAndProcessFile(e.target.files[0], source);
    }
  };

  return (
    <div className={cn('w-full space-y-3', className)}>
      <input
        ref={galleryInputRef}
        type="file"
        accept="image/png, image/jpeg, image/jpg, image/webp"
        className="hidden"
        onChange={(e) => handleFileChange(e, 'gallery')}
        disabled={resizing}
      />
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/png, image/jpeg, image/jpg, image/webp"
        // @ts-ignore
        capture="environment"
        className="hidden"
        onChange={(e) => handleFileChange(e, 'camera')}
        disabled={resizing}
      />

      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => {
            cameraInputRef.current?.click();
          }}
          className="flex flex-col items-center justify-center p-4 bg-white border border-slate-250 hover:bg-slate-50 hover:border-primary rounded-medium shadow-sm transition-all cursor-pointer text-center group"
        >
          <div className="w-10 h-10 rounded-full bg-teal-50 text-teal-700 border border-teal-200 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
            <Camera size={20} />
          </div>
          <span className="text-xs font-bold text-slate-800">Take Photo</span>
          <span className="text-[10px] text-slate-400 mt-0.5">Use Live Camera & GPS</span>
        </button>

        <button
          type="button"
          onClick={() => {
            galleryInputRef.current?.click();
          }}
          className="flex flex-col items-center justify-center p-4 bg-white border border-slate-250 hover:bg-slate-50 hover:border-primary rounded-medium shadow-sm transition-all cursor-pointer text-center group"
        >
          <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-700 border border-blue-200 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
            <Camera size={20} />
          </div>
          <span className="text-xs font-bold text-slate-800">Upload Photo</span>
          <span className="text-[10px] text-slate-400 mt-0.5">Select Gallery / Files</span>
        </button>
      </div>

      <div
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        onClick={() => galleryInputRef.current?.click()}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            galleryInputRef.current?.click();
          }
        }}
        tabIndex={0}
        role="button"
        aria-label="Upload issue photo. Drag and drop, or press enter to select file."
        className={cn(
          'border-2 border-dashed rounded-medium p-6 flex flex-col items-center justify-center text-center cursor-pointer select-none min-h-[140px] transition-all',
          isDragActive 
            ? 'border-primary bg-blue-50/30' 
            : 'border-slate-300 bg-white hover:border-slate-400 hover:bg-slate-50/50'
        )}
      >
        {resizing ? (
          <div className="flex flex-col items-center space-y-2">
            <span className="w-8 h-8 rounded-full border-4 border-slate-200 border-t-primary animate-spin" />
            <span className="text-xs font-semibold text-slate-500 font-sans">Optimizing photo quality...</span>
          </div>
        ) : (
          <div className="space-y-1">
            <p className="text-xs font-semibold text-slate-700 font-sans">
              Or drag and drop photo file here
            </p>
            <p className="text-[10px] text-slate-400 font-normal font-sans">
              Any resolution · JPG, PNG, or WebP up to 25MB · auto-optimized before review
            </p>
          </div>
        )}
      </div>

      {error && (
        <div className="mt-2 flex items-center gap-2 p-3 text-xs bg-rose-50 text-rose-700 border border-rose-100 rounded-small select-none animate-fade">
          <AlertCircle size={14} className="shrink-0" />
          <span className="font-semibold">{error}</span>
        </div>
      )}
    </div>
  );
};
export default PhotoUploader;
