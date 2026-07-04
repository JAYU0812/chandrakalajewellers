import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { FileUploader } from '../../components/ui/FileUploader';
import { GlassCard } from '../../components/ui/GlassCard';
import { LoadingSkeleton } from '../../components/ui/LoadingSkeleton';
import { Copy, Check, Trash2, FolderOpen, Image as ImageIcon, Video, ArrowLeft } from 'lucide-react';

interface StorageFile {
  name: string;
  size: number;
  url: string;
  created_at: string;
}

export const MediaLibrary: React.FC = () => {
  const [bucket, setBucket] = useState<'product-media' | 'editorial-assets'>('product-media');
  const [files, setFiles] = useState<StorageFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);
  const [isMockData, setIsMockData] = useState(false);

  // Load files list
  const fetchFiles = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.storage.from(bucket).list('', {
        limit: 100,
        sortBy: { column: 'created_at', order: 'desc' },
      });

      if (error) throw error;

      if (data && data.length > 0) {
        // Map data to absolute CDN URL paths
        const mappedFiles: StorageFile[] = data
          .filter(item => item.name !== '.emptyFolderPlaceholder')
          .map(item => {
            const { data: { publicUrl } } = supabase.storage.from(bucket).getPublicUrl(item.name);
            return {
              name: item.name,
              size: item.metadata?.size || 0,
              url: publicUrl,
              created_at: item.created_at || new Date().toISOString(),
            };
          });
        setFiles(mappedFiles);
        setIsMockData(false);
      } else {
        // Load default mock files if the bucket is empty
        loadMockFiles();
      }
    } catch (err) {
      console.warn("Storage fetch failed or placeholder credentials used. Loading mock library views:", err);
      loadMockFiles();
    } finally {
      setLoading(false);
    }
  };

  const loadMockFiles = () => {
    const mockFiles: StorageFile[] = [
      {
        name: 'bridal_heritage.jpg',
        size: 2.1 * 1024 * 1024,
        url: '/assets/images/bridal_heritage.jpg',
        created_at: new Date(Date.now() - 3600000 * 24).toISOString(),
      },
      {
        name: 'royal_antique.jpg',
        size: 1.8 * 1024 * 1024,
        url: '/assets/images/royal_antique.jpg',
        created_at: new Date(Date.now() - 3600000 * 12).toISOString(),
      },
      {
        name: 'minimalist_line.jpg',
        size: 1.4 * 1024 * 1024,
        url: '/assets/images/minimalist_line.jpg',
        created_at: new Date(Date.now() - 3600000 * 6).toISOString(),
      },
    ];
    setFiles(mockFiles);
    setIsMockData(true);
  };

  useEffect(() => {
    fetchFiles();
  }, [bucket]);

  const handleCopyLink = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedUrl(url);
    setTimeout(() => setCopiedUrl(null), 2000);
  };

  const handleDeleteFile = async (fileName: string) => {
    if (!confirm(`Are you sure you want to securely delete ${fileName}?`)) return;

    if (isMockData) {
      setFiles(prev => prev.filter(f => f.name !== fileName));
      return;
    }

    try {
      const { error } = await supabase.storage.from(bucket).remove([fileName]);
      if (error) throw error;
      fetchFiles();
    } catch (err: any) {
      alert(err.message || 'Failed to delete file.');
    }
  };

  const handleUploadSuccess = (url: string, path: string) => {
    if (isMockData) {
      // Append temporary mock data on upload success
      const newFile: StorageFile = {
        name: path.split('/').pop() || 'uploaded_image.webp',
        size: 450 * 1024, // Simulated compressed size
        url: url.startsWith('http') ? url : '/assets/images/bridal_heritage.jpg', // Fallback local image preview
        created_at: new Date().toISOString(),
      };
      setFiles(prev => [newFile, ...prev]);
    } else {
      fetchFiles();
    }
  };

  return (
    <div className="min-h-screen bg-pearl dark:bg-obsidian text-obsidian dark:text-pearl p-6 md:p-12 transition-colors duration-300">
      <div className="max-w-7xl mx-auto flex flex-col gap-8">
        
        {/* Navigation back to Dashboard */}
        <div className="flex items-center justify-between">
          <button 
            onClick={() => window.location.href = '/admin/dashboard'} 
            className="flex items-center gap-2 text-xs uppercase tracking-widest text-gold-primary hover:text-gold-light transition-colors font-semibold cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Dashboard
          </button>
          
          <div className="flex flex-col items-end">
            <span className="font-serif text-lg tracking-[0.15em] text-gold-primary uppercase">CHANDRAKALA</span>
            <span className="text-[7px] tracking-[0.35em] text-obsidian/50 dark:text-pearl/40 uppercase font-sans">JEWELLERS</span>
          </div>
        </div>

        {/* Header Title */}
        <div>
          <h1 className="font-serif text-3xl md:text-4xl font-light">Media Resource Library</h1>
          <p className="text-xs text-obsidian/50 dark:text-pearl/40 font-sans leading-relaxed mt-1.5">
            Manage high-resolution collections catalog visuals, product loop videos, and lifestyle editorial assets.
          </p>
        </div>

        {/* Content Workspace Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* Left Column: Upload Controls */}
          <div className="flex flex-col gap-6 lg:col-span-1">
            <GlassCard className="p-6" hoverEffect={false}>
              <h2 className="font-serif text-lg text-gold-primary mb-4 flex items-center gap-2">
                <FolderOpen className="w-5 h-5" /> Media Bucket Controls
              </h2>
              
              {/* Select Active Storage Bucket */}
              <div className="flex flex-col gap-2 mb-6">
                <label className="text-[10px] uppercase tracking-widest text-obsidian/40 dark:text-pearl/40 font-semibold">Select Storage Bucket</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setBucket('product-media')}
                    className={`py-2 px-3 text-xs font-sans font-medium uppercase tracking-wider rounded border text-center transition-all duration-300 cursor-pointer ${
                      bucket === 'product-media'
                        ? 'bg-gold-primary text-obsidian border-gold-primary shadow-sm'
                        : 'border-gold-primary/25 text-gold-primary hover:bg-gold-primary/5'
                    }`}
                  >
                    Product Media
                  </button>
                  <button
                    onClick={() => setBucket('editorial-assets')}
                    className={`py-2 px-3 text-xs font-sans font-medium uppercase tracking-wider rounded border text-center transition-all duration-300 cursor-pointer ${
                      bucket === 'editorial-assets'
                        ? 'bg-gold-primary text-obsidian border-gold-primary shadow-sm'
                        : 'border-gold-primary/25 text-gold-primary hover:bg-gold-primary/5'
                    }`}
                  >
                    Editorial Assets
                  </button>
                </div>
              </div>

              {/* File Uploader Primitive */}
              <FileUploader
                bucketId={bucket}
                onUploadSuccess={handleUploadSuccess}
                allowedTypesLabel={
                  bucket === 'product-media'
                    ? 'Supports: WebP, JPEG, PNG (Max 5MB) | MP4 (Max 20MB)'
                    : 'Supports: WebP, JPEG, PNG (Max 5MB)'
                }
              />
            </GlassCard>
          </div>

          {/* Right Column: Files Grid Visualizer */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-gold-primary/10 pb-4">
              <h3 className="font-serif text-lg">Active Assets ({files.length})</h3>
              {isMockData && (
                <span className="text-[9px] uppercase bg-gold-primary/10 text-gold-primary border border-gold-primary/20 rounded px-2.5 py-1 tracking-widest font-semibold animate-pulse">
                  Sandbox Review Mode
                </span>
              )}
            </div>

            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <LoadingSkeleton variant="card" />
                <LoadingSkeleton variant="card" />
              </div>
            ) : files.length === 0 ? (
              <div className="text-center py-20 bg-white/5 border border-gold-primary/10 rounded-luxury-md">
                <ImageIcon className="w-12 h-12 text-gold-primary/30 mx-auto mb-4" />
                <p className="text-sm font-sans text-obsidian/60 dark:text-pearl/50">This storage bucket folder has no active files.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {files.map((file) => {
                  const isVideo = file.name.endsWith('.mp4');
                  const isCopied = copiedUrl === file.url;

                  return (
                    <GlassCard key={file.name} className="p-4 flex flex-col justify-between min-h-64 border-gold-primary/10" hoverEffect={true}>
                      {/* Media Preview Box */}
                      <div className="relative aspect-video rounded bg-black/10 overflow-hidden border border-gold-primary/5 flex items-center justify-center">
                        {isVideo ? (
                          <div className="flex flex-col items-center justify-center text-gold-primary">
                            <Video className="w-8 h-8" />
                            <span className="text-[9px] uppercase tracking-widest mt-1.5">MP4 Preview</span>
                          </div>
                        ) : (
                          <img src={file.url} alt={file.name} className="w-full h-full object-cover" />
                        )}
                      </div>

                      {/* File Details */}
                      <div className="mt-4 flex-1 flex flex-col justify-between">
                        <div className="overflow-hidden">
                          <p className="text-xs font-semibold truncate font-sans" title={file.name}>
                            {file.name}
                          </p>
                          <p className="text-[10px] text-obsidian/40 dark:text-pearl/40 mt-1 uppercase tracking-widest">
                            {(file.size / (1024 * 1024)).toFixed(2)} MB • {new Date(file.created_at).toLocaleDateString()}
                          </p>
                        </div>

                        {/* Action buttons */}
                        <div className="flex items-center gap-2 mt-4 pt-3 border-t border-gold-primary/5">
                          <button
                            onClick={() => handleCopyLink(file.url)}
                            className={`flex-1 py-1.5 px-3 text-[10px] uppercase tracking-wider font-sans font-semibold border rounded transition-all duration-300 flex items-center justify-center gap-1.5 cursor-pointer ${
                              isCopied
                                ? 'bg-emerald text-pearl border-emerald'
                                : 'bg-transparent text-gold-primary border-gold-primary/30 hover:border-gold-primary hover:bg-gold-primary/5'
                            }`}
                          >
                            {isCopied ? (
                              <>
                                <Check className="w-3.5 h-3.5" /> Copied
                              </>
                            ) : (
                              <>
                                <Copy className="w-3.5 h-3.5" /> Copy CDN URL
                              </>
                            )}
                          </button>

                          <button
                            onClick={() => handleDeleteFile(file.name)}
                            className="p-1.5 text-obsidian/40 dark:text-pearl/40 hover:text-rose-500 border border-transparent hover:border-rose-500/20 hover:bg-rose-500/5 rounded transition-all cursor-pointer"
                            aria-label="Delete asset"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </GlassCard>
                  );
                })}
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};
