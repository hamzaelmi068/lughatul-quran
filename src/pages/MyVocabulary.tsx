import React, { useState, useMemo } from 'react';
import { Search, BookOpen, Award } from 'lucide-react';
import { useWords } from '../hooks/useWords';
import type { Database } from '../lib/database.types';

type Word = Database['public']['Tables']['words']['Row'];
type UserWord = Database['public']['Tables']['user_words']['Row'];
type MergedWord = Word & Partial<UserWord>;

export default function MyVocabulary() {
  const { words, userWords, loading } = useWords();
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedWord, setExpandedWord] = useState<string | null>(null);

  const vocabulary: MergedWord[] = useMemo(() => {
    const map = new Map(userWords.map((uw) => [uw.word_id, uw]));
    return words
      .map((word) => {
        const userWord = map.get(word.id);
        if (!userWord) return null;
        return {
          ...word,
          ...userWord,
        };
      })
      .filter((w): w is MergedWord => !!w);
  }, [words, userWords]);

  const filtered = useMemo(() => {
    return vocabulary.filter((w) => {
      return (
        w.arabic.toLowerCase().includes(searchQuery.toLowerCase()) ||
        w.english.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (w.root || '').toLowerCase().includes(searchQuery.toLowerCase())
      );
    });
  }, [searchQuery, vocabulary]);

  const stats = {
    total: vocabulary.length,
    learning: vocabulary.filter((w) => w.status === 'learning').length,
    mastered: vocabulary.filter((w) => w.status === 'mastered').length,
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 px-6 pb-12 bg-[#fdfaf3] dark:bg-gradient-to-br dark:from-[#0f1c14] dark:to-black text-gray-900 dark:text-white transition-colors duration-500">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-emerald-700 dark:text-emerald-300">📖 My Vocabulary</h1>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
            <div className="flex justify-between">
              <span>Total Words</span>
              <BookOpen className="text-emerald-500" size={18} />
            </div>
            <p className="text-2xl font-bold mt-2">{stats.total}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
            <div className="flex justify-between">
              <span>Learning</span>
              <BookOpen className="text-amber-500" size={18} />
            </div>
            <p className="text-2xl font-bold mt-2">{stats.learning}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
            <div className="flex justify-between">
              <span>Mastered</span>
              <Award className="text-green-500" size={18} />
            </div>
            <p className="text-2xl font-bold mt-2">{stats.mastered}</p>
          </div>
        </div>

        <div className="relative mb-4">
          <Search className="absolute top-2.5 left-3 text-gray-400" size={18} />
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by Arabic, English, or Root..."
            className="w-full pl-10 pr-4 py-2 rounded-lg bg-white dark:bg-gray-800 border dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg overflow-x-auto shadow">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-900">
              <tr>
                <th className="text-left text-xs font-semibold text-gray-500 dark:text-gray-400 px-6 py-3">Arabic</th>
                <th className="text-left text-xs font-semibold text-gray-500 dark:text-gray-400 px-6 py-3">English</th>
                <th className="text-left text-xs font-semibold text-gray-500 dark:text-gray-400 px-6 py-3">Root</th>
                <th className="text-left text-xs font-semibold text-gray-500 dark:text-gray-400 px-6 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {filtered.map((word) => (
                <React.Fragment key={word.id}>
                  <tr
                    className="hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                    onClick={() => setExpandedWord(expandedWord === word.id ? null : word.id)}
                  >
                    <td className="px-6 py-4 text-xl font-arabic">{word.arabic}</td>
                    <td className="px-6 py-4">{word.english}</td>
                    <td className="px-6 py-4 text-gray-500 dark:text-gray-400">{word.root || '-'}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          word.status === 'mastered'
                            ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200'
                            : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-200'
                        }`}
                      >
                        {word.status ?? 'learning'}
                      </span>
                    </td>
                  </tr>
                  {expandedWord === word.id && (
                    <tr>
                      <td colSpan={4} className="px-6 py-4 bg-gray-50 dark:bg-gray-700 text-sm">
                        <div className="text-gray-600 dark:text-gray-300 space-y-1">
                          <p><strong>Ayah Ref:</strong> {word.ayah_ref}</p>
                          {word.next_review && (
                            <p><strong>Next Review:</strong> {new Date(word.next_review).toLocaleDateString()}</p>
                          )}
                          {word.last_reviewed && (
                            <p><strong>Last Reviewed:</strong> {new Date(word.last_reviewed).toLocaleDateString()}</p>
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
  );
}
