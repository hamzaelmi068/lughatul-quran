/*
  # Fix RLS Policies for user_words Table

  1. Changes
    - Add DELETE policy for user_words table
    - Ensure all CRUD operations are properly secured
    - Maintain data isolation between users

  2. Security
    - Users can only delete their own word records
    - Maintains existing SELECT, INSERT, and UPDATE policies
*/

-- Drop existing policies to ensure clean state
DROP POLICY IF EXISTS "Users can view their own word progress" ON user_words;
DROP POLICY IF EXISTS "Users can update their own word progress" ON user_words;
DROP POLICY IF EXISTS "Users can insert their own word progress" ON user_words;

-- Recreate policies with consistent naming and complete CRUD coverage
CREATE POLICY "Users can view their own word progress"
  ON user_words
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own word progress"
  ON user_words
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own word progress"
  ON user_words
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own word progress"
  ON user_words
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);