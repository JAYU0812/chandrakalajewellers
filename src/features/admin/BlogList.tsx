import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../../lib/supabase';
import { GlassCard } from '../../components/ui/GlassCard';
import { LuxuryButton } from '../../components/ui/LuxuryButton';
import { Plus, Edit3, Trash2, FileText, ShieldCheck } from 'lucide-react';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  summary: string;
  status: 'draft' | 'review' | 'published';
  published_at: string | null;
  cover_image_path: string;
}

const MOCK_BLOGS: BlogPost[] = [
  {
    id: 'b1',
    title: 'The Art of Antique Gold Filigree',
    slug: 'art-antique-gold-filigree',
    summary: 'A deep dive into temple architecture secrets representing generations of master metalwork.',
    status: 'published',
    published_at: '2026-07-04T12:00:00Z',
    cover_image_path: '/assets/images/bridal_heritage.jpg',
  },
  {
    id: 'b2',
    title: 'Bridal Trends for the Modern Royal Wedding',
    slug: 'bridal-trends-modern-royal-wedding',
    summary: 'Explore champagne gold sets mapping contemporary layouts for this season\'s bride.',
    status: 'draft',
    published_at: null,
    cover_image_path: '/assets/images/royal_antique.jpg',
  },
];

export const BlogList: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: dbBlogs, isLoading } = useQuery({
    queryKey: ['admin-blogs-list'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('blogs')
          .select('*')
          .order('created_at', { ascending: false });
        if (error) throw error;
        return data || [];
      } catch (err) {
        return MOCK_BLOGS;
      }
    },
  });

  const blogs = (dbBlogs && dbBlogs.length > 0 ? dbBlogs : MOCK_BLOGS) as BlogPost[];
  const isSandbox = !dbBlogs || dbBlogs.length === MOCK_BLOGS.length;

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('blogs').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-blogs-list'] });
    },
  });

  const handleDelete = (id: string) => {
    if (!confirm("Are you sure you want to delete this blog article?")) return;
    if (isSandbox) {
      alert("Sandbox Mode: Blog deletion bypassed.");
      return;
    }
    deleteMutation.mutate(id);
  };

  return (
    <div className="p-6 md:p-12 w-full font-sans text-obsidian dark:text-pearl bg-pearl dark:bg-obsidian transition-colors duration-300">
      <div className="flex flex-col gap-8 max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gold-primary/10 pb-6">
          <div>
            <h1 className="font-serif text-3xl font-light text-obsidian dark:text-pearl flex items-center gap-3">
              <FileText className="w-8 h-8 text-gold-primary" /> Blog Articles Editorial CMS
            </h1>
            <p className="text-xs text-obsidian/50 dark:text-pearl/40 mt-1.5 leading-relaxed">
              Publish news, style guides, and design stories under the structured publishing workflow.
            </p>
          </div>
          <div>
            <LuxuryButton 
              variant="gold" 
              size="md" 
              icon={Plus}
              onClick={() => navigate('/admin/blogs/new')}
            >
              Add Article
            </LuxuryButton>
          </div>
        </div>

        {isSandbox && (
          <div className="bg-gold-primary/5 border border-gold-primary/20 rounded-luxury-sm p-4 flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-gold-primary shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs uppercase tracking-widest text-gold-primary font-bold">Blog CMS Sandbox View</h4>
              <p className="text-xs text-obsidian/70 dark:text-pearl/60 mt-1">
                You are viewing local sandbox articles. Status updates are saved in local state memory.
              </p>
            </div>
          </div>
        )}

        {/* Blogs Visual Cards Grid */}
        {isLoading ? (
          <div className="p-12 text-center">
            <span className="w-8 h-8 border-2 border-gold-primary border-t-transparent rounded-full animate-spin inline-block" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {blogs.map((blog) => (
              <GlassCard key={blog.id} className="p-5 border-gold-primary/10 flex flex-col justify-between" hoverEffect={true}>
                <div>
                  <div className="aspect-video rounded overflow-hidden bg-black/10 border border-gold-primary/5 mb-4">
                    <img 
                      src={blog.cover_image_path.startsWith('http') || blog.cover_image_path.startsWith('/assets')
                        ? blog.cover_image_path 
                        : `/assets/images/bridal_heritage.jpg`
                      } 
                      alt={blog.title} 
                      className="w-full h-full object-cover" 
                    />
                  </div>

                  <div>
                    <h3 className="font-serif text-lg text-obsidian dark:text-pearl truncate">{blog.title}</h3>
                    <p className="text-xs text-obsidian/60 dark:text-pearl/60 mt-2 line-clamp-2 leading-relaxed">
                      {blog.summary}
                    </p>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-gold-primary/5 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className={`px-2.5 py-0.5 rounded text-[8px] uppercase tracking-widest font-bold border ${
                      blog.status === 'published'
                        ? 'bg-emerald/10 text-emerald-400 border-emerald/20'
                        : blog.status === 'review'
                        ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                        : 'bg-obsidian/30 text-pearl/50 border-pearl/20'
                    }`}>
                      {blog.status}
                    </span>
                    {blog.published_at && (
                      <span className="text-[9px] text-obsidian/40 dark:text-pearl/40">
                        {new Date(blog.published_at).toLocaleDateString()}
                      </span>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => navigate(`/admin/blogs/${blog.id}/edit`)}
                      className="p-1.5 text-gold-primary hover:text-gold-light border border-gold-primary/20 hover:border-gold-primary rounded transition-all cursor-pointer"
                      aria-label="Edit article"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(blog.id)}
                      className="p-1.5 text-obsidian/40 dark:text-pearl/40 hover:text-rose-500 border border-transparent hover:border-rose-500/20 hover:bg-rose-500/5 rounded transition-all cursor-pointer"
                      aria-label="Delete article"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
