-- Add status column to orders table for real order tracking
-- Run this in Supabase SQL Editor

ALTER TABLE orders
  ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'received'
  CHECK (status IN ('received', 'preparing', 'delivering', 'delivered'));

-- Backfill existing orders
UPDATE orders SET status = 'received' WHERE status IS NULL;

-- Policy: users can view own orders (already exists, but ensure it covers status)
-- No new RLS needed — existing orders policies already handle read/write
