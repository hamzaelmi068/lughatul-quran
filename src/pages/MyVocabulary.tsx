import React, { useEffect, useState } from 'react';
import { useWords } from '@/hooks/useWords';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import type { Database } from '@/lib/database.types';

type Word = Database['public']['Tables']['words']['Row'];
type UserWord = Database['public']['Tables']['user_words']['Row'];
type MergedWord = Word & UserWord;

const levels = ['beginner', 'intermediate', 'advanced'] as const;

export default function MyVocabulary() {
  const { words, userWords, loading } = useWords();
  const [expanded, setExpanded] = useState<Record<string, boolean>>({
    beginner: true,
    intermediate: false,
    advanced: false
  });

  const grouped: Record<string, MergedWord[]> = {
    beginner: [],
    intermediate: [],
    advanced: []
  };

  // Merge userWords with words and group by level
  userWords.forEach((uw) => {
    const word = words.find((w) => w.id === uw.word_id);
    if (word) {
      const level = word.level as keyof typeof grouped;
      grouped[level].push({ ...word, ...uw });
    }
  });

  const toggleExpand = (level: string) =>
    setExpanded((prev) => ({ ...prev, [level]: !prev[level] }));

  return (
    <div className="min-h-screen pt-20 px-6 pb-12 bg-[#fdfaf3] dark:bg-gradient-to-br dark:from-[#0f1c14] dark:to-[#052d1b] text-gray-900 dark:text-white transition-colors duration-500">
      <h1 className="text-3xl font-bold mb-10 text-emerald-700 dark:text-emerald-300 text-center drop-shadow-[0_1px_1px_rgba(0,255,170,0.4)]">
        📖 My Vocabulary
      </h1>

      {loading ? (
        <p className="text-center text-gray-500 dark:text-gray-400">Loading...</p>
      ) : (
        levels.map((level, index) => (
          <div key={level} className="border-t border-emerald-300/30 pt-6 mt-6">
            <button
              onClick={() => toggleExpand(level)}
              className="flex items-center gap-2 mb-3 font-semibold text-lg text-emerald-600 dark:text-emerald-300"
            >
              {expanded[level] ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
              {level[0].toUpperCase() + level.slice(1)} ({grouped[level].length})
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
                      No words reviewed yet for this level.
                    </p>
                  ) : (
                    grouped[level].map((w) => (
                      <div
                        key={w.id}
                        className="bg-white dark:bg-[#10291d] border dark:border-gray-700 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 p-4"
                      >
                        <div className="flex justify-between items-center mb-1">
                          <h2 className="text-xl font-[Scheherazade]">{w.arabic}</h2>
                          <span
                            className={`text-xs font-semibold px-2 py-1 rounded-full transition ${
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
                          Next Review: {new Date(w.next_review).toLocaleDateString()}
                        </p>
                      </div>
                    ))
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))
      )}
    </div>
  );
}
