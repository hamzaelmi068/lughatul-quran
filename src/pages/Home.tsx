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
    <div className="bg-gray-100 dark:bg-gray-900">
      {/* Hero Section */}
      <div 
        className="relative py-24 bg-cover bg-center text-white text-center" 
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1617196009934-955f9844980e?auto=format&fit=crop&w=2560&q=80')" }}
      >
        <div className="absolute inset-0 bg-gray-900 opacity-60"></div>
        <div className="relative container mx-auto px-4">
          <h1 className="text-5xl font-bold mb-6 font-arabic">لُغَةُ الْقُرْآنِ</h1>
          <p className="text-xl mb-8">Learn Quranic Arabic through spaced repetition</p>
          <button 
            onClick={handleGetStarted}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 px-6 rounded-lg text-lg shadow-lg"
          >
            {user ? 'Continue Learning' : 'Get Started'}
          </button>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-6xl mx-auto px-4 py-16 grid grid-cols-1 md:grid-cols-3 gap-8 text-gray-800 dark:text-gray-200">
        <div className="flex flex-col items-center text-center">
          <Book className="h-12 w-12 text-emerald-600 mb-4" />
          <h3 className="text-2xl font-semibold mb-2">Comprehensive Vocabulary</h3>
          <p>Study essential Quranic words with meanings and context.</p>
        </div>
        <div className="flex flex-col items-center text-center">
          <Lightbulb className="h-12 w-12 text-emerald-600 mb-4" />
          <h3 className="text-2xl font-semibold mb-2">Spaced Repetition</h3>
          <p>Proven technique to enhance retention and recall over time.</p>
        </div>
        <div className="flex flex-col items-center text-center">
          <Search className="h-12 w-12 text-emerald-600 mb-4" />
          <h3 className="text-2xl font-semibold mb-2">Track Your Progress</h3>
          <p>Review learned words and monitor your journey to mastery.</p>
        </div>
      </div>
    </div>
  );
}

export default Home;
