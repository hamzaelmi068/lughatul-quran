import React, { useState } from 'react';
import { PlayCircle } from 'lucide-react';
import type { Database } from '../lib/database.types';
type Word = Database['public']['Tables']['words']['Row'];

interface FlashcardProps {
  word: Word;
  onResult: (quality: 0 | 1 | 2 | 3 | 4 | 5) => void;
}

const Flashcard: React.FC<FlashcardProps> = ({ word, onResult }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleFlip = () => {
    if (isFlipped) {
      // If flipping back (after seeing answer), assume a successful review for now
      onResult(5); 
    }
    setIsFlipped(!isFlipped);
  };

  const handleAudio = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (word.audio_url) {
      const audio = new Audio(word.audio_url);
      audio.play();
    }
  };

  return (
    <div 
      onClick={handleFlip}
      className="relative w-full max-w-xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-lg cursor-pointer 
                 p-6 md:p-8 transition-colors duration-300"
    >
      {/* Audio Play Button (top-right) */}
      {word.audio_url && (
        <button 
          onClick={handleAudio} 
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          aria-label="Play pronunciation"
        >
          <PlayCircle className="w-6 h-6" />
        </button>
      )}
      {/* Card Content */}
      <div className="text-center">
        {/* Arabic word (front side) */}
        <p className={`text-4xl font-arabic mb-4 ${isFlipped ? 'hidden' : ''}`}>
          {word.arabic}
        </p>
        {/* English and details (back side) */}
        {isFlipped && (
          <div className="text-center">
            <p className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-3">{word.english}</p>
            <p className="text-gray-700 dark:text-gray-300 mb-1">
              <em>{word.surah} : {word.ayah_number}</em>
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">({word.ayah})</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Flashcard;
