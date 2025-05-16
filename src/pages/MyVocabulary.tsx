/*
import React, { useState, useEffect } from 'react';
import { Search, BookOpen, Award } from 'lucide-react';
import { useWords } from '../hooks/useWords';
import type { Database } from '../lib/database.types';

type Word = Database['public']['Tables']['words']['Row'];
type UserWord = Database['public']['Tables']['user_words']['Row'];

type WordWithProgress = Word & {
  status: UserWord['status'];
  last_reviewed: UserWord['last_reviewed'];
};

const LEVELS = ['beginner', 'intermediate', 'advanced'] as const;

export default function MyVocabulary() {
  const { words, userWords, loading } = useWords();
  const [activeTab, setActiveTab] = useState<typeof LEVELS[number]>('beginner');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedWord, setExpandedWord] = useState<string | null>(null);

  // Combine words with user progress
  const vocabularyList = React.useMemo(() => {
    const userWordMap = new Map(userWords.map(uw => [uw.word_id, uw]));
    
    return words
      .map(word => {
        const userWord = userWordMap.get(word.id);
        if (!userWord || userWord.status === 'not_started') return null;
        
        return {
          ...word,
          status: userWord.status,
          last_reviewed: userWord.last_reviewed,
        };
      })
      .filter((w): w is WordWithProgress => w !== null);
  }, [words, userWords]);

  // Filter words based on search and active tab
  const filteredWords = React.useMemo(() => {
    return vocabularyList.filter(word => {
      const matchesSearch = searchQuery === '' || 
        word.arabic.toLowerCase().includes(searchQuery.toLowerCase()) ||
        word.english.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (word.root?.toLowerCase() || '').includes(searchQuery.toLowerCase());
      
      return matchesSearch;
    });
  }, [vocabularyList, searchQuery, activeTab]);

  const stats = {
    total: vocabularyList.length,
    learning: vocabularyList.filter(w => w.status === 'learning').length,
    mastered: vocabularyList.filter(w => w.status === 'mastered').length,
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 px-6 pb-12 bg-[#fdfaf3] dark:bg-gradient-to-br dark:from-[#0f1c14] dark:to-black text-gray-900 dark:text-white transition-colors duration-500">
      <div className="max-w-6xl mx-auto">
        {/* Header with Stats */}
        {/* <div className="mb-8">
          <h1 className="text-3xl font-bold mb-6 text-emerald-700 dark:text-emerald-300">
            📚 My Vocabulary
          </h1>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-gray-600 dark:text-gray-300">Total Words</span>
                <BookOpen className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <p className="text-2xl font-bold mt-2">{stats.total}</p>
            </div>

            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-gray-600 dark:text-gray-300">Learning</span>
                <BookOpen className="h-5 w-5 text-amber-600 dark:text-amber-400" />
              </div>
              <p className="text-2xl font-bold mt-2">{stats.learning}</p>
            </div>

            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-gray-600 dark:text-gray-300">Mastered</span>
                <Award className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <p className="text-2xl font-bold mt-2">{stats.mastered}</p>
            </div>
          </div>

          {/* Search Bar */}
          {/* <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by Arabic, English, or Root..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
          </div>
        </div> */}

        {/* Words List */}
        {/* <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-900">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Arabic
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    English
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Root
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {filteredWords.map((word) => (
                  <React.Fragment key={word.id}>
                    <tr className="hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-xl font-arabic">{word.arabic}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-900 dark:text-gray-100">
                        {word.english}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-500 dark:text-gray-400">
                        {word.root || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-xs font-medium">{word.status}</span>
                      </td>
                    </tr>
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </div> */}
     /* </div>
    </div>
  );
} */


import React, { useEffect, useState } from 'react';
import { useWords } from '@/hooks/useWords';
import { ChevronDown, ChevronRight } from 'lucide-react';
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

  // merge and group
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
    <div className="min-h-screen pt-20 px-6 pb-12 bg-[#fdfaf3] dark:bg-gradient-to-br dark:from-[#0f1c14] dark:to-black text-gray-900 dark:text-white transition-colors duration-500">
      <h1 className="text-3xl font-bold mb-8 text-emerald-700 dark:text-emerald-300 text-center">
        📖 My Vocabulary
      </h1>

      {loading ? (
        <p className="text-center text-gray-500 dark:text-gray-400">Loading...</p>
      ) : (
        levels.map((level) => (
          <div key={level} className="mb-6">
            <button
              onClick={() => toggleExpand(level)}
              className="flex items-center gap-2 mb-2 font-semibold text-lg text-emerald-600 dark:text-emerald-300"
            >
              {expanded[level] ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
              {level[0].toUpperCase() + level.slice(1)} ({grouped[level].length})
            </button>

            {expanded[level] && (
              <div className="space-y-4">
                {grouped[level].length === 0 ? (
                  <p className="text-sm text-gray-500 dark:text-gray-400 ml-6">
                    No words reviewed yet for this level.
                  </p>
                ) : (
                  grouped[level].map((w) => (
                    <div
                      key={w.id}
                      className="bg-white dark:bg-white/5 border dark:border-gray-700 rounded-lg shadow-sm p-4"
                    >
                      <div className="flex justify-between items-center">
                        <h2 className="text-xl font-[Scheherazade]">{w.arabic}</h2>
                        <span
                          className={`text-xs font-medium px-2 py-1 rounded ${
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
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
}