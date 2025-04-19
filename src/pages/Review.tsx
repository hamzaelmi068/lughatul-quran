import React, { useState, useEffect } from 'react';
import { Clock, Repeat, CheckCircle, Flame } from 'lucide-react';
import { useWords } from '../hooks/useWords';
import Flashcard from '../components/Flashcard';
import { calculateNextReview } from "../lib/spaced-repetition"; // ✅ CORRECT spellingimport type { Database } from '../lib/database.types';

type Word = Database['public']['Tables']['words']['Row'];
type UserWord = Database['public']['Tables']['user_words']['Row'];

function Review() {
  const { words, userWords, loading, updateWordProgress } = useWords();
  const [selectedTab, setSelectedTab] = useState<'due' | 'all' | 'mastered'>('due');
  const [currentWord, setCurrentWord] = useState<Word | null>(null);

  const tabs = [
    { id: 'due', label: 'Due Today', icon: Clock },
    { id: 'all', label: 'All Words', icon: Repeat },
    { id: 'mastered', label: 'Mastered', icon: CheckCircle },
  ];

  // Determine which word to review next when tab or data changes
  useEffect(() => {
    if (selectedTab === 'due') {
      // Find the earliest due word (next_review <= today)
      const today = new Date();
      const dueUserWord = userWords
        .filter(uw => {
          const nextReview = uw.next_review ? new Date(uw.next_review) : null;
          return uw.status === 'learning' && nextReview && nextReview <= today;
        })
        .sort((a, b) => new Date(a.next_review || 0).getTime() - new Date(b.next_review || 0).getTime())[0];
      if (dueUserWord) {
        const wordObj = words.find(w => w.id === dueUserWord.word_id) || null;
        setCurrentWord(wordObj);
      } else {
        setCurrentWord(null);
      }
    } else {
      setCurrentWord(null);
    }
  }, [selectedTab, words, userWords]);

  const handleResult = async (quality: 0 | 1 | 2 | 3 | 4 | 5) => {
    if (!currentWord) return;
    // Only proceed if currentWord has an entry in userWords (it should in 'due')
    const userWord = userWords.find(uw => uw.word_id === currentWord.id);
    if (!userWord) return;
    // Calculate new interval and ease factor
    const result = calculateNextReview(quality, userWord.interval, userWord.ease_factor);
    const nextReviewDate = new Date();
    nextReviewDate.setDate(new Date().getDate() + result.interval);
    // Determine status: if quality is max (5) and interval is long enough, maybe mark mastered
    const newStatus = result.interval >= 30 ? 'mastered' : 'learning';
    await updateWordProgress(currentWord.id, newStatus, {
      easeFactor: result.easeFactor,
      interval: result.interval,
      nextReview: nextReviewDate.toISOString(),
    });
    // After updating, refresh the due list by removing this word from current view
    setCurrentWord(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-6">Review Words</h1>
      
      {/* Tab selectors */}
      <div className="mb-6">
        {tabs.map(tab => {
          const Icon = tab.icon;
          const selected = selectedTab === tab.id;
          return (
            <button 
              key={tab.id} 
              onClick={() => setSelectedTab(tab.id as typeof selectedTab)}
              className={`inline-flex items-center space-x-2 px-4 py-2 rounded-lg mr-2 mb-2 transition duration-300 ${
                selected 
                  ? 'bg-emerald-600 text-white' 
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-emerald-50 dark:hover:bg-gray-700'
              }`}
            >
              <Icon className="h-5 w-5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Due Today tab content */}
      {selectedTab === 'due' && (
        <div>
          {currentWord ? (
            <>
              <Flashcard word={currentWord} onResult={handleResult} />
              <p className="mt-4 text-center text-gray-600 dark:text-gray-400">
                Rate your recall by flipping the card.
              </p>
            </>
          ) : (
            <p className="text-xl text-gray-800 dark:text-gray-200">
              {userWords.some(uw => uw.status === 'learning') 
                ? "No words due for review right now. Great job!" 
                : "You haven't started learning any words yet."}
            </p>
          )}
        </div>
      )}

      {/* All Words tab content */}
      {selectedTab === 'all' && (
        <div className="space-y-4">
          {words.map(word => (
            <div 
              key={word.id} 
              className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
            >
              <p className="text-xl font-arabic text-gray-900 dark:text-gray-100 mb-2">
                {word.arabic}
              </p>
              <p className="text-gray-800 dark:text-gray-200">
                {word.english}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Mastered tab content */}
      {selectedTab === 'mastered' && (
        <div className="space-y-4">
          {words
            .filter(word => userWords.find(uw => uw.word_id === word.id && uw.status === 'mastered'))
            .map(word => (
              <div 
                key={word.id} 
                className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
              >
                <p className="text-xl font-arabic text-gray-900 dark:text-gray-100 mb-2">
                  {word.arabic}
                </p>
                <p className="text-gray-800 dark:text-gray-200">
                  {word.english}
                </p>
              </div>
          ))}
          {userWords.every(uw => uw.status !== 'mastered') && (
            <p className="text-gray-700 dark:text-gray-300">
              You haven’t mastered any words yet. Keep reviewing to master words!
            </p>
          )}
        </div>
      )}
    </div>
  );
}

export default Review;
