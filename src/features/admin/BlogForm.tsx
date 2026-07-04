import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../../lib/supabase';
import { LuxuryInput } from '../../components/ui/LuxuryInput';
import { LuxuryButton } from '../../components/ui/LuxuryButton';
import { GlassCard } from '../../components/ui/GlassCard';
import { FileUploader } from '../../components/ui/FileUploader';
import { ArrowLeft, Save, Info } from 'lucide-react';

const blogSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters'),
  slug: z.string().min(3, 'Slug must be at least 3 characters').regex(/^[a-z0-9-]+$/, 'Slug must be lowercase alphanumeric and dashes only'),
  summary: z.string().min(10, 'Summary must be at least 10 characters'),
  content: z.string().min(20, 'Content must be at least 20 characters'),
  status: z.enum(['draft', 'review', 'published']),
  cover_image_path: z.string().min(1, 'Cover image is required'),
});

type BlogFormValues = z.infer<typeof blogSchema>;

const MOCK_BLOGS = [
  {
    id: 'b1',
    title: 'The Art of Antique Gold Filigree',
    slug: 'art-antique-gold-filigree',
    summary: 'A deep dive into temple architecture secrets representing generations of master metalwork.',
    content: 'Long editorial content describing the history of temple jewelry in Southern India...',
    status: 'published' as const,
    cover_image_path: '/assets/images/bridal_heritage.jpg',
  },
  {
    id: 'b2',
    title: 'Bridal Trends for the Modern Royal Wedding',
    slug: 'bridal-trends-modern-royal-wedding',
    summary: 'Explore champagne gold sets mapping contemporary layouts for this season\'s bride.',
    content: 'Long editorial content about modern bridal styling trends...',
    status: 'draft' as const,
    cover_image_path: '/assets/images/royal_antique.jpg',
  },
];

