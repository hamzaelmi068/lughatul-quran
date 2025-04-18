import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Book, Lightbulb, Search } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

function Home() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleGetStarted = () => {
    if (user) {
      navigate('/learn');
    } else {
      navigate('/auth');
    }
  };

  return (
    <div className="bg-gray-100 dark:bg-gray-900 -mt-8 -mx-4">
      {/* Hero Section */}
      <div
        className="relative py-24 bg-cover bg-center"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1617196009934-955f9844980e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2560&q=80')" }}
      >
        <div className="absolute inset-0 bg-gray-900 opacity-60"></div>
        <div className="container mx-auto px-4 text-center relative">
          <h1 className="text-5xl font-bold text-white mb-4 font-arabic">
            LughatulQuran
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Embark on a journey to understand the Quran in its original language. Our interactive platform makes learning Quranic Arabic engaging and effective.
          </p>
          <button
            onClick={handleGetStarted}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-8 rounded-full transition duration-300"
          >
            Get Started
          </button>
        </div>
      </div>

      {/* Key Features Section */}
      <div className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-12">
          Why Choose LughatulQuran?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 text-center transform hover:scale-105 transition duration-300">
            <Book className="h-12 w-12 text-emerald-600 mx-auto mb-6" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Structured Learning
            </h3>
            <p className="text-gray-700 dark:text-gray-300">
              Progressive lessons designed to build your understanding from basics to advanced concepts.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 text-center transform hover:scale-105 transition duration-300">
            <Lightbulb className="h-12 w-12 text-emerald-600 mx-auto mb-6" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Interactive Practice
            </h3>
            <p className="text-gray-700 dark:text-gray-300">
              Engage with interactive exercises and receive immediate feedback on your progress.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 text-center transform hover:scale-105 transition duration-300">
            <Search className="h-12 w-12 text-emerald-600 mx-auto mb-6" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Smart Review System
            </h3>
            <p className="text-gray-700 dark:text-gray-300">
              Our spaced repetition system ensures optimal retention of what you've learned.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;