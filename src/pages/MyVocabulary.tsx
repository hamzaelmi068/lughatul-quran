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
        <div className="mb-8">
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
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by Arabic, English, or Root..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Words List */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
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
                    <tr
                      onClick={() => setExpandedWord(expandedWord === word.id ? null : word.id)}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors"
                    >
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
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            word.status === 'mastered'
                              ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100'
                              : 'bg-amber-100 text-amber-800 dark:bg-amber-800 dark:text-amber-100'
                          }`}
                        >
                          {word.status === 'mastered' ? 'Mastered' : 'Learning'}
                        </span>
                      </td>
                    </tr>
                    {expandedWord === word.id && (
                      <tr className="bg-gray-50 dark:bg-gray-700">
                        <td colSpan={4} className="px-6 py-4">
                          <div className="text-sm text-gray-700 dark:text-gray-300">
                            <p className="mb-2">
                              <span className="font-semibold">Surah:</span> {word.surah}
                            </p>
                            <p className="mb-2">
                              <span className="font-semibold">Ayah:</span> {word.ayah}
                            </p>
                            {word.last_reviewed && (
                              <p>
                                <span className="font-semibold">Last Reviewed:</span>{' '}
                                {new Date(word.last_reviewed).toLocaleDateString()}
                              </p>
                            )}
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}