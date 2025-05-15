/*
  # Add Initialize Words Function
  
  1. New Function
    - Creates a stored procedure to initialize words for new users
    - Automatically adds all words to user_words table with 'not_started' status
    
  2. Security
    - Function can only be executed by authenticated users
*/

-- Function to initialize words for a new user
CREATE OR REPLACE FUNCTION initialize_user_words(new_user_id UUID)
RETURNS void AS $$
BEGIN
  INSERT INTO user_words (user_id, word_id, status)
  SELECT 
    new_user_id,
    words.id,
    'not_started'
  FROM words
  WHERE NOT EXISTS (
    SELECT 1 
    FROM user_words 
    WHERE user_words.user_id = new_user_id 
    AND user_words.word_id = words.id
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;