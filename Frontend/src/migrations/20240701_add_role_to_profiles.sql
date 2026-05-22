-- Migration: Add role column to profiles table
-- Adjust the table name and column names according to your Supabase schema.
-- This script creates an ENUM type for roles and adds a 'role' column.

CREATE TYPE public.user_role AS ENUM ('customer', 'seller');

ALTER TABLE public.profiles
  ADD COLUMN role public.user_role NOT NULL DEFAULT 'customer';

-- Optional: enable row level security if not already enabled
-- ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Optional: add policies to allow users to select/update their own profile
-- CREATE POLICY "profile_select" ON public.profiles FOR SELECT USING (auth.uid() = id);
-- CREATE POLICY "profile_update" ON public.profiles FOR UPDATE USING (auth.uid() = id);
