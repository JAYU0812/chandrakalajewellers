import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../../lib/supabase';
import { Header } from '../../components/common/Header';
import { Footer } from '../../components/common/Footer';
import { LuxuryButton } from '../../components/ui/LuxuryButton';
import { updateMetadata, injectJsonLd, removeJsonLd } from '../../lib/seo';
import { ChevronLeft, Calendar, User, BookOpen } from 'lucide-react';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  summary: string;
  content: string;
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
    content: `Filigree is the language of gold spoken in whispers. For centuries, artisans in South India have hand-wound micro-thin gold wires into complex geometric matrices. This technique, originally inspired by Temple pillars and deities carvings, requires years of tactile practice.

At Chandrakala Jewellers, our master craftsmen select only conflicts-free 22K gold to spin these patterns. By blending traditional charcoal fire hand-molding with modern BIS hallmarking validations, we ensure that every necklace holds both historical depth and certified purity.

We invite you to visit our Chennai flagship store to experience the tactile filigree weight firsthand.`,
    status: 'published',
    published_at: '2026-07-04T12:00:00Z',
    cover_image_path: '/assets/images/bridal_heritage.jpg',
  },
];

export const BlogDetailPublic: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  const { data: dbBlog, isLoading } = useQuery({
    queryKey: ['public-blog-detail', slug],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('blogs')
          .select('*')
          .eq('slug', slug)
          .eq('status', 'published')
          .single();
        if (error) throw error;
        return data as BlogPost;
      } catch (err) {
        return MOCK_BLOGS.find(b => b.slug === slug) || null;
      }
    },
  });

  const blog = dbBlog || MOCK_BLOGS.find(b => b.slug === slug);

  // Dynamic SEO Schema Graph injections matching request
  useEffect(() => {
    if (blog) {
      // 1. Injects Title & Social headers
      updateMetadata({
        title: blog.title,
        description: blog.summary,
        ogType: 'article',
        ogImage: blog.cover_image_path,
      });

      // 2. Injects Article JSON-LD Schema
      injectJsonLd(`blog-ld-${blog.id}`, {
        '@type': 'NewsArticle',
        headline: blog.title,
        description: blog.summary,
        image: [
          blog.cover_image_path.startsWith('http') 
            ? blog.cover_image_path 
            : `${window.location.origin}${blog.cover_image_path}`
        ],
        datePublished: blog.published_at || new Date().toISOString(),
        author: {
          '@type': 'Organization',
          name: 'Chandrakala Jewellers',
        },
      });
    }

    return () => {
      if (blog) {
        removeJsonLd(`blog-ld-${blog.id}`);
      }
    };
  }, [blog]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-pearl dark:bg-obsidian flex items-center justify-center">
        <span className="w-8 h-8 border-3 border-gold-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-screen bg-pearl dark:bg-obsidian flex flex-col items-center justify-center p-6 text-center">
        <BookOpen className="w-16 h-16 text-gold-primary/30 mb-4" />
        <h1 className="font-serif text-3xl mb-4">Article Not Found</h1>
        <LuxuryButton variant="gold" size="sm" onClick={() => navigate('/blogs')}>
          Return to Editorial
        </LuxuryButton>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-pearl dark:bg-obsidian text-obsidian dark:text-pearl transition-colors duration-300">
      <Header />
      <div className="h-24" />

      {/* Back CTA */}
      <div className="max-w-4xl mx-auto px-6 md:px-0 py-6">
        <button
          onClick={() => navigate('/blogs')}
          className="flex items-center gap-2 text-xs uppercase tracking-widest text-gold-primary hover:text-gold-light transition-colors font-semibold cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4" /> Back to Editorial
        </button>
      </div>

      <article className="max-w-4xl mx-auto px-6 md:px-0 pb-24">
        
        {/* Banner Cover */}
        <div className="aspect-video rounded-luxury-md overflow-hidden bg-black/5 border border-gold-primary/10 mb-8">
          <img 
            src={blog.cover_image_path.startsWith('http') || blog.cover_image_path.startsWith('/assets')
              ? blog.cover_image_path 
              : '/assets/images/bridal_heritage.jpg'
            } 
            alt={blog.title} 
            className="w-full h-full object-cover" 
          />
        </div>

        {/* Title details */}
        <div className="flex flex-col gap-4 border-b border-gold-primary/10 pb-8">
          <h1 className="font-serif text-3xl md:text-5xl font-light leading-tight">
            {blog.title}
          </h1>

          <div className="flex flex-wrap gap-4 text-xs font-sans text-obsidian/50 dark:text-pearl/40 uppercase tracking-wider font-light">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-gold-primary" />
              {blog.published_at ? new Date(blog.published_at).toLocaleDateString() : 'Draft'}
            </span>
            <span className="flex items-center gap-1.5">
              <User className="w-4 h-4 text-gold-primary" />
              Editorial Room
            </span>
          </div>
        </div>

        {/* Content text */}
        <div className="mt-8 text-base font-sans font-light leading-relaxed text-obsidian/80 dark:text-pearl/80 whitespace-pre-line space-y-6">
          {blog.content}
        </div>
      </article>

      <Footer />
    </div>
  );
};
export default BlogDetailPublic;
