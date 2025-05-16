import React, { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

type Word = {
  arabic: string;
  english: string;
  root: string;
  ayah_ref: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  status: 'learning' | 'mastered';
  next_review: string;
};

const vocabulary: Word[] = [
  { arabic: 'صلاة', english: 'Prayer', root: 'ص-ل-و', ayah_ref: '2:3', level: 'beginner', status: 'learning', next_review: '2025-05-16' },
  { arabic: 'إيمان', english: 'Faith', root: 'أ-م-ن', ayah_ref: '2:9', level: 'beginner', status: 'learning', next_review: '2025-05-16' },
  // ... (rest of the 300+ entries go here, will provide separate file if needed)
];

const levels: Array<Word['level']> = ['beginner', 'intermediate', 'advanced'];

export default function MyVocabulary() {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({
    beginner: true,
    intermediate: false,
    advanced: false,
  });

  const grouped: Record<string, Word[]> = {
    beginner: [],
    intermediate: [],
    advanced: [],
  };

  vocabulary.forEach((word) => {
    grouped[word.level].push(word);
  });

  const toggleExpand = (level: string) =>
    setExpanded((prev) => ({ ...prev, [level]: !prev[level] }));

  return (
    <div className="min-h-screen pt-20 px-6 pb-12 bg-[#fdfaf3] dark:bg-gradient-to-br dark:from-[#0f1c14] dark:to-[#052d1b] text-gray-900 dark:text-white transition-colors duration-500">
      <h1 className="text-3xl font-bold mb-10 text-emerald-700 dark:text-emerald-300 text-center drop-shadow-[0_1px_1px_rgba(0,255,170,0.4)]">
        📖 My Vocabulary
      </h1>

      {levels.map((level) => (
        <div key={level} className="border-t border-emerald-300/30 pt-6 mt-6">
          <button
            onClick={() => toggleExpand(level)}
            className="flex items-center gap-2 mb-3 font-semibold text-lg text-emerald-600 dark:text-emerald-300"
          >
            {expanded[level] ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
            {level.charAt(0).toUpperCase() + level.slice(1)} ({grouped[level].length})
          </button>

          <AnimatePresence initial={false}>
            {expanded[level] && (
              <motion.div
                className="space-y-4"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                {grouped[level].length === 0 ? (
                  <p className="text-sm text-gray-500 dark:text-gray-400 ml-6">
                    No words yet for this level.
                  </p>
                ) : (
                  grouped[level].map((w, idx) => (
                    <div
                      key={`${w.arabic}-${idx}`}
                      className="bg-white dark:bg-[#10291d] border dark:border-gray-700 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 p-4"
                    >
                      <div className="flex justify-between items-center mb-1">
                        <h2 className="text-xl font-[Scheherazade]">{w.arabic}</h2>
                        <span
                          className={`text-xs font-semibold px-2 py-1 rounded-full ${
                            w.status === 'mastered'
                              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                              : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
                          }`}
                        >
                          {w.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700 dark:text-gray-300 mb-1">
                        {w.english} • Root: {w.root}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Ayah: {w.ayah_ref} • Next Review: {new Date(w.next_review).toLocaleDateString()}
                      </p>
                    </div>
                  ))
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
}
