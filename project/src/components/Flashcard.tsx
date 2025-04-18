import React, { useState } from 'react';
import { PlayCircle } from 'lucide-react';
import type { Database } from '../lib/database.types';

type Word = Database['public']['Tables']['words']['Row'];

interface FlashcardProps {
  word: Word;
  onResult: (quality: 0 | 1 | 2 | 3 | 4 | 5) => void;
}

export default function Flashcard({ word, onResult }: FlashcardProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [showButtons, setShowButtons] = useState(false);

  const handleFlip = () => {
    if (!isFlipped) {
      setIsFlipped(true);
      setShowButtons(true);
    }
  };

  const handleAudioPlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (word.audio_url) {
      const audio = new Audio(word.audio_url);
      audio.play();
    }
  };

  return (
    <div
      onClick={handleFlip}
      className={`relative w-full max-w-xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-lg cursor-pointer transform transition-all duration-500 ${
        isFlipped ? 'scale-105' : 'hover:scale-102'
      }`}
    >
      <div className="p-8">
        <div className="flex justify-between items-center mb-6">
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {word.surah} : {word.ayah_number}
          </span>
          {word.audio_url && (
            <button
              onClick={handleAudioPlay}
              className="text-emerald-600 dark:text-emerald-400 hover:text-emerald-700"
            >
              <PlayCircle className="h-6 w-6" />
            </button>
          )}
        </div>

        <div className="text-center">
          <p className="text-4xl font-arabic mb-4">{word.arabic}</p>
          {isFlipped && (
            <>
              <p className="text-xl text-gray-700 dark:text-gray-300 mb-2">{word.english}</p>
              {word.root && (
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                  Root: {word.root}
                </p>
              )}
              <p className="text-sm text-gray-600 dark:text-gray-400 italic">{word.ayah}</p>
            </>
          )}
        </div>

        {showButtons && (
          <div className="mt-8 grid grid-cols-3 gap-2">
            <button
              onClick={() => onResult(1)}
              className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200"
            >
              Hard
            </button>
            <button
              onClick={() => onResult(3)}
              className="px-4 py-2 bg-yellow-100 text-yellow-700 rounded-lg hover:bg-yellow-200"
            >
              Good
            </button>
            <button
              onClick={() => onResult(5)}
              className="px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200"
            >
              Easy
            </button>
          </div>
        )}
      </div>
    </div>
  );
}