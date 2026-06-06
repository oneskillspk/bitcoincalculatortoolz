-- Drop blog-related tables and types
DROP TABLE IF EXISTS public.blog_post_tags CASCADE;
DROP TABLE IF EXISTS public.blog_tags CASCADE;
DROP TABLE IF EXISTS public.blog_posts CASCADE;
DROP TABLE IF EXISTS public.blog_categories CASCADE;
DROP TABLE IF EXISTS public.user_roles CASCADE;

-- Drop blog-related functions
DROP FUNCTION IF EXISTS public.has_role(uuid, app_role) CASCADE;

-- Drop blog-related enum types
DROP TYPE IF EXISTS public.app_role CASCADE;