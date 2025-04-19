import React, { useState, useEffect } from 'react';
import { Clock, CheckCircle, Flame } from 'lucide-react';
import { useWords } from '@/hooks/useWords';
import Flashcard from '@/components/Flashcard';
import { calculateNextReview } from '@/lib/spaced-repetition';
import type { Database } from '@/lib/database.types';

const Review = () => {
  const [selectedTab, setSelectedTab] = useState<'due' | 'mastered'>('due');
  const [currentWord, setCurrentWord] = useState<Word | null>(null);
  const [reviewCount, setReviewCount] = useState(0);
  const [streak, setStreak] = useState(0);

  const {
    words,
    userWords,
    loading,
    updateWordProgress
  } = useWords();

  type Word = Database['public']['Tables']['words']['Row'];
  type UserWord = Database['public']['Tables']['user_words']['Row'];

  const now = new Date();
  const dueWords = userWords.filter((w) => w.next_review && new Date(w.next_review) <= now);
  const masteredWords = userWords.filter((w) => w.status === 'mastered');

  const reviewed = selectedTab === 'due' ? dueWords : masteredWords;
  const wordData = reviewed
    .map((uw) => {
      const match = words.find((w) => w.id === uw.word_id);
      return match ? { ...match, ...uw } : null;
    })
    .filter(Boolean) as (Word & UserWord)[];

  useEffect(() => {
    setCurrentWord(wordData[0] || null);
  }, [selectedTab, words, userWords]);

  const handleReview = async (word: Word & UserWord, quality: 0 | 1 | 2 | 3 | 4 | 5) => {
    const { easeFactor, interval } = calculateNextReview(
      quality,
      word.interval ?? 1,
      word.ease_factor ?? 2.5
    );

    const nextReview = new Date(Date.now() + interval * 86400000);
    const status = quality >= 4 ? 'mastered' : 'learning';

    await updateWordProgress(word.word_id, {
      ease_factor: easeFactor,
      interval,
      status,
      next_review: nextReview
    });

    setCurrentWord(null);
    setReviewCount((count) => count + 1);
    setStreak((s) => (quality >= 3 ? s + 1 : 0));
  };

  const tabs = [
    { id: 'due', label: '📅 Review Due', icon: Clock },
    { id: 'mastered', label: '✅ Mastered Words', icon: CheckCircle }
  ];

  return (
    <div className="min-h-screen py-10 px-4 md:px-8 bg-white text-gray-900 dark:text-white dark:bg-gradient-to-br dark:from-gray-900 dark:to-black transition-colors duration-500">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-extrabold text-center mb-6 text-green-700 dark:text-green-300 drop-shadow-lg">
          🧠 Review Your Quranic Vocabulary
        </h1>

        <div className="flex justify-center gap-4 flex-wrap mb-8">
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setSelectedTab(id as any)}
              className={`px-5 py-3 rounded-full border flex items-center gap-2 shadow-md transition-all duration-200 text-sm font-semibold backdrop-blur-md
                ${
                selectedTab === id
                  ? 'bg-green-100 dark:bg-green-500/10 border-green-500 text-green-700 dark:text-green-300'
                  : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 hover:border-green-500 hover:text-green-600 dark:hover:text-green-300'
              }`}
            >
              <Icon className="w-5 h-5" />
              {label}
            </button>
          ))}
        </div>

        <div className="max-w-xl mx-auto text-center mb-6">
          <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
            🔁 Reviews this session: <strong>{reviewCount}</strong>
          </div>
          <div className="text-sm text-orange-600 dark:text-orange-400">
            <Flame className="inline-block w-4 h-4 mr-1" /> Streak: <strong>{streak}</strong>
          </div>
        </div>

        <div className="max-w-xl mx-auto">
          {loading ? (
            <p className="text-center text-gray-500 dark:text-gray-300 animate-pulse">Loading your progress...</p>
          ) : currentWord ? (
            <div className="animate-fade-in">
              <Flashcard
                word={currentWord}
                onReview={(quality) => handleReview(currentWord, quality)}
              />
            </div>
          ) : (
            <div className="text-center text-green-700 dark:text-green-400 text-lg font-medium">
              {selectedTab === 'due'
                ? '✅ No words are due for review right now!'
                : '🌟 You have mastered all reviewed words!'}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Review;
