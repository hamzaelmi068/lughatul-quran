/*
  # Initial Schema Setup for LughatulQuran

  1. New Tables
    - `words`
      - Core vocabulary table storing Quranic words
      - Includes Arabic text, English translation, and references
    - `user_words`
      - Tracks user progress for each word
      - Implements spaced repetition system
    - `user_progress`
      - Stores user statistics and learning progress
      - Tracks streaks and achievements

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
    - Restrict access to user's own data
*/

-- Words table
CREATE TABLE IF NOT EXISTS words (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  arabic text NOT NULL,
  root text,
  english text NOT NULL,
  ayah text NOT NULL,
  surah text NOT NULL,
  ayah_number integer NOT NULL,
  audio_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE words ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Words are viewable by all authenticated users"
  ON words
  FOR SELECT
  TO authenticated
  USING (true);

-- User words table (for tracking progress)
CREATE TABLE IF NOT EXISTS user_words (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  word_id uuid REFERENCES words(id) ON DELETE CASCADE,
  status text NOT NULL DEFAULT 'not_started',
  ease_factor float DEFAULT 2.5,
  interval integer DEFAULT 0,
  notes text,
  last_reviewed timestamptz,
  next_review timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT valid_status CHECK (status IN ('not_started', 'learning', 'mastered'))
);

ALTER TABLE user_words ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own word progress"
  ON user_words
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own word progress"
  ON user_words
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can insert their own word progress"
  ON user_words
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- User progress table
CREATE TABLE IF NOT EXISTS user_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  words_learned integer DEFAULT 0,
  words_mastered integer DEFAULT 0,
  current_streak integer DEFAULT 0,
  longest_streak integer DEFAULT 0,
  last_activity_date date DEFAULT CURRENT_DATE,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own progress"
  ON user_progress
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own progress"
  ON user_progress
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can insert their own progress"
  ON user_progress
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Add triggers for updated_at
CREATE TRIGGER update_words_updated_at
  BEFORE UPDATE ON words
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_words_updated_at
  BEFORE UPDATE ON user_words
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_progress_updated_at
  BEFORE UPDATE ON user_progress
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX idx_user_words_user_id ON user_words(user_id);
CREATE INDEX idx_user_words_word_id ON user_words(word_id);
CREATE INDEX idx_user_words_next_review ON user_words(next_review);
CREATE INDEX idx_user_progress_user_id ON user_progress(user_id);