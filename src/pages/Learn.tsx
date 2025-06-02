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
  tag?: string;
}

interface UserWord {
  word_id: string;
  ease_factor: number;
  interval: number;
  status: string;
  next_review: string;
}

const tabs = ['beginner', 'intermediate', 'advanced'];
const decks = ['Quranic', 'Everyday', 'all'] as const;
const easeMap = {
  Again: 1,
  Hard: 3,
  Good: 4,
  Easy: 5,
} as const;

type DeckType = typeof decks[number];

type Props = {};

export default function Learn({}: Props) {
  const { user } = useAuth();
  const [words, setWords] = useState<Word[]>([]);
  const [userWords, setUserWords] = useState<UserWord[]>([]);
  const [queue, setQueue] = useState<Word[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [activeTab, setActiveTab] = useState('beginner');
  const [activeDeck, setActiveDeck] = useState<DeckType>('Quranic');
  const [loading, setLoading] = useState(true);
  const [reverse, setReverse] = useState(false);

  useEffect(() => {
    if (user) fetchData();
  }, [user, activeTab, activeDeck]);

  const fetchData = async () => {
    setLoading(true);
    const { data: wordList } = await supabase.from('words').select('*');
    const { data: userData } = await supabase
      .from('user_words')
      .select('*')
      .eq('user_id', user.id);

    const now = new Date();
    const filtered = (wordList || []).filter((w) => {
      const uw = (userData || []).find((u) => u.word_id === w.id);
      return (
        w.level === activeTab &&
        (activeDeck === 'all' || w.tag === activeDeck) &&
        (!uw || !uw.next_review || new Date(uw.next_review) <= now)
      );
    });

    setWords(wordList || []);
    setUserWords(userData || []);
    setQueue(filtered);
    setCurrentIndex(0);
    setLoading(false);
  };

  const handleReview = async (word: Word, quality: keyof typeof easeMap) => {
    const existing = userWords.find((uw) => uw.word_id === word.id);
    const ef = existing?.ease_factor ?? 2.5;
    const interval = existing?.interval ?? 1;

    let newEF = Math.max(
      1.3,
      ef + (0.1 - (5 - easeMap[quality]) * (0.08 + (5 - easeMap[quality]) * 0.02))
    );
    let newInterval = quality === 'Again' ? 1 : interval * newEF;
    if (quality === 'Hard') newInterval *= 0.8;
    if (quality === 'Easy') newInterval *= 1.3;

    const nextReview = new Date(Date.now() + newInterval * 86400000).toISOString();
    const status = quality === 'Easy' ? 'mastered' : 'learning';

    await supabase.from('user_words').upsert({
      user_id: user!.id,
      word_id: word.id,
      ease_factor: newEF,
      interval: Math.round(newInterval),
      next_review: nextReview,
      status,
    });

    const nextIndex = currentIndex + 1;
    if (nextIndex < queue.length) {
      setCurrentIndex(nextIndex);
    } else {
      await fetchData();
    }
  };

  const current = queue[currentIndex];

  return (
    <div className="min-h-screen px-6 pb-12 pt-24 bg-[#fdfaf3] text-gray-900 dark:bg-black dark:text-white transition-colors duration-500">
      <div className="text-center mb-4">
        <h1 className="text-3xl font-bold text-emerald-600 dark:text-emerald-300">
          <span role="img" aria-label="brain">🧠</span> Learn Arabic Your Way
        </h1>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Toggle between Quranic verses and Everyday essentials.
        </p>
      </div>

      <div className="flex justify-center gap-3 mb-6">
        {decks.map((deck) => (
          <button
            key={deck}
            onClick={() => setActiveDeck(deck)}
            className={`px-4 py-2 rounded-full text-sm transition font-medium ${
              activeDeck === deck
                ? 'bg-emerald-600 text-white shadow'
                : 'bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200'
            }`}
          >
            {deck}
          </button>
        ))}
      </div>

      <div className="flex justify-center gap-3 mb-6">
        {tabs.map((level) => (
          <button
            key={level}
            onClick={() => setActiveTab(level)}
            className={`px-4 py-2 rounded-full border text-sm transition ${
              activeTab === level
                ? 'bg-emerald-600 text-white shadow'
                : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200'
            }`}
          >
            {level[0].toUpperCase() + level.slice(1)}
          </button>
        ))}
      </div>

      <div className="flex justify-center mb-4">
        <button
          onClick={() => setReverse((r) => !r)}
          className="text-sm bg-amber-100 dark:bg-amber-800 text-amber-800 dark:text-amber-200 px-3 py-1 rounded shadow"
        >
          {reverse ? '🔁 Arabic → English' : '🔁 English → Arabic'}
        </button>
      </div>

      {loading ? (
        <p className="text-center text-gray-500">Loading...</p>
      ) : !current ? (
        <p className="text-center text-amber-600 dark:text-amber-400">
          🎉 All words reviewed for this level!
        </p>
      ) : (
        <motion.div
          className="max-w-xl mx-auto bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border dark:border-gray-700 text-center"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h2 className="text-2xl font-[Scheherazade] mb-2">
            {reverse ? current.english : current.arabic}
          </h2>
          <p className="mb-1 text-gray-600 dark:text-gray-300">
            {reverse ? current.arabic : current.english}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Ayah: {current.ayah_ref} • Root: {current.root}
          </p>

          <div className="flex justify-between gap-2 mt-6">
            {(['Again', 'Hard', 'Good', 'Easy'] as const).map((label) => (
              <button
                key={label}
                onClick={() => handleReview(current, label)}
                className="flex-1 text-sm py-2 rounded font-semibold bg-emerald-100 dark:bg-emerald-800 hover:bg-emerald-200 dark:hover:bg-emerald-600 text-emerald-900 dark:text-white"
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