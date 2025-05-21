import React, { useState, useEffect } from 'react';
import { Search, BookOpen, Award } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../contexts/AuthContext';
import type { Database } from '../lib/database.types';

// Types
type Word = Database['public']['Tables']['words']['Row'];
type UserWord = Database['public']['Tables']['user_words']['Row'];
type WordWithStatus = Word & { status: string };
type Level = 'all' | 'beginner' | 'intermediate' | 'advanced';
type Deck = 'all' | 'Quranic' | 'Everyday';

export default function MyVocabulary() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLevel, setSelectedLevel] = useState<Level>('all');
  const [selectedDeck, setSelectedDeck] = useState<Deck>('all');
  const [expandedWord, setExpandedWord] = useState<string | null>(null);
  const [words, setWords] = useState<WordWithStatus[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchWords() {
      if (!user) return;
      try {
        setLoading(true);
        const [wordsResponse, userWordsResponse] = await Promise.all([
          supabase.from('words').select('*'),
          supabase.from('user_words').select('*').eq('user_id', user.id)
        ]);

        if (wordsResponse.error) throw wordsResponse.error;
        if (userWordsResponse.error) throw userWordsResponse.error;

        const wordsWithStatus: WordWithStatus[] = (wordsResponse.data || []).map(word => {
          const userWord = userWordsResponse.data.find(uw => uw.word_id === word.id);
          return {
            ...word,
            status: userWord?.status || 'not_started'
          };
        });

        setWords(wordsWithStatus);
      } catch (error) {
        console.error('Error fetching words:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchWords();
  }, [user]);

  const filtered = words.filter((w) => {
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch =
      w.arabic?.toLowerCase().includes(searchLower) ||
      w.english?.toLowerCase().includes(searchLower) ||
      w.root?.toLowerCase().includes(searchLower);
    const matchesLevel = selectedLevel === 'all' || w.level === selectedLevel;
    const matchesDeck = selectedDeck === 'all' || w.tag === selectedDeck;
    return matchesSearch && matchesLevel && matchesDeck;
  });

  const stats = {
    total: words.length,
    learning: words.filter((w) => w.status === 'learning').length,
    mastered: words.filter((w) => w.status === 'mastered').length,
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center bg-[#fdfaf3] dark:bg-gradient-to-br dark:from-[#0f1c14] dark:to-black">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 px-6 pb-12 bg-[#fdfaf3] dark:bg-gradient-to-br dark:from-[#0f1c14] dark:to-black text-gray-900 dark:text-white transition-colors duration-500">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-2 text-emerald-700 dark:text-emerald-300">🧠 Learn Arabic Vocabulary</h1>
        <p className="mb-6 text-sm text-gray-700 dark:text-gray-400">
          Choose between <strong>Quranic</strong> or <strong>Everyday</strong> decks to build your Arabic understanding.
        </p>

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

        <div className="flex gap-4 mb-4">
          <div className="relative flex-1">
            <Search className="absolute top-2.5 left-3 text-gray-400" size={18} />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by Arabic, English, or Root..."
              className="w-full pl-10 pr-4 py-2 rounded-lg bg-white dark:bg-gray-800 border dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <select
            value={selectedLevel}
            onChange={(e) => setSelectedLevel(e.target.value as Level)}
            className="px-4 py-2 rounded-lg bg-white dark:bg-gray-800 border dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="all">All Levels</option>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>

          <select
            value={selectedDeck}
            onChange={(e) => setSelectedDeck(e.target.value as Deck)}
            className="px-4 py-2 rounded-lg bg-white dark:bg-gray-800 border dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="all">All Decks</option>
            <option value="Quranic">Quranic</option>
            <option value="Everyday">Everyday</option>
          </select>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg overflow-x-auto shadow">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-900">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400">Arabic</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400">English</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400">Root</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400">Level</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {filtered.map((word) => (
                <React.Fragment key={word.id}>
                  <tr
                    onClick={() => setExpandedWord(expandedWord === word.id ? null : word.id)}
                    className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                  >
                    <td className="px-6 py-4 text-xl font-[Scheherazade]">{word.arabic}</td>
                    <td className="px-6 py-4">{word.english}</td>
                    <td className="px-6 py-4 text-gray-500 dark:text-gray-400">{word.root}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        word.level === 'beginner'
                          ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200'
                          : word.level === 'intermediate'
                          ? 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-200'
                          : 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200'
                      }`}>
                        {word.level}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        word.status === 'mastered'
                          ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200'
                          : word.status === 'learning'
                          ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-200'
                          : 'bg-gray-100 text-gray-700 dark:bg-gray-900 dark:text-gray-200'
                      }`}>
                        {word.status}
                      </span>
                    </td>
                  </tr>
                  {expandedWord === word.id && (
                    <tr>
                      <td colSpan={5} className="px-6 py-4 bg-gray-50 dark:bg-gray-700 text-sm text-gray-700 dark:text-gray-300">
                        <p><strong>Surah:</strong> {word.surah}</p>
                        <p><strong>Ayah:</strong> {word.ayah}</p>
                        <p><strong>Ayah Number:</strong> {word.ayah_number}</p>
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
