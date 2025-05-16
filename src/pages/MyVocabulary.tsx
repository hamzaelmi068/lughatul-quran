import React, { useState, useMemo } from 'react';
import { Search, BookOpen, Award } from 'lucide-react';

type Word = {
  arabic: string;
  english: string;
  root: string;
  ayah_ref: string;
  level: string;
  status: 'learning' | 'mastered';
};

const vocabList: Word[] = [
  { arabic: 'رَحْمَٰن', english: 'Most Merciful', root: 'ر ح م', ayah_ref: '1:3', level: 'beginner', status: 'learning' },
  { arabic: 'كِتَاب', english: 'Book', root: 'ك ت ب', ayah_ref: '2:2', level: 'beginner', status: 'mastered' },
  { arabic: 'صَلَاة', english: 'Prayer', root: 'ص ل و', ayah_ref: '2:3', level: 'intermediate', status: 'learning' },
  { arabic: 'إِيمَان', english: 'Faith', root: 'أ م ن', ayah_ref: '2:9', level: 'intermediate', status: 'mastered' },
  { arabic: 'نُور', english: 'Light', root: 'ن و ر', ayah_ref: '24:35', level: 'advanced', status: 'learning' },
  // ⬆️ Add more entries here as needed.
];

export default function MyVocabulary() {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedWord, setExpandedWord] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return vocabList.filter((w) => {
      return (
        w.arabic.toLowerCase().includes(searchQuery.toLowerCase()) ||
        w.english.toLowerCase().includes(searchQuery.toLowerCase()) ||
        w.root.toLowerCase().includes(searchQuery.toLowerCase())
      );
    });
  }, [searchQuery]);

  const stats = {
    total: vocabList.length,
    learning: vocabList.filter((w) => w.status === 'learning').length,
    mastered: vocabList.filter((w) => w.status === 'mastered').length,
  };

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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400">Arabic</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400">English</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400">Root</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {filtered.map((word, index) => (
                <React.Fragment key={index}>
                  <tr
                    onClick={() =>
                      setExpandedWord(expandedWord === word.arabic ? null : word.arabic)
                    }
                    className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                  >
                    <td className="px-6 py-4 text-xl font-[Scheherazade]">{word.arabic}</td>
                    <td className="px-6 py-4">{word.english}</td>
                    <td className="px-6 py-4 text-gray-500 dark:text-gray-400">{word.root}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          word.status === 'mastered'
                            ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200'
                            : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-200'
                        }`}
                      >
                        {word.status}
                      </span>
                    </td>
                  </tr>
                  {expandedWord === word.arabic && (
                    <tr>
                      <td colSpan={4} className="px-6 py-4 bg-gray-50 dark:bg-gray-700 text-sm text-gray-700 dark:text-gray-300">
                        <p><strong>Ayah Ref:</strong> {word.ayah_ref}</p>
                        <p><strong>Level:</strong> {word.level}</p>
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