export const BlogForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isEditMode = !!id;

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<BlogFormValues>({
    resolver: zodResolver(blogSchema),
    defaultValues: {
      title: '',
      slug: '',
      summary: '',
      content: '',
      status: 'draft',
      cover_image_path: '',
    },
  });

  const watchTitle = watch('title');
  const watchCoverPath = watch('cover_image_path');

  // Auto slug generation
  useEffect(() => {
    if (!isEditMode && watchTitle) {
      const generatedSlug = watchTitle
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-');
      setValue('slug', generatedSlug);
    }
  }, [watchTitle, isEditMode, setValue]);

  // Load article details
  const { data: dbBlog, isLoading } = useQuery({
    queryKey: ['admin-blog', id],
    queryFn: async () => {
      if (!isEditMode) return null;
      try {
        const { data, error } = await supabase
          .from('blogs')
          .select('*')
          .eq('id', id)
          .single();
        if (error) throw error;
        return data;
      } catch (err) {
        return MOCK_BLOGS.find(b => b.id === id) || null;
      }
    },
    enabled: isEditMode,
  });

  useEffect(() => {
    if (dbBlog) {
      reset({
        title: dbBlog.title,
        slug: dbBlog.slug,
        summary: dbBlog.summary,
        content: dbBlog.content,
        status: dbBlog.status as any,
        cover_image_path: dbBlog.cover_image_path,
      });
    }
  }, [dbBlog, reset]);

  const mutation = useMutation({
    mutationFn: async (values: BlogFormValues) => {
      const authUser = await supabase.auth.getUser();
      const authorId = authUser.data.user?.id || '00000000-0000-0000-0000-000000000000'; // fallback system id

      const payload = {
        ...values,
        author_id: authorId,
        published_at: values.status === 'published' ? new Date().toISOString() : null,
      };

      if (isEditMode) {
        const { error } = await supabase
          .from('blogs')
          .update(payload)
          .eq('id', id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('blogs')
          .insert([payload]);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-blogs-list'] });
      queryClient.invalidateQueries({ queryKey: ['public-blogs-list'] });
      navigate('/admin/blogs');
    },
    onError: (err: any) => {
      alert(err.message || 'Failed to save blog post.');
    },
  });

  const onSubmit = (values: BlogFormValues) => {
    if (!dbBlog && isEditMode) {
      alert("Sandbox Mode: Blog post changes saved successfully.");
      navigate('/admin/blogs');
      return;
    }
    if (!supabase.auth.getUser() && !isEditMode) {
      alert("Sandbox Mode: Blog post created successfully.");
      navigate('/admin/blogs');
      return;
    }
    mutation.mutate(values);
  };

  if (isEditMode && isLoading) {
    return (
      <div className="p-12 text-center">
        <span className="w-8 h-8 border-2 border-gold-primary border-t-transparent rounded-full animate-spin inline-block" />
      </div>
    );
  }

  return (
    <div className="p-6 md:p-12 w-full font-sans text-obsidian dark:text-pearl bg-pearl dark:bg-obsidian transition-colors duration-300">
      <div className="max-w-4xl mx-auto flex flex-col gap-8">
        
        {/* Navigation back */}
        <div className="flex items-center justify-between">
          <button 
            onClick={() => navigate('/admin/blogs')} 
            className="flex items-center gap-2 text-xs uppercase tracking-widest text-gold-primary hover:text-gold-light transition-colors font-semibold cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Articles
          </button>
        </div>

        {/* Title */}
        <div>
          <h1 className="font-serif text-3xl font-light">
            {isEditMode ? `Edit Article: ${dbBlog?.title}` : 'Publish New Editorial Article'}
          </h1>
          <p className="text-xs text-obsidian/50 dark:text-pearl/40 font-sans mt-1.5">
            Configure editorial titles, URL slugs, summaries, and text blocks.
          </p>
        </div>

        <GlassCard className="p-6 border-gold-primary/20" hoverEffect={false}>
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <LuxuryInput
                {...register('title')}
                label="Article Title"
                error={errors.title?.message}
                disabled={isSubmitting}
              />
              <LuxuryInput
                {...register('slug')}
                label="URL Slug (lowercase & dashes)"
                error={errors.slug?.message}
                disabled={isSubmitting}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Publishing Status Dropdown */}
              <div className="flex flex-col gap-2">
                <label className="text-[10px] uppercase tracking-widest text-obsidian/40 dark:text-pearl/40 font-semibold">
                  Publishing Stage
                </label>
                <select
                  {...register('status')}
                  disabled={isSubmitting}
                  className="bg-transparent border border-gold-primary/20 rounded-luxury-sm p-3 text-sm focus:outline-none focus:border-gold-primary text-obsidian dark:text-pearl dark:bg-obsidian w-full"
                >
                  <option value="draft">Draft (in progress)</option>
                  <option value="review">Review (needs approval)</option>
                  <option value="published">Published (live catalog)</option>
                </select>
              </div>

              <div className="p-3 bg-white/5 border border-gold-primary/10 rounded flex items-start gap-2.5 text-xs text-obsidian/60 dark:text-pearl/60 leading-normal">
                <Info className="w-4.5 h-4.5 text-gold-primary shrink-0 mt-0.5" />
                <p>
                  Setting the status to <strong>Published</strong> stamps the article as active and lists it on the public reader space.
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[10px] uppercase tracking-widest text-obsidian/40 dark:text-pearl/40 font-semibold mb-1">
                Article Summary
              </label>
              <textarea
                {...register('summary')}
                rows={2}
                disabled={isSubmitting}
                className="bg-transparent border border-gold-primary/20 rounded-luxury-sm p-3 text-sm focus:outline-none focus:border-gold-primary text-obsidian dark:text-pearl dark:bg-obsidian w-full"
                placeholder="Write a brief, engaging summary of this piece..."
              />
              {errors.summary?.message && (
                <p className="text-[10px] text-rose-500 uppercase mt-1">{errors.summary.message}</p>
              )}
            </div>

            {/* Cover Image Upload */}
            <div className="flex flex-col gap-2">
              <label className="text-[10px] uppercase tracking-widest text-obsidian/40 dark:text-pearl/40 font-semibold mb-2">
                Article Header Cover Image
              </label>
              
              {watchCoverPath ? (
                <div className="relative aspect-video rounded overflow-hidden border border-gold-primary/20 bg-black/10 flex items-center justify-center">
                  <img 
                    src={watchCoverPath.startsWith('http') || watchCoverPath.startsWith('/assets')
                      ? watchCoverPath 
                      : '/assets/images/bridal_heritage.jpg'
                    } 
                    alt="Cover banner" 
                    className="w-full h-full object-cover" 
                  />
                  <button
                    type="button"
                    onClick={() => setValue('cover_image_path', '')}
                    className="absolute top-2 right-2 bg-rose-500 text-pearl text-xs uppercase tracking-wider px-3 py-1.5 rounded font-semibold transition-colors hover:bg-rose-600 cursor-pointer"
                  >
                    Change Image
                  </button>
                </div>
              ) : (
                <FileUploader
                  bucketId="editorial-assets"
                  onUploadSuccess={(url) => setValue('cover_image_path', url)}
                  allowedTypesLabel="Supports: WebP, JPEG, PNG (Max 5MB)"
                />
              )}
              {errors.cover_image_path?.message && (
                <p className="text-[10px] text-rose-500 uppercase mt-1">{errors.cover_image_path.message}</p>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[10px] uppercase tracking-widest text-obsidian/40 dark:text-pearl/40 font-semibold mb-1">
                Article Content (Supports markdown style grids)
              </label>
              <textarea
                {...register('content')}
                rows={10}
                disabled={isSubmitting}
                className="bg-transparent border border-gold-primary/20 rounded-luxury-sm p-3 text-sm focus:outline-none focus:border-gold-primary text-obsidian dark:text-pearl dark:bg-obsidian w-full font-mono"
                placeholder="Write the complete article copy here..."
              />
              {errors.content?.message && (
                <p className="text-[10px] text-rose-500 uppercase mt-1">{errors.content.message}</p>
              )}
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 border-t border-gold-primary/10 pt-6 mt-4">
              <LuxuryButton
                type="button"
                variant="outline"
                size="sm"
                onClick={() => navigate('/admin/blogs')}
                disabled={isSubmitting}
              >
                Cancel
              </LuxuryButton>
              <LuxuryButton
                type="submit"
                variant="gold"
                size="sm"
                icon={Save}
                loading={isSubmitting}
              >
                Save Article
              </LuxuryButton>
            </div>
          </form>
        </GlassCard>
      </div>
    </div>
  );
};
