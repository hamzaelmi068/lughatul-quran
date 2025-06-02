import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { BookOpen, Award, Flame, User as UserIcon, LogIn, LogOut } from 'lucide-react';
import { useWords } from '../hooks/useWords';

function Profile() {
  const { user, signOut } = useAuth();
  const { userWords } = useWords();

  const learned = userWords.filter(w => w.status === 'learning' || w.status === 'mastered').length;
  const mastered = userWords.filter(w => w.status === 'mastered').length;

  const stats = [
    { label: 'Words Learned', value: learned, icon: BookOpen },
    { label: 'Words Mastered', value: mastered, icon: Award },
    { label: 'Current Streak', value: 0, icon: Flame } // Replace 0 with actual logic if needed
  ];

  return (
    <div className="min-h-screen px-6 pb-12 pt-24 bg-[#fdfaf3] dark:bg-gradient-to-br dark:from-[#0f1c14] dark:to-black text-gray-900 dark:text-white transition-colors duration-500">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 mb-8 flex flex-col sm:flex-row justify-between items-center">
          <div className="flex items-center mb-4 sm:mb-0">
            <UserIcon className="h-8 w-8 text-gray-500 dark:text-gray-300 mr-3" />
            <div>
              <h2 className="text-2xl font-bold">{user?.email || 'Guest User'}</h2>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                {user
                  ? 'Welcome back! Here's your Quranic Arabic progress so far:'
                  : 'You are logged in as a guest. Progress is not saved permanently.'}
              </p>
            </div>
          </div>

          {user ? (
            <button
              onClick={signOut}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition"
            >
              <LogOut size={18} />
              <span>Log Out</span>
            </button>
          ) : (
            <a
              href="/login"
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition"
            >
              <LogIn size={18} />
              <span>Log In</span>
            </a>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {stats.map(({ label, value, icon: Icon }, i) => (
            <div
              key={i}
              className="bg-white dark:bg-gray-700 rounded-xl p-6 text-center shadow-md hover:shadow-lg transition"
            >
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