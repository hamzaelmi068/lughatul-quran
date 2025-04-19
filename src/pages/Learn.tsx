import React, { useState, useEffect } from 'react';
import { Book, PlayCircle, NotebookPen } from 'lucide-react';
import { useWords } from '../hooks/useWords';
import Flashcard from '../components/Flashcard';
import { calculateNextReview } from '../lib/spaced-repetition';
import type { Database } from '../lib/database.types';

type Word = Database['public']['Tables']['words']['Row'];

function Learn() {
  const { words, userWords, loading, updateWordProgress } = useWords();
  const [selectedLevel, setSelectedLevel] = useState<string | null>(null);
  const [currentWord, setCurrentWord] = useState<Word | null>(null);

  // Define learning levels (just conceptual groupings for UI)
  const levels = [
    {
      id: 'beginner',
      title: 'Beginner',
      description: 'Start with basic Arabic letters and simple words.',
      icon: Book,
      color: 'text-blue-600',
    },
    {
      id: 'intermediate',
      title: 'Intermediate',
      description: 'Common Quranic words and basic grammar.',
      icon: PlayCircle,
      color: 'text-emerald-600',
    },
    {
      id: 'advanced',
      title: 'Advanced',
      description: 'Complex grammatical structures and vocabulary.',
      icon: NotebookPen,
      color: 'text-purple-600',
    },
  ];

  // When a level is selected, pick the first word that the user hasn’t learned yet (or just first in list for now)
  useEffect(() => {
    if (selectedLevel && words.length > 0) {
      // For simplicity, just pick the first word not in userWords (or first word if all have been seen)
      const learnedIds = userWords.map(uw => uw.word_id);
      const nextWord = words.find(w => !learnedIds.includes(w.id)) || null;
      setCurrentWord(nextWord);
    } else {
      setCurrentWord(null);
    }
  }, [selectedLevel, words, userWords]);

  // Handle the result of a flashcard review
  const handleResult = async (quality: 0 | 1 | 2 | 3 | 4 | 5) => {
    if (!currentWord) return;
    // Compute next interval using SM-2 algorithm
    const userWord = userWords.find(uw => uw.word_id === currentWord.id);
    const result = calculateNextReview(
      quality,
      userWord?.interval || 0,
      userWord?.ease_factor || 2.5
    );
    const nextReviewDate = new Date();
    nextReviewDate.setDate(new Date().getDate() + result.interval);
    // Update progress in Supabase (status stays 'learning' until mastered later)
    await updateWordProgress(currentWord.id, 'learning', {
      easeFactor: result.easeFactor,
      interval: result.interval,
      nextReview: nextReviewDate.toISOString(),
    });
    // Move to the next word (remove the current word from the list for this session)
    const remainingWords = words.filter(w => w.id !== currentWord.id);
    setCurrentWord(remainingWords.length ? remainingWords[0] : null);
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
      <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-6">
        Learn New Words
      </h1>

      {!selectedLevel && (
        <div>
          <p className="mb-4 text-gray-700 dark:text-gray-300">
            Choose a level to begin learning:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {levels.map(level => {
              const Icon = level.icon;
              const selected = selectedLevel === level.id;
              return (
                <button 
                  key={level.id}
                  onClick={() => setSelectedLevel(level.id)}
                  className={`p-6 rounded-lg shadow-lg transition duration-300 ${
                    selected 
                      ? 'bg-emerald-600 text-white' 
                      : 'bg-white dark:bg-gray-800 hover:bg-emerald-50 dark:hover:bg-gray-700 text-gray-900 dark:text-white'
                  }`}
                >
                  <Icon className={`h-12 w-12 mb-4 mx-auto ${selected ? 'text-white' : level.color}`} />
                  <h3 className="text-2xl font-semibold mb-2">
                    {level.title}
                  </h3>
                  <p className={selected ? 'text-gray-100' : 'text-gray-600 dark:text-gray-300'}>
                    {level.description}
                  </p>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {selectedLevel && currentWord && (
        <div>
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-4">
            {/** Display level name in title **/}
            {levels.find(l => l.id === selectedLevel)?.title} Level – Flashcards
          </h2>
          <Flashcard word={currentWord} onResult={handleResult} />
          <p className="mt-4 text-gray-600 dark:text-gray-400 text-center">
            Tap the card to flip. Tap again to mark as learned and go to the next word.
          </p>
        </div>
      )}

      {selectedLevel && !currentWord && (
        <div className="text-center py-16">
          <p className="text-2xl text-gray-800 dark:text-gray-100 mb-4">🎉 You have learned all available words at this level!</p>
          <button 
            onClick={() => setSelectedLevel(null)} 
            className="text-emerald-600 hover:underline"
          >
            Choose another level
          </button>
        </div>
      )}
    </div>
  );
}

export default Learn;
