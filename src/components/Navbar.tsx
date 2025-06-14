import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';

const Navbar = () => {
  const location = useLocation();

  const links = [
    { to: '/', label: 'Home' },
    { to: '/learn', label: 'Learn' },
    { to: '/myvocabulary', label: 'My Vocabulary' },
    { to: '/profile', label: 'Profile' }
  ];

  return (
    <header className="fixed top-0 w-full z-50 bg-white/90 dark:bg-black/70 backdrop-blur-md shadow-md border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 py-3 sm:py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0">
        <h1 className="text-xl sm:text-2xl font-bold text-emerald-700 dark:text-emerald-400">LughatulQuran</h1>
        <div className="flex flex-wrap gap-2 sm:gap-4 text-sm font-medium items-center">
          {links.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              className={`px-2 sm:px-3 py-1 sm:py-2 rounded-md transition hover:text-emerald-600 dark:hover:text-emerald-400 ${
                location.pathname === to
                  ? 'text-emerald-700 dark:text-emerald-300'
                  : 'text-gray-700 dark:text-gray-300'
              }`}
            >
              {label}
            </Link>
          ))}
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
};

export default Navbar;