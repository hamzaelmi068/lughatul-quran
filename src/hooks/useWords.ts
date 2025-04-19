import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import type { Database } from '../lib/database.types';  // Supabase types

type Word = Database['public']['Tables']['words']['Row'];
type UserWord = Database['public']['Tables']['user_words']['Row'];

export function useWords() {
  const [words, setWords] = useState<Word[]>([]);
  const [userWords, setUserWords] = useState<UserWord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWords = async () => {
      setLoading(true);
      const { data: wordData, error: wordError } = await supabase.from('words').select('*');
      const { data: userWordData, error: userWordError } = await supabase.from('user_words').select('*');
      if (wordError || userWordError) {
        console.error('Error fetching data:', wordError || userWordError);
      } else {
        setWords(wordData ?? []);
        setUserWords(userWordData ?? []);
      }
      setLoading(false);
    };
    fetchWords();
  }, []);

  // Update or insert user progress for a word
  const updateWordProgress = async (
    wordId: string, 
    status: UserWord['status'], 
    fields: { easeFactor: number; interval: number; nextReview: string }
  ) => {
    // Ensure user is logged in
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { error } = await supabase.from('user_words').upsert({
      word_id: wordId,
      user_id: user.id,
      status,
      ease_factor: fields.easeFactor,
      interval: fields.interval,
      next_review: fields.nextReview,
      last_reviewed: new Date().toISOString()
    });
    if (error) {
      console.error('Error updating word progress:', error.message);
    } else {
      // Refresh local state for userWords
      setUserWords(prev => {
        const other = prev.filter(uw => uw.word_id !== wordId);
        const updated: UserWord = {
          id: prev.find(uw => uw.word_id === wordId)?.id || crypto.randomUUID(),
          user_id: user.id,
          word_id: wordId,
          status,
          ease_factor: fields.easeFactor,
          interval: fields.interval,
          next_review: fields.nextReview,
          last_reviewed: new Date().toISOString(),
          // any other fields like notes can be handled here
        };
        return [...other, updated];
      });
    }
  };

  return { words, userWords, loading, updateWordProgress };
}
