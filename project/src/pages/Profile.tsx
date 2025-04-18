import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { User, Settings, Award, BookOpen } from 'lucide-react';

function Profile() {
  const { user } = useAuth();

  const stats = [
    { label: 'Words Learned', value: '0', icon: BookOpen },
    { label: 'Words Mastered', value: '0', icon: Award },
    { label: 'Days Streak', value: '0', icon: Settings },
  ];

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 mb-8">
        <div className="flex items-center space-x-4 mb-6">
          <div className="bg-emerald-100 dark:bg-emerald-900 p-4 rounded-full">
            <User className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {user?.email || 'Guest User'}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Member since {new Date().toLocaleDateString()}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 text-center"
              >
                <Icon className="h-8 w-8 text-emerald-600 dark:text-emerald-400 mx-auto mb-2" />
                <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                  {stat.value}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">{stat.label}</p>
              </div>
            );
          })}
        </div>

        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Settings
          </h2>
          <div className="space-y-4">
            <button className="w-full text-left px-4 py-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition duration-300">
              <span className="text-gray-700 dark:text-gray-300">Notification Preferences</span>
            </button>
            <button className="w-full text-left px-4 py-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition duration-300">
              <span className="text-gray-700 dark:text-gray-300">Account Settings</span>
            </button>
            <button className="w-full text-left px-4 py-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition duration-300">
              <span className="text-gray-700 dark:text-gray-300">Privacy Settings</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;