import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import type { Database } from '../lib/database.types';
import { useAuth } from '../contexts/AuthContext'; // ✅ Make sure you have this hook

type Word = Database['public']['Tables']['words']['Row'];
type UserWord = Database['public']['Tables']['user_words']['Row'];

export function useWords() {
  const { user } = useAuth(); // ✅ get current user
  const [words, setWords] = useState<Word[]>([]);
  const [userWords, setUserWords] = useState<UserWord[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchWords = async () => {
    if (!user) return; // 🛡 prevent undefined behavior

    setLoading(true);
    const { data: w } = await supabase.from('words').select('*');
    const { data: uw } = await supabase
      .from('user_words')
      .select('*')
      .eq('user_id', user.id); // ✅ only get this user's words

    setWords(w || []);
    setUserWords(uw || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchWords();
  }, [user]); // ✅ re-fetch when user loads

  const updateWordProgress = async (wordId: string, updates: Partial<UserWord>) => {
    if (!user) return;
    await supabase
      .from('user_words')
      .update(updates)
      .eq('user_id', user.id) // ✅ scoped update
      .eq('word_id', wordId);
  };

  return {
    words,
    userWords,
    updateWordProgress,
    loading,
    refetch: fetchWords
  };
}
