import React, { useState } from 'react';
import { useWords } from '@/hooks/useWords';
import Flashcard from '@/components/Flashcard';
import { Book, Sparkles, GraduationCap } from 'lucide-react';
import type { Database } from '@/lib/database.types';

const Learn = () => {
  const [selectedLevel, setSelectedLevel] = useState<'beginner' | 'intermediate' | 'advanced'>('beginner');
  const [currentIndex, setCurrentIndex] = useState(0);
  const { words, loading, updateWordProgress } = useWords();

  type Word = Database['public']['Tables']['words']['Row'];

  const levels = [
    { id: 'beginner', title: 'Beginner', icon: Book, color: 'text-blue-400' },
    { id: 'intermediate', title: 'Intermediate', icon: Sparkles, color: 'text-yellow-400' },
    { id: 'advanced', title: 'Advanced', icon: GraduationCap, color: 'text-purple-400' }
  ];

  const levelWords = words.filter((word) => word.level === selectedLevel);
  const currentWord = levelWords[currentIndex];

  const handleLearned = async (word: Word) => {
    await updateWordProgress(word.id, {
      status: 'learning',
      interval: 1,
      ease_factor: 2.5,
      next_review: new Date()
    });

    setCurrentIndex((prev) => (prev + 1 < levelWords.length ? prev + 1 : 0));
  };

  return (
    <div className="min-h-screen py-8 px-6 text-white">
      <h1 className="text-3xl font-bold text-center mb-6">Learn New Words</h1>

      <div className="flex justify-center gap-4 mb-6">
        {levels.map(({ id, title, icon: Icon, color }) => (
          <button
            key={id}
            onClick={() => {
              setSelectedLevel(id as any);
              setCurrentIndex(0);
            }}
            className={`px-4 py-2 rounded-lg border flex items-center gap-2 transition ${
              selectedLevel === id ? 'bg-gray-700 border-green-500' : 'bg-gray-900 border-gray-600'
            }`}
          >
            <Icon className={`w-5 h-5 ${color}`} />
            <span>{title}</span>
          </button>
        ))}
      </div>

      <div className="max-w-xl mx-auto">
        {loading ? (
          <p className="text-center">Loading words...</p>
        ) : currentWord ? (
          <Flashcard word={currentWord} onReview={() => handleLearned(currentWord)} />
        ) : (
          <p className="text-center text-green-400">
            🎉 You have learned all available words at this level!
          </p>
        )}
      </div>
    </div>
  );
};

export default Learn;
