import { supabase } from './supabase';

export interface UploadProgressCallback {
  (progress: number): void;
}

export interface CompressOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
}

/**
 * Validates files against the defined project storage constraints.
 * Images must be <= 5MB (webp, jpeg, png).
 * Videos must be <= 20MB (mp4).
 */
export const validateFile = (file: File): { valid: boolean; error?: string } => {
  const allowedImageTypes = ['image/webp', 'image/jpeg', 'image/png'];
  const allowedVideoTypes = ['video/mp4'];
  
  if (allowedImageTypes.includes(file.type)) {
    const maxSizeBytes = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSizeBytes) {
      return { valid: false, error: `Image size exceeds the 5MB limit (${(file.size / (1024 * 1024)).toFixed(2)}MB).` };
    }
    return { valid: true };
  }
  
  if (allowedVideoTypes.includes(file.type)) {
    const maxSizeBytes = 20 * 1024 * 1024; // 20MB
    if (file.size > maxSizeBytes) {
      return { valid: false, error: `Video size exceeds the 20MB limit (${(file.size / (1024 * 1024)).toFixed(2)}MB).` };
    }
    return { valid: true };
  }
  
  return { valid: false, error: `Unsupported file type (${file.type}). Allowed formats: WebP, JPEG, PNG, MP4.` };
};

/**
 * Compresses an image file in-memory using the HTML5 Canvas element.
 * Resizes dimensions to a maximum boundary (default 2000px) and converts to .webp at 80% quality.
 */
export const compressImage = (file: File, options: CompressOptions = {}): Promise<File> => {
  const maxWidth = options.maxWidth || 2000;
  const maxHeight = options.maxHeight || 2000;
  const quality = options.quality || 0.8;

  return new Promise((resolve, reject) => {
    // Return immediately if it's already a WebP image under 500KB (no optimization needed)
    if (file.type === 'image/webp' && file.size < 500 * 1024) {
      return resolve(file);
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        // Maintain aspect ratio while bounding dimensions
        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          return reject(new Error('Could not get HTML Canvas 2D context.'));
        }

        // Draw image onto canvas bounds
        ctx.drawImage(img, 0, 0, width, height);

        // Export as webp blob
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              return reject(new Error('Canvas compilation returned empty blob.'));
            }
            const compressedName = file.name.replace(/\.[^/.]+$/, "") + ".webp";
            const compressedFile = new File([blob], compressedName, {
              type: 'image/webp',
              lastModified: Date.now(),
            });
            resolve(compressedFile);
          },
          'image/webp',
          quality
        );
      };
      img.onerror = () => reject(new Error('Failed to load image element.'));
    };
    reader.onerror = () => reject(new Error('Failed to read media file.'));
  });
};

/**
 * Uploads a file to a specific Supabase storage bucket.
 * Automates compression on image uploads.
 */
export const uploadMediaFile = async (
  file: File,
  bucketId: string,
  folderPath: string = '',
  onProgress?: UploadProgressCallback
): Promise<{ path: string; url: string; error?: any }> => {
  try {
    // 1. Validate size and type constraints
    const validation = validateFile(file);
    if (!validation.valid) {
      throw new Error(validation.error);
    }

    let fileToUpload = file;

    // 2. Apply WebP compression pipeline to images
    if (file.type.startsWith('image/')) {
      try {
        fileToUpload = await compressImage(file);
      } catch (err) {
        console.warn('Image compression pipeline skipped, uploading raw file:', err);
      }
    }

    // 3. Assemble upload path
    const fileExt = fileToUpload.name.split('.').pop();
    const uniqueId = Math.random().toString(36).substring(2, 9);
    const fileName = `${Date.now()}_${uniqueId}.${fileExt}`;
    const cleanFolderPath = folderPath.trim().replace(/\/$/, '');
    const storagePath = cleanFolderPath ? `${cleanFolderPath}/${fileName}` : fileName;

    // 4. Perform Supabase Storage Upload
    // Note: Supabase JS Client uploads do not natively support progress handlers,
    // so we simulate progress updates for visual completeness.
    if (onProgress) {
      onProgress(10);
      setTimeout(() => onProgress(45), 200);
      setTimeout(() => onProgress(80), 500);
    }

    const { data, error } = await supabase.storage
      .from(bucketId)
      .upload(storagePath, fileToUpload, {
        cacheControl: '3600',
        upsert: false,
      });

    if (error) throw error;

    if (onProgress) onProgress(100);

    // 5. Build public CDN url
    const { data: { publicUrl } } = supabase.storage
      .from(bucketId)
      .getPublicUrl(storagePath);

    return {
      path: data.path,
      url: publicUrl,
    };
  } catch (err: any) {
    return {
      path: '',
      url: '',
      error: err.message || err,
    };
  }
};
