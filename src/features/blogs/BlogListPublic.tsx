import React, { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../../lib/supabase';
import { Header } from '../../components/common/Header';
import { Footer } from '../../components/common/Footer';
import { GlassCard } from '../../components/ui/GlassCard';
import { LuxuryButton } from '../../components/ui/LuxuryButton';
import { updateMetadata } from '../../lib/seo';
import { BookOpen } from 'lucide-react';

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
    status: 'published',
    published_at: '2026-07-03T10:00:00Z',
    cover_image_path: '/assets/images/royal_antique.jpg',
  },
];

export const BlogListPublic: React.FC = () => {
  // Inject SEO metadata on mount
  useEffect(() => {
    updateMetadata({
      title: 'Design Stories & Editorial Blogs',
      description: 'Explore the heritage secrets, craftsmanship details, and bridal style guides curated by Chandrakala Jewellers.',
      keywords: 'gold jewellery design blog, bridal trends, antique filigree, pure gold sona',
    });
  }, []);

  const { data: dbBlogs, isLoading } = useQuery({
    queryKey: ['public-blogs-list'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('blogs')
          .select('*')
          .eq('status', 'published')
          .order('published_at', { ascending: false });
        if (error) throw error;
        return data || [];
      } catch (err) {
        return MOCK_BLOGS;
      }
    },
  });

  const blogs = (dbBlogs && dbBlogs.length > 0 ? dbBlogs : MOCK_BLOGS) as BlogPost[];

  return (
    <div className="min-h-screen bg-pearl dark:bg-obsidian text-obsidian dark:text-pearl transition-colors duration-300">
      <Header />
      <div className="h-24" />

      <section className="max-w-7xl mx-auto px-6 md:px-12 py-12">
        <div className="text-center mb-16">
          <span className="text-[10px] uppercase tracking-[0.3em] text-gold-primary font-sans font-semibold">Bespoke Design Stories</span>
          <h1 className="font-serif text-3xl md:text-5xl mt-2 font-light">The Aurum Editorial</h1>
          <div className="w-12 h-[1px] bg-gold-primary mx-auto mt-4" />
        </div>

        {isLoading ? (
          <div className="p-12 text-center">
            <span className="w-8 h-8 border-2 border-gold-primary border-t-transparent rounded-full animate-spin inline-block" />
          </div>
        ) : blogs.length === 0 ? (
          <div className="text-center py-24 bg-white/5 border border-gold-primary/10 rounded-luxury-md">
            <BookOpen className="w-12 h-12 text-gold-primary/30 mx-auto mb-4" />
            <p className="text-sm text-obsidian/60 dark:text-pearl/50">Our editorial archive is currently empty.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {blogs.map((blog) => (
              <GlassCard 
                key={blog.id} 
                className="p-5 flex flex-col justify-between min-h-96 border-gold-primary/10 select-none group cursor-pointer"
                onClick={() => window.location.href = `/blogs/${blog.slug}`}
              >
                <div className="relative aspect-video rounded overflow-hidden bg-black/5 border border-gold-primary/5">
                  <img 
                    src={blog.cover_image_path.startsWith('http') || blog.cover_image_path.startsWith('/assets')
                      ? blog.cover_image_path 
                      : '/assets/images/bridal_heritage.jpg'
                    } 
                    alt={blog.title} 
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                  />
                  {blog.published_at && (
                    <div className="absolute top-2 left-2 bg-obsidian/75 text-gold-primary text-[8px] font-mono tracking-widest px-2 py-0.5 rounded uppercase">
                      {new Date(blog.published_at).toLocaleDateString()}
                    </div>
                  )}
                </div>

                <div className="mt-4 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-serif text-xl text-obsidian dark:text-pearl group-hover:text-gold-primary transition-colors">
                      {blog.title}
                    </h3>
                    <p className="text-xs text-obsidian/60 dark:text-pearl/60 mt-3 line-clamp-3 leading-relaxed">
                      {blog.summary}
                    </p>
                  </div>

                  <div className="mt-6 pt-3 border-t border-gold-primary/5 flex justify-end">
                    <LuxuryButton variant="glass" size="sm" className="text-[10px]">
                      Read Story
                    </LuxuryButton>
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>
        )}
      </section>

      <Footer />
    </div>
  );
};
