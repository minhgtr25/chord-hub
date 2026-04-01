-- ============================================================
-- ChordHub Database Schema
-- Run this entire SQL in Supabase SQL Editor:
-- https://supabase.com/dashboard/project/vkjkgsulvjccdbvepvux/sql
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ─────────────────────────────────────────
-- 1. PROFILES TABLE
-- Extends Supabase auth.users with extra fields
-- ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.profiles (
  id          UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name        TEXT NOT NULL DEFAULT '',
  bio         TEXT,
  instrument  TEXT DEFAULT 'Guitar',
  avatar_url  TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Auto-create profile on new signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, name, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', SPLIT_PART(NEW.email, '@', 1)),
    'https://api.dicebear.com/7.x/avataaars/svg?seed=' || NEW.email
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ─────────────────────────────────────────
-- 2. SONGS TABLE
-- ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.songs (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  author_id   UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title       TEXT NOT NULL DEFAULT 'Bài hát mới',
  artist      TEXT NOT NULL DEFAULT 'Nghệ sĩ',
  key         TEXT NOT NULL DEFAULT 'C',
  duration    TEXT DEFAULT '0:00',
  genre       TEXT DEFAULT 'Pop',
  thumbnail   TEXT,
  note        TEXT,
  lyrics      JSONB NOT NULL DEFAULT '[]'::jsonb,
  audio_url   TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Auto-update updated_at on change
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_updated_at ON public.songs;
CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON public.songs
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- ─────────────────────────────────────────
-- 3. ROW LEVEL SECURITY (RLS)
-- ─────────────────────────────────────────

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.songs ENABLE ROW LEVEL SECURITY;

-- Profiles: users can read all, but only update their own
DROP POLICY IF EXISTS "profiles_read_all" ON public.profiles;
CREATE POLICY "profiles_read_all"
  ON public.profiles FOR SELECT USING (true);

DROP POLICY IF EXISTS "profiles_update_own" ON public.profiles;
CREATE POLICY "profiles_update_own"
  ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Songs: Anyone can read all songs
DROP POLICY IF EXISTS "songs_read_all" ON public.songs;
CREATE POLICY "songs_read_all"
  ON public.songs FOR SELECT USING (true);

-- Songs: Only authenticated users can insert (own songs)
DROP POLICY IF EXISTS "songs_insert_own" ON public.songs;
CREATE POLICY "songs_insert_own"
  ON public.songs FOR INSERT WITH CHECK (auth.uid() = author_id);

-- Songs: Only the author can update
DROP POLICY IF EXISTS "songs_update_own" ON public.songs;
CREATE POLICY "songs_update_own"
  ON public.songs FOR UPDATE USING (auth.uid() = author_id);

-- Songs: Only the author can delete
DROP POLICY IF EXISTS "songs_delete_own" ON public.songs;
CREATE POLICY "songs_delete_own"
  ON public.songs FOR DELETE USING (auth.uid() = author_id);

-- ─────────────────────────────────────────
-- 4. SEED DATA (Optional sample songs)
-- These will be owned by system — replace author_id after signup
-- Comment out if you don't want seed data
-- ─────────────────────────────────────────
-- (Seed songs are created programmatically after first user registers)
