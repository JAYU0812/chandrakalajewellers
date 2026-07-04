import React, { useState, useRef } from 'react';
import { Upload, X, FileText, Image as ImageIcon, AlertCircle } from 'lucide-react';
import { uploadMediaFile } from '../../lib/media';
import { LuxuryButton } from './LuxuryButton';

interface FileUploaderProps {
  bucketId: string;
  folderPath?: string;
  onUploadSuccess: (url: string, path: string) => void;
  onUploadError?: (error: string) => void;
  allowedTypesLabel?: string;
}

export const FileUploader: React.FC<FileUploaderProps> = ({
  bucketId,
  folderPath = '',
  onUploadSuccess,
  onUploadError,
  allowedTypesLabel = 'Supports: WebP, JPEG, PNG (Max 5MB) | MP4 (Max 20MB)',
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const processFile = (file: File) => {
    setLocalError(null);
    setSelectedFile(file);
    setProgress(0);

    // Generate previews for images
    if (file.type.startsWith('image/')) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    } else {
      setPreviewUrl(null);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const clearSelection = () => {
    setSelectedFile(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
    setProgress(0);
    setLocalError(null);
  };

  const handleUploadSubmit = async () => {
    if (!selectedFile) return;

    setUploading(true);
    setLocalError(null);

    const response = await uploadMediaFile(
      selectedFile,
      bucketId,
      folderPath,
      (prog) => setProgress(prog)
    );

    setUploading(false);

    if (response.error) {
      const errMsg = typeof response.error === 'string' ? response.error : 'Failed to upload media file.';
      setLocalError(errMsg);
      if (onUploadError) onUploadError(errMsg);
    } else {
      onUploadSuccess(response.url, response.path);
      clearSelection();
    }
  };

  return (
    <div className="w-full font-sans">
      <input
        ref={fileInputRef}
        type="file"
        onChange={handleFileChange}
        className="hidden"
        accept="image/webp,image/jpeg,image/png,video/mp4"
      />

      {!selectedFile ? (
        // Drag & Drop Area
        <div
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          onClick={triggerFileInput}
          className={`
            border-2 border-dashed rounded-luxury-md p-8 text-center cursor-pointer select-none
            transition-all duration-300 flex flex-col items-center justify-center gap-4
            ${dragActive 
              ? 'border-gold-primary bg-gold-light/20 dark:bg-gold-light/10' 
              : 'border-gold-primary/25 hover:border-gold-primary/60 bg-white/5 hover:bg-white/10 dark:hover:bg-black/20'
            }
          `}
        >
          <div className="w-12 h-12 bg-gold-primary/10 text-gold-primary rounded-full flex items-center justify-center">
            <Upload className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <p className="text-sm font-medium text-obsidian dark:text-pearl">
              Drag and drop your media file here, or <span className="text-gold-primary underline">browse</span>
            </p>
            <p className="text-[10px] text-obsidian/40 dark:text-pearl/40 mt-1.5 tracking-wider uppercase">
              {allowedTypesLabel}
            </p>
          </div>
        </div>
      ) : (
        // Selected File Preview Pane
        <div className="border border-gold-primary/20 rounded-luxury-md p-4 bg-white/5 dark:bg-black/10 flex flex-col gap-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 overflow-hidden">
              {previewUrl ? (
                <div className="w-16 h-16 rounded overflow-hidden border border-gold-primary/10 shrink-0">
                  <img src={previewUrl} alt="Thumbnail preview" className="w-full h-full object-cover" />
                </div>
              ) : (
                <div className="w-16 h-16 bg-gold-primary/10 border border-gold-primary/20 text-gold-primary rounded flex items-center justify-center shrink-0">
                  {selectedFile.type.startsWith('video/') ? (
                    <FileText className="w-8 h-8" /> // Represent video files
                  ) : (
                    <ImageIcon className="w-8 h-8" />
                  )}
                </div>
              )}
              <div className="overflow-hidden">
                <p className="text-sm font-semibold truncate">{selectedFile.name}</p>
                <p className="text-[10px] text-obsidian/40 dark:text-pearl/40 uppercase tracking-widest">
                  {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                </p>
              </div>
            </div>
            
            <button
              onClick={clearSelection}
              disabled={uploading}
              className="p-2 text-obsidian/50 dark:text-pearl/50 hover:text-rose-500 hover:bg-rose-500/10 rounded-full transition-all cursor-pointer disabled:opacity-50"
              aria-label="Clear selection"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Validation or Upload Error alerts */}
          {localError && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-500 rounded-luxury-sm flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <p className="text-xs font-medium leading-normal">{localError}</p>
            </div>
          )}

          {/* Progress Indicators */}
          {uploading && (
            <div className="w-full flex flex-col gap-1.5">
              <div className="flex justify-between text-[10px] uppercase tracking-widest text-gold-primary font-semibold">
                <span>Uploading and compressing...</span>
                <span>{progress}%</span>
              </div>
              <div className="w-full h-1 bg-obsidian/10 dark:bg-pearl/10 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gold-primary transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}

          <div className="flex justify-end gap-3 mt-2">
            <LuxuryButton
              variant="outline"
              size="sm"
              onClick={clearSelection}
              disabled={uploading}
            >
              Cancel
            </LuxuryButton>
            <LuxuryButton
              variant="gold"
              size="sm"
              onClick={handleUploadSubmit}
              loading={uploading}
            >
              Upload Asset
            </LuxuryButton>
          </div>
        </div>
      )}
    </div>
  );
};
