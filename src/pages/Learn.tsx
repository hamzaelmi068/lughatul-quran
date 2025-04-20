import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabaseClient';
import { motion } from 'framer-motion';

interface Word {
  id: string;
  arabic: string;
  english: string;
  root: string;
  ayah_ref: string;
  level: string;
}

interface UserWord {
  word_id: string;
}

const tabs = ['beginner', 'intermediate', 'advanced'];

export default function Learn() {
  const { user } = useAuth();
  const [words, setWords] = useState<Word[]>([]);
  const [userWords, setUserWords] = useState<UserWord[]>([]);
  const [activeTab, setActiveTab] = useState('beginner');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) fetchData();
  }, [user]);

  const fetchData = async () => {
    setLoading(true);

    const { data: wordList } = await supabase.from('words').select('*');
    const { data: userData } = await supabase
      .from('user_words')
      .select('word_id')
      .eq('user_id', user?.id);

    setWords(wordList || []);
    setUserWords(userData || []);
    setLoading(false);
  };

  const handleLearn = async (wordId: string) => {
    if (!user) return;

    await supabase.from('user_words').insert({
      user_id: user.id,
      word_id: wordId,
      status: 'learning',
      ease_factor: 2.5,
      interval: 0,
      next_review: new Date().toISOString()
    });

    fetchData(); // refresh view
  };

  const isLearned = (wordId: string) =>
    userWords.some((w) => w.word_id === wordId);

  const filtered = words.filter(
    (w) => w.level === activeTab && !isLearned(w.id)
  );


return (
  <div className="min-h-screen pt-20 px-6 pb-12 bg-[#fdfaf3] text-gray-900 dark:bg-gradient-to-br dark:from-[#0f1c14] dark:to-black dark:text-white transition-colors duration-500">
    <motion.h1
      className="text-3xl md:text-4xl font-bold text-center text-emerald-700 dark:text-emerald-300 mb-6"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      📚 Learn Quranic Arabic
    </motion.h1>

    <div className="flex justify-center gap-4 mb-8">
      {tabs.map((level) => (
        <button
          key={level}
          onClick={() => setActiveTab(level)}
          className={`px-4 py-2 rounded-full border text-sm font-medium transition-all ${
            activeTab === level
              ? 'bg-emerald-600 text-white shadow-md'
              : 'bg-white dark:bg-white/10 border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300'
          }`}
        >
          {level.charAt(0).toUpperCase() + level.slice(1)}
        </button>
      ))}
    </div>

    {loading ? (
      <p className="text-center text-gray-500 dark:text-gray-400">Loading...</p>
    ) : filtered.length === 0 ? (
      <p className="text-center text-amber-600 dark:text-amber-300">
        ✨ You’ve learned all words in this level!
      </p>
    ) : (
      <div className="grid gap-6 md:grid-cols-2 max-w-5xl mx-auto">
        {filtered.map((word, i) => (
          <motion.div
            key={word.id}
            className="p-6 bg-white/80 dark:bg-white/5 border dark:border-gray-700 rounded-xl shadow-md hover:shadow-lg transition-all"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <h2 className="text-2xl font-[Scheherazade] mb-1">{word.arabic}</h2>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              {word.english} • Root: {word.root}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
              Ayah: {word.ayah_ref}
            </p>
            <button
              onClick={() => handleLearn(word.id)}
              className="mt-2 px-4 py-1 rounded bg-emerald-600 hover:bg-emerald-700 text-white text-sm"
            >
              Start Learning
            </button>
          </motion.div>
        ))}
      </div>
    )}
      </div>
  );
}

export default Learn;
