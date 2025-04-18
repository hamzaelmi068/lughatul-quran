import React, { useState, useEffect } from 'react';
import { Book, PlayCircle, NotebookPen } from 'lucide-react';
import { useWords } from '../hooks/useWords';
import Flashcard from '../components/Flashcard';
import { calculateNextReview } from '../lib/spaced-repetition';
import type { Database } from '../lib/database.types';

type Word = Database['public']['Tables']['words']['Row'];

function Learn() {
  const [selectedLevel, setSelectedLevel] = useState<string | null>(null);
  const [currentWord, setCurrentWord] = useState<Word | null>(null);
  const { words, userWords, loading, updateWordProgress } = useWords();

  const levels = [
    {
      id: 'beginner',
      title: 'Beginner',
      description: 'Start with the basics of Arabic letters and simple words',
      icon: Book,
      color: 'text-blue-600',
    },
    {
      id: 'intermediate',
      title: 'Intermediate',
      description: 'Learn common Quranic words and basic grammar',
      icon: PlayCircle,
      color: 'text-emerald-600',
    },
    {
      id: 'advanced',
      title: 'Advanced',
      description: 'Master complex grammatical structures and vocabulary',
      icon: NotebookPen,
      color: 'text-purple-600',
    },
  ];

  useEffect(() => {
    if (selectedLevel && words.length > 0) {
      const unlearned = words.filter(word => 
        !userWords.some(uw => uw.word_id === word.id)
      );
      if (unlearned.length > 0) {
        setCurrentWord(unlearned[0]);
      }
    }
  }, [selectedLevel, words, userWords]);

  const handleResult = async (quality: 0 | 1 | 2 | 3 | 4 | 5) => {
    if (!currentWord) return;

    const userWord = userWords.find(uw => uw.word_id === currentWord.id);
    const result = calculateNextReview(
      quality,
      userWord?.interval || 0,
      userWord?.ease_factor || 2.5
    );

    const nextReview = new Date();
    nextReview.setDate(nextReview.getDate() + result.interval);

    await updateWordProgress(currentWord.id, 'learning', {
      easeFactor: result.easeFactor,
      interval: result.interval,
      nextReview: nextReview.toISOString(),
    });

    // Move to next word
    const unlearned = words.filter(word => 
      !userWords.some(uw => uw.word_id === word.id)
    );
    setCurrentWord(unlearned[1] || null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">Choose Your Level</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {levels.map((level) => {
          const Icon = level.icon;
          return (
            <button
              key={level.id}
              onClick={() => setSelectedLevel(level.id)}
              className={`p-6 rounded-lg shadow-lg transition duration-300 ${
                selectedLevel === level.id
                  ? 'bg-emerald-600 text-white'
                  : 'bg-white dark:bg-gray-800 hover:bg-emerald-50 dark:hover:bg-gray-700'
              }`}
            >
              <Icon className={`h-12 w-12 mb-4 mx-auto ${selectedLevel === level.id ? 'text-white' : level.color}`} />
              <h3 className={`text-xl font-semibold mb-2 ${
                selectedLevel === level.id ? 'text-white' : 'text-gray-900 dark:text-white'
              }`}>
                {level.title}
              </h3>
              <p className={selectedLevel === level.id ? 'text-gray-100' : 'text-gray-600 dark:text-gray-300'}>
                {level.description}
              </p>
            </button>
          );
        })}
      </div>

      {selectedLevel && currentWord && (
        <div className="mt-8">
          <Flashcard word={currentWord} onResult={handleResult} />
        </div>
      )}

      {selectedLevel && !currentWord && (
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Great job! You've completed all available words.
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Check back later for more words or practice your learned words in the Review section.
          </p>
        </div>
      )}
    </div>
  );
}

export default Learn;