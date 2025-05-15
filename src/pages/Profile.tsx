import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { BookOpen, Award, Flame, User as UserIcon } from 'lucide-react';
import { useWords } from '../hooks/useWords';

function Profile() {
  const { user } = useAuth();
  const { userWords } = useWords();

  const learned = userWords.filter(w => w.status === 'learning' || w.status === 'mastered').length;
  const mastered = userWords.filter(w => w.status === 'mastered').length;

  const stats = [
    { label: 'Words Learned', value: learned, icon: BookOpen },
    { label: 'Words Mastered', value: mastered, icon: Award },
    { label: 'Current Streak', value: 0, icon: Flame }
  ];

  return (
    <div className="min-h-screen pt-20 px-6 pb-12 bg-[#fdfaf3] dark:bg-gradient-to-br dark:from-[#0f1c14] dark:to-black text-gray-900 dark:text-white transition-colors duration-500">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 mb-8">
          <div className="flex items-center mb-4">
            <UserIcon className="h-8 w-8 text-gray-500 dark:text-gray-300 mr-3" />
            <h2 className="text-2xl font-bold">{user?.email || 'Guest User'}</h2>
          </div>
          <p className="text-gray-600 dark:text-gray-300">
            {user 
              ? 'Welcome back! Here’s your Quranic Arabic progress so far:'
              : 'You are logged in as a guest. Progress is not saved permanently.'}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {stats.map(({ label, value, icon: Icon }, i) => (
            <div key={i} className="bg-white dark:bg-gray-700 rounded-xl p-6 text-center shadow-md hover:shadow-lg transition">
              <Icon className="h-8 w-8 text-emerald-600 dark:text-emerald-400 mb-2" />
              <p className="text-3xl font-bold">{value}</p>
              <p className="text-sm text-gray-700 dark:text-gray-300">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Profile;
