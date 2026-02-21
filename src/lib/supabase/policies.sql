-- Run this in your Supabase SQL Editor

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Table: profiles
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY, -- Matches the NextAuth users.id conceptually, or auth.uid()
  handle TEXT UNIQUE,
  display_name TEXT,
  bio TEXT,
  avatar_url TEXT,
  theme_config JSONB DEFAULT '{}'::jsonb,
  newsletter_config JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table: page_items (Linktree-like blocks)
CREATE TABLE IF NOT EXISTS public.page_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  enabled BOOLEAN DEFAULT true,
  "order" INT DEFAULT 0,
  title TEXT,
  url TEXT,
  config JSONB DEFAULT '{}'::jsonb,
  schedule_start TIMESTAMPTZ,
  schedule_end TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_page_items_user_id ON public.page_items(user_id);

-- Table: contacts (Newsletter subscribers)
CREATE TABLE IF NOT EXISTS public.contacts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  source TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, email)
);
CREATE INDEX idx_contacts_user_id ON public.contacts(user_id);

-- Table: posts (Blog posts)
CREATE TABLE IF NOT EXISTS public.posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  slug TEXT NOT NULL,
  content_md TEXT,
  status TEXT DEFAULT 'draft',
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, slug)
);
CREATE INDEX idx_posts_user_id ON public.posts(user_id);

-- Table: social_feeds (Instagram, Tiktok, Youtube)
CREATE TABLE IF NOT EXISTS public.social_feeds (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  value TEXT,
  is_enabled BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_social_feeds_user_id ON public.social_feeds(user_id);

-- Table: events (Analytics)
CREATE TABLE IF NOT EXISTS public.events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  handle TEXT,
  event_type TEXT NOT NULL,
  item_id UUID,
  meta JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_events_user_id ON public.events(user_id, created_at DESC);
CREATE INDEX idx_events_handle ON public.events(handle, created_at DESC);
CREATE INDEX idx_events_item_id ON public.events(item_id, created_at DESC);

----------------------------------------------------------------------------------
-- RLS (Row Level Security) Configuration
----------------------------------------------------------------------------------

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.page_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.social_feeds ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

-- Note: In this system, because we are using NextAuth for authentication, 
-- we will use the Supabase Service Role (Admin) key in our server actions and API routes.
-- Thus, RLS is effectively bypassed on the server, but it protects against 
-- unauthorized access if an anon/client key is exposed.

-- Allow public read access (for anon client key if used)
CREATE POLICY "Public profiles are viewable by everyone." 
  ON public.profiles FOR SELECT USING (true);

CREATE POLICY "Public page items are viewable by everyone." 
  ON public.page_items FOR SELECT USING (enabled = true);

CREATE POLICY "Public social feeds viewable by everyone." 
  ON public.social_feeds FOR SELECT USING (is_enabled = true);

CREATE POLICY "Public posts viewable by everyone." 
  ON public.posts FOR SELECT USING (status = 'published');

-- Events can be inserted by anonymous users (for page views / clicks)
CREATE POLICY "Anon can insert events" 
  ON public.events FOR INSERT WITH CHECK (true);

CREATE POLICY "Anon can insert contacts" 
  ON public.contacts FOR INSERT WITH CHECK (true);
