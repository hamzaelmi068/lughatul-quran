import React, { useState, useEffect } from 'react';
import { Clock, Repeat, CheckCircle } from 'lucide-react';
import { useWords } from '../hooks/useWords';
import Flashcard from '../components/Flashcard';
import { calculateNextReview } from '../lib/spaced-repetition';
import type { Database } from '../lib/database.types';

type Word = Database['public']['Tables']['words']['Row'];
type UserWord = Database['public']['Tables']['user_words']['Row'];

function Review() {
  const [selectedTab, setSelectedTab] = useState('due');
  const [currentWord, setCurrentWord] = useState<Word | null>(null);
  const { words, userWords, loading, updateWordProgress } = useWords();

  const tabs = [
    { id: 'due', label: 'Due Today', icon: Clock },
    { id: 'all', label: 'All Words', icon: Repeat },
    { id: 'mastered', label: 'Mastered', icon: CheckCircle },
  ];

  useEffect(() => {
    if (selectedTab === 'due' && words.length > 0 && userWords.length > 0) {
      const now = new Date();
      const dueWords = userWords
        .filter(uw => {
          const nextReview = uw.next_review ? new Date(uw.next_review) : null;
          return nextReview && nextReview <= now;
        })
        .map(uw => words.find(w => w.id === uw.word_id))
        .filter((w): w is Word => w !== undefined);

      setCurrentWord(dueWords[0] || null);
    }
  }, [selectedTab, words, userWords]);

  const handleResult = async (quality: 0 | 1 | 2 | 3 | 4 | 5) => {
    if (!currentWord) return;

    const userWord = userWords.find(uw => uw.word_id === currentWord.id);
    if (!userWord) return;

    const result = calculateNextReview(
      quality,
      userWord.interval,
      userWord.ease_factor
    );

    const nextReview = new Date();
    nextReview.setDate(nextReview.getDate() + result.interval);

    const newStatus = quality >= 4 ? 'mastered' : 'learning';

    await updateWordProgress(currentWord.id, newStatus, {
      easeFactor: result.easeFactor,
      interval: result.interval,
      nextReview: nextReview.toISOString(),
    });

    // Move to next due word
    const now = new Date();
    const nextDueWord = words.find(w => {
      const uw = userWords.find(uw => uw.word_id === w.id);
      if (!uw?.next_review) return false;
      const nextReview = new Date(uw.next_review);
      return nextReview <= now && w.id !== currentWord.id;
    });

    setCurrentWord(nextDueWord || null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">Review Your Words</h1>
      
      <div className="flex space-x-4 mb-6">
        {tabs.map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setSelectedTab(tab.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition duration-300 ${
                selectedTab === tab.id
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

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        {selectedTab === 'due' && currentWord && (
          <Flashcard word={currentWord} onResult={handleResult} />
        )}

        {selectedTab === 'due' && !currentWord && (
          <div className="text-center py-8">
            <CheckCircle className="h-16 w-16 text-emerald-600 mx-auto mb-4" />
            <p className="text-gray-700 dark:text-gray-300">
              No words due for review. Great job staying on top of your studies!
            </p>
          </div>
        )}

        {selectedTab === 'all' && (
          <div className="space-y-4">
            {words.map(word => (
              <div key={word.id} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                <p className="text-xl font-arabic text-gray-900 dark:text-white mb-2">{word.arabic}</p>
                <p className="text-gray-600 dark:text-gray-400">{word.english}</p>
              </div>
            ))}
          </div>
        )}

        {selectedTab === 'mastered' && (
          <div className="space-y-4">
            {words
              .filter(word => 
                userWords.some(uw => uw.word_id === word.id && uw.status === 'mastered')
              )
              .map(word => (
                <div key={word.id} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <p className="text-xl font-arabic text-gray-900 dark:text-white mb-2">{word.arabic}</p>
                  <p className="text-gray-600 dark:text-gray-400">{word.english}</p>
                </div>
              ))
            }
          </div>
        )}
      </div>
    </div>
  );
}

export default Review;