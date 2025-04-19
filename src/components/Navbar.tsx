import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Book, Moon, Sun, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export default function Navbar() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = React.useState(false);

  const toggleDarkMode = () => {
    setDarkMode(prev => !prev);
    document.documentElement.classList.toggle('dark', !darkMode);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
  };

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-lg transition-colors duration-300">
      <div className="container mx-auto px-4 flex justify-between items-center h-16">
        {/* Brand / Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <Book className="w-6 h-6 text-emerald-600" />
          <span className="text-xl font-bold text-gray-800 dark:text-gray-100">LughatulQuran</span>
        </Link>
        {/* Right side icons */}
        <div className="flex items-center space-x-4">
          {/* Dark mode toggle */}
          <button onClick={toggleDarkMode} aria-label="Toggle dark mode">
            {darkMode ? (
              <Sun className="h-5 w-5 text-gray-600 dark:text-gray-400 transition-colors" />
            ) : (
              <Moon className="h-5 w-5 text-gray-600 dark:text-gray-400 transition-colors" />
            )}
          </button>
          {/* Logout (only if logged in) */}
          {user && (
            <button onClick={handleSignOut} aria-label="Sign out">
              <LogOut className="h-6 w-6 text-gray-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-500 transition-colors" />
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
