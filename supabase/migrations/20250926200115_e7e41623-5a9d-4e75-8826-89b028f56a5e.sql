-- Create blog categories table
CREATE TABLE public.blog_categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  color TEXT DEFAULT '#3B82F6',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create blog posts table
CREATE TABLE public.blog_posts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  excerpt TEXT,
  content TEXT NOT NULL,
  featured_image_url TEXT,
  featured_image_alt TEXT,
  category_id UUID REFERENCES public.blog_categories(id),
  author_name TEXT DEFAULT 'Bitcoin Calculator Team',
  author_avatar TEXT,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  featured BOOLEAN DEFAULT false,
  meta_title TEXT,
  meta_description TEXT,
  meta_keywords TEXT[],
  canonical_url TEXT,
  read_time INTEGER DEFAULT 5,
  view_count INTEGER DEFAULT 0,
  published_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create blog tags table
CREATE TABLE public.blog_tags (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create blog post tags junction table
CREATE TABLE public.blog_post_tags (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID REFERENCES public.blog_posts(id) ON DELETE CASCADE,
  tag_id UUID REFERENCES public.blog_tags(id) ON DELETE CASCADE,
  UNIQUE(post_id, tag_id)
);

-- Enable Row Level Security
ALTER TABLE public.blog_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_post_tags ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Anyone can view published blog posts" 
ON public.blog_posts 
FOR SELECT 
USING (status = 'published');

CREATE POLICY "Anyone can view blog categories" 
ON public.blog_categories 
FOR SELECT 
USING (true);

CREATE POLICY "Anyone can view blog tags" 
ON public.blog_tags 
FOR SELECT 
USING (true);

CREATE POLICY "Anyone can view blog post tags" 
ON public.blog_post_tags 
FOR SELECT 
USING (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
NEW.updated_at = now();
RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_blog_categories_updated_at
BEFORE UPDATE ON public.blog_categories
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_blog_posts_updated_at
BEFORE UPDATE ON public.blog_posts
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX idx_blog_posts_status ON public.blog_posts(status);
CREATE INDEX idx_blog_posts_featured ON public.blog_posts(featured);
CREATE INDEX idx_blog_posts_published_at ON public.blog_posts(published_at DESC);
CREATE INDEX idx_blog_posts_category ON public.blog_posts(category_id);
CREATE INDEX idx_blog_posts_slug ON public.blog_posts(slug);

-- Insert initial categories
INSERT INTO public.blog_categories (name, slug, description, color) VALUES
('Bitcoin Investment', 'bitcoin-investment', 'Learn about Bitcoin investment strategies and market analysis', '#F59E0B'),
('DCA Strategy', 'dca-strategy', 'Dollar-cost averaging techniques and best practices', '#10B981'),
('Tax Planning', 'tax-planning', 'Bitcoin tax implications and planning strategies', '#3B82F6'),
('Market Analysis', 'market-analysis', 'Bitcoin market trends and technical analysis', '#8B5CF6'),
('Retirement Planning', 'retirement-planning', 'Long-term Bitcoin investment for retirement', '#EF4444');

-- Insert initial tags
INSERT INTO public.blog_tags (name, slug) VALUES
('Bitcoin', 'bitcoin'),
('DCA', 'dca'),
('Investment', 'investment'),
('Tax', 'tax'),
('Strategy', 'strategy'),
('Calculator', 'calculator'),
('Analysis', 'analysis'),
('Retirement', 'retirement'),
('Wealth Building', 'wealth-building'),
('Risk Management', 'risk-management');