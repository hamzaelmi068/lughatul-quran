import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import type { Database } from '../lib/database.types';  // Supabase types

type Word = Database['public']['Tables']['words']['Row'];
type UserWord = Database['public']['Tables']['user_words']['Row'];

export function useWords() {
  const [words, setWords] = useState<Word[]>([]);
  const [userWords, setUserWords] = useState<UserWord[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchWords = async () => {
    setLoading(true);
    const { data: w } = await supabase.from('words').select('*');
    const { data: uw } = await supabase.from('user_words').select('*');
    setWords(w || []);
    setUserWords(uw || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchWords();
  }, []);

  const updateWordProgress = async (wordId: string, updates: Partial<UserWord>) => {
    await supabase
      .from('user_words')
      .update(updates)
      .eq('word_id', wordId);
  };

  return {
    words,
    userWords,
    updateWordProgress,
    loading,
    refetch: fetchWords // ✅ make sure this is exposed
  };
}

