import React, { useState, useEffect } from 'react';
import { Flame } from 'lucide-react';
import { useWords } from '@/hooks/useWords';
import { calculateNextReview } from '@/lib/spaced-repetition';
import type { Database } from '@/lib/database.types';

type Word = Database['public']['Tables']['words']['Row'];
type UserWord = Database['public']['Tables']['user_words']['Row'];

const Review = () => {
  const [streak, setStreak] = useState(0);
  const [queue, setQueue] = useState<(Word & UserWord)[]>([]);
  const [current, setCurrent] = useState<Word & UserWord | null>(null);

  const { words, userWords, updateWordProgress, loading, refetch } = useWords();

  useEffect(() => {
    if (!loading) {
      const now = new Date();
      const queue = userWords
        .filter((w) => w.next_review && new Date(w.next_review) <= now)
        .map((uw) => {
          const word = words.find((w) => w.id === uw.word_id);
          return word ? { ...word, ...uw } : null;
        })
        .filter(Boolean) as (Word & UserWord)[];
      setQueue(queue);
      setCurrent(queue[0] ?? null);
    }
  }, [loading, words, userWords]);

  const handleReview = async (quality: 0 | 1 | 2 | 3) => {
    if (!current) return;

    const { easeFactor, interval, nextReview } = calculateNextReview(
      quality,
      current.interval ?? 0,
      current.ease_factor ?? 2.5
    );

    await updateWordProgress(current.word_id, {
      ease_factor: easeFactor,
      interval,
      next_review: nextReview.toISOString(),
      status: quality === 3 ? 'mastered' : 'learning'
    });

    const nextQueue = queue.slice(1);
    setQueue(nextQueue);
    setCurrent(nextQueue[0] ?? null);
    setStreak((s) => (quality >= 2 ? s + 1 : 0));

    setTimeout(() => {
      refetch(); // optional sync refresh
    }, 250);
  };

  return (
    <div className="min-h-screen pt-20 px-6 pb-12 bg-[#fdfaf3] dark:bg-gradient-to-br dark:from-[#0f1c14] dark:to-black text-gray-900 dark:text-white transition-colors duration-500">
      <h1 className="text-3xl font-bold text-center mb-6 text-emerald-700 dark:text-emerald-300">
        🔁 Review Session
      </h1>

      {loading ? (
        <p className="text-center text-gray-500 dark:text-gray-400">Loading...</p>
      ) : !current ? (
        <p className="text-center text-amber-600 dark:text-amber-400">
          🎉 You’re all caught up for now!
        </p>
      ) : (
        <div className="max-w-lg mx-auto text-center bg-white/80 dark:bg-white/5 p-8 rounded-xl shadow-md border dark:border-gray-700">
          <h2 className="text-4xl font-[Scheherazade] mb-2">{current.arabic}</h2>
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
            {current.english} • Root: {current.root}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-6">
            Ayah: {current.ayah_ref}
          </p>

          <div className="flex justify-center gap-2">
            {['Again', 'Hard', 'Good', 'Easy'].map((label, idx) => (
              <button
                key={label}
                onClick={() => handleReview(idx as 0 | 1 | 2 | 3)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                  idx === 0
                    ? 'bg-red-100 text-red-700 dark:bg-red-800/30 dark:text-red-300'
                    : idx === 3
                    ? 'bg-green-100 text-green-700 dark:bg-green-800/30 dark:text-green-300'
                    : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-200'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="mt-10 text-center text-sm text-orange-600 dark:text-orange-400">
        <Flame className="inline w-4 h-4" /> Streak: <strong>{streak}</strong>
      </div>
    </div>
  );
};

export default Review;
