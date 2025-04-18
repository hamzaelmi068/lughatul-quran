import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Book, Moon, Sun, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export default function Navbar() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = React.useState(false);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark');
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
  };

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <Book className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
            <span className="text-xl font-bold text-gray-900 dark:text-white">LughatulQuran</span>
          </Link>

          <div className="flex items-center space-x-4">
            {user && (
              <>
                <Link to="/learn" className="text-gray-700 dark:text-gray-200 hover:text-emerald-600 dark:hover:text-emerald-400">
                  Learn
                </Link>
                <Link to="/review" className="text-gray-700 dark:text-gray-200 hover:text-emerald-600 dark:hover:text-emerald-400">
                  Review
                </Link>
                <Link to="/profile" className="text-gray-700 dark:text-gray-200 hover:text-emerald-600 dark:hover:text-emerald-400">
                  Profile
                </Link>
              </>
            )}
            
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              {darkMode ? (
                <Sun className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              ) : (
                <Moon className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              )}
            </button>

            {user && (
              <button
                onClick={handleSignOut}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <LogOut className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}