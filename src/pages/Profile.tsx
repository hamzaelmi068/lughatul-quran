import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { BookOpen, Award, Flame, User as UserIcon } from 'lucide-react';
import { useWords } from '../hooks/useWords';

function Profile() {
  const { user } = useAuth();
  const { userWords } = useWords();

  const learnedCount = userWords.filter((w) => w.status === 'learning' || w.status === 'mastered').length;
  const masteredCount = userWords.filter((uw) => uw.status === 'mastered').length;
  const streakCount = 0;

  const stats = [
    { label: 'Words Learned', value: learnedCount, icon: BookOpen },
    { label: 'Words Mastered', value: masteredCount, icon: Award },
    { label: 'Days Streak', value: streakCount, icon: Flame },
  ];

  return (
    <div className="min-h-screen pt-20 px-6 pb-12 bg-[#fdfaf3] text-gray-900 dark:bg-gradient-to-br dark:from-[#0f1c14] dark:to-black dark:text-white transition-colors duration-500">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 mb-8">
          <div className="flex items-center mb-4">
            <UserIcon className="h-8 w-8 text-gray-500 dark:text-gray-300 mr-3" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              {user?.email || 'Guest User'}
            </h2>
          </div>
          <p className="text-gray-600 dark:text-gray-300">
            {user
              ? 'Welcome back! Here is your progress so far:'
              : 'You are logged in as a guest. Progress will not be saved permanently.'}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {stats.map(({ label, value, icon: Icon }, idx) => (
            <div
              key={idx}
              className="bg-white dark:bg-gray-700 rounded-xl p-6 text-center shadow-md transition-all hover:shadow-lg"
            >
              <Icon className="h-8 w-8 text-emerald-600 dark:text-emerald-400 mb-2" />
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{value}</p>
              <p className="text-gray-600 dark:text-gray-300">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Profile;
