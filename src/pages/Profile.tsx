import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { BookOpen, Award, Flame, User as UserIcon } from 'lucide-react';
import { useWords } from '../hooks/useWords';

function Profile() {
  const { user } = useAuth();
  const { userWords } = useWords();

  // Calculate stats
  const learnedCount = userWords.length;
  const masteredCount = userWords.filter(uw => uw.status === 'mastered').length;
  const streakCount = 0;  // (Future enhancement: calculate daily streak)

  const stats = [
    { label: 'Words Learned', value: learnedCount, icon: BookOpen },
    { label: 'Words Mastered', value: masteredCount, icon: Award },
    { label: 'Days Streak', value: streakCount, icon: Flame },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 mb-8">
        <div className="flex items-center mb-4">
          <UserIcon className="h-8 w-8 text-gray-500 dark:text-gray-300 mr-3" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {user?.email || 'Guest User'}
          </h2>
        </div>
        <p className="text-gray-600 dark:text-gray-300">
          {user ? 'Welcome back! Here is your progress so far:' : 'You are logged in as a guest. Progress will not be saved permanently.'}
        </p>
      </div>
      {/* Stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 text-center shadow">
              <Icon className="h-8 w-8 text-emerald-600 dark:text-emerald-400 mb-2" />
              <p className="text-3xl font-bold text-gray-800 dark:text-gray-100">{stat.value}</p>
              <p className="text-gray-600 dark:text-gray-300">{stat.label}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Profile;
