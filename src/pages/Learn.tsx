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
  ease_factor: number;
  interval: number;
  status: string;
  next_review: string;
}

const tabs = ['beginner', 'intermediate', 'advanced'];
const easeMap = {
  Again: 1,
  Hard: 3,
  Good: 4,
  Easy: 5
} as const;

export default function Learn() {
  const { user } = useAuth();
  const [words, setWords] = useState<Word[]>([]);
  const [userWords, setUserWords] = useState<UserWord[]>([]);
  const [activeTab, setActiveTab] = useState('beginner');
  const [loading, setLoading] = useState(true);
  const [reverse, setReverse] = useState(false);
  const [currentQueue, setCurrentQueue] = useState<Word[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (user) fetchData();
  }, [user, activeTab]);

  const fetchData = async () => {
    setLoading(true);
    const { data: wordList } = await supabase.from('words').select('*');
    const { data: userData } = await supabase
      .from('user_words')
      .select('*')
      .eq('user_id', user?.id);

    setWords(wordList || []);
    setUserWords(userData || []);

    const now = new Date();

    const queue = (wordList || []).filter((w) => {
      const uw = (userData || []).find((uw) => uw.word_id === w.id);
      return (
        w.level === activeTab &&
        (!uw || new Date(uw.next_review) <= now)
      );
    });

    setCurrentQueue(queue);
    setCurrentIndex(0);
    setLoading(false);
  };

  const handleReview = async (word: Word, quality: keyof typeof easeMap) => {
    const existing = userWords.find((uw) => uw.word_id === word.id);
    const ef = existing?.ease_factor ?? 2.5;
    const interval = existing?.interval ?? 0;

    let newEF = ef + (0.1 - (5 - easeMap[quality]) * (0.08 + (5 - easeMap[quality]) * 0.02));
    newEF = Math.max(1.3, newEF);
    let newInterval = quality === 'Again' ? 1 : interval * newEF;
    if (quality === 'Good') newInterval = Math.max(1, newInterval);
    if (quality === 'Hard') newInterval = Math.max(1, newInterval * 0.8);
    if (quality === 'Easy') newInterval *= 1.3;

    const nextReview = new Date(Date.now() + newInterval * 86400000).toISOString();
    const status = quality === 'Easy' ? 'mastered' : 'learning';

    const { error } = await supabase.from('user_words').upsert({
      user_id: user!.id,
      word_id: word.id,
      status,
      ease_factor: newEF,
      interval: Math.round(newInterval),
      next_review: nextReview
    }, { onConflict: ['user_id', 'word_id'] });

    if (error) {
      console.error(error);
      return;
    }

    setCurrentIndex((prev) => prev + 1);
  };

  const currentWord = currentQueue[currentIndex] || null;

  return (
    <div className="min-h-screen pt-20 px-6 pb-12 bg-[#fdfaf3] text-gray-900 dark:bg-gradient-to-br dark:from-[#0f1c14] dark:to-black dark:text-white transition-colors duration-500">
      <div className="flex justify-between items-center mb-4">
        <motion.h1
          className="text-3xl font-bold text-emerald-700 dark:text-emerald-300"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          📚 Learn Quranic Arabic
        </motion.h1>
        <button
          onClick={() => setReverse((r) => !r)}
          className="text-sm bg-amber-100 dark:bg-amber-900 dark:text-amber-300 px-3 py-1 rounded shadow hover:opacity-90"
        >
          {reverse ? '🔁 Arabic → English' : '🔁 English → Arabic'}
        </button>
      </div>

      <div className="flex justify-center gap-3 mb-8">
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
        <p className="text-center text-gray-400">Loading...</p>
      ) : !currentWord ? (
        <p className="text-center text-amber-600 dark:text-amber-300">
          🎉 You’ve reviewed all words in this level!
        </p>
      ) : (
        <motion.div
          className="max-w-xl mx-auto p-6 bg-white/90 dark:bg-white/5 border dark:border-gray-700 rounded-xl shadow-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h2 className="text-2xl text-center font-[Scheherazade] mb-2">
            {reverse ? currentWord.english : currentWord.arabic}
          </h2>
          <p className="text-center text-gray-600 dark:text-gray-400 mb-1">
            {reverse ? currentWord.arabic : currentWord.english}
          </p>
          <p className="text-center text-xs text-gray-500 dark:text-gray-400 mb-4">
            Ayah: {currentWord.ayah_ref} • Root: {currentWord.root}
          </p>

          <div className="flex justify-between gap-2 mt-4">
            {(['Again', 'Hard', 'Good', 'Easy'] as const).map((label) => (
              <button
                key={label}
                onClick={() => handleReview(currentWord, label)}
                className="flex-1 text-sm py-2 rounded font-semibold bg-emerald-100 hover:bg-emerald-200 text-emerald-800 dark:bg-emerald-800 dark:text-white dark:hover:bg-emerald-600"
              >
                {label}
              </button>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}
