
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import type { Database } from '../types/index';

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
        setWords(wordData || []);
        setUserWords(userWordData || []);
      }
      setLoading(false);
    };

    fetchWords();
  }, []);

  const updateWordProgress = async (
    wordId: string,
    status: 'learning' | 'mastered',
    update: { easeFactor: number; interval: number; nextReview: string }
  ) => {
    const user = (await supabase.auth.getUser()).data.user;
    if (!user) return;

    const { error, data } = await supabase
      .from('user_words')
      .upsert({
        word_id: wordId,
        user_id: user.id,
        status,
        ease_factor: update.easeFactor,
        interval: update.interval,
        next_review: update.nextReview
      });

    if (error) {
      console.error('Failed to update user_words:', error);
    } else {
      setUserWords((prev) => {
        const others = prev.filter((uw) => uw.word_id !== wordId);
        return [...others, data[0]];
      });
    }
  };

  return { words, userWords, loading, updateWordProgress };
}
