import React from 'react';
import { BookOpen, Repeat, TrendingUp, Sparkles, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { useWords } from '../hooks/useWords';

const Home = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { userWords } = useWords();

  // Calculate user stats for personalized welcome
  const learnedCount = userWords.length;
  const masteredCount = userWords.filter((uw) => uw.status === 'mastered').length;

  // Feature cards with enhanced descriptions and icons
  // Using explicit Tailwind classes for colors (Tailwind JIT requires full class names)
  const features = [
    {
      title: 'Comprehensive Vocabulary',
      description: 'Study essential Quranic words with meaning, root, and ayah reference. Expand your understanding of the Holy Quran word by word.',
      icon: BookOpen,
      iconBgClass: 'bg-emerald-500/20',
      iconColorClass: 'text-emerald-300',
      glowClass: 'bg-emerald-500/10',
      onClick: () => navigate('/learn')
    },
    {
      title: 'Spaced Repetition',
      description: 'An Anki-style method to enhance long-term recall of Arabic terms. Master vocabulary through scientifically-backed learning intervals.',
      icon: Repeat,
      iconBgClass: 'bg-amber-500/20',
      iconColorClass: 'text-amber-300',
      glowClass: 'bg-amber-500/10',
      onClick: () => navigate('/review')
    },
    {
      title: 'Track Your Progress',
      description: 'Monitor learned words and your Quranic Arabic growth journey. Visualize your achievements and stay motivated.',
      icon: TrendingUp,
      iconBgClass: 'bg-blue-500/20',
      iconColorClass: 'text-blue-300',
      glowClass: 'bg-blue-500/10',
      onClick: () => navigate('/profile')
    }
  ];

  // Get personalized greeting based on time and user status
  const getPersonalizedGreeting = () => {
    if (!user) return null;
    
    const hour = new Date().getHours();
    let timeGreeting = 'Welcome back';
    if (hour < 12) timeGreeting = 'Good morning';
    else if (hour < 18) timeGreeting = 'Good afternoon';
    else timeGreeting = 'Good evening';

    const emailName = user.email?.split('@')[0] || 'Learner';
    return `${timeGreeting}, ${emailName}!`;
  };

  return (
    <main className="min-h-screen w-full px-4 sm:px-6 pt-32 pb-20 relative overflow-hidden">
      {/* Enhanced background with animated gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-950 via-gray-900 to-black dark:from-emerald-950 dark:via-gray-900 dark:to-black">
        {/* Subtle animated background elements for visual interest */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            className="absolute top-20 left-10 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl"
            animate={{
              x: [0, 100, 0],
              y: [0, 50, 0],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.div
            className="absolute bottom-20 right-10 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl"
            animate={{
              x: [0, -80, 0],
              y: [0, -60, 0],
            }}
            transition={{
              duration: 25,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Personalized Welcome Section for logged-in users */}
        {user && (
          <motion.div
            className="mb-8 text-center"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-500/20 dark:bg-emerald-500/30 backdrop-blur-md rounded-full border border-emerald-500/30 shadow-lg">
              <Sparkles className="w-5 h-5 text-emerald-300" aria-hidden="true" />
              <h2 className="text-xl sm:text-2xl font-bold text-emerald-300">
                {getPersonalizedGreeting()}
              </h2>
            </div>
            {/* Quick stats preview */}
            {(learnedCount > 0 || masteredCount > 0) && (
              <motion.div
                className="mt-4 flex justify-center gap-4 flex-wrap"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                {learnedCount > 0 && (
                  <div className="px-4 py-2 bg-white/10 dark:bg-white/5 backdrop-blur-sm rounded-lg border border-white/20">
                    <span className="text-emerald-300 font-semibold">{learnedCount}</span>
                    <span className="text-gray-300 ml-2">Words Learned</span>
                  </div>
                )}
                {masteredCount > 0 && (
                  <div className="px-4 py-2 bg-white/10 dark:bg-white/5 backdrop-blur-sm rounded-lg border border-white/20">
                    <span className="text-amber-300 font-semibold">{masteredCount}</span>
                    <span className="text-gray-300 ml-2">Mastered</span>
                  </div>
                )}
              </motion.div>
            )}
          </motion.div>
        )}

        {/* Main Hero Section */}
        <div className="text-center mb-16">
          <motion.h1
            className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-wide text-emerald-300 mb-4 drop-shadow-lg"
            initial={{ opacity: 0, y: -40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            لُغَةُ القُرْآنِ
          </motion.h1>

          <motion.p
            className="mt-4 text-lg sm:text-xl md:text-2xl text-amber-200 dark:text-amber-300 max-w-2xl mx-auto font-medium leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            Learn Quranic Arabic through personalized spaced repetition
          </motion.p>

          {/* Enhanced CTA Button - Bold and prominent */}
          <motion.div
            className="mt-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <motion.button
              onClick={() => navigate(user ? '/learn' : '/auth')}
              className="group relative px-8 py-4 sm:px-10 sm:py-5 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-bold text-lg sm:text-xl shadow-2xl transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-emerald-500/50 focus:ring-offset-4 focus:ring-offset-gray-900"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.98 }}
              aria-label="Get started with LughatulQuran"
            >
              <span className="flex items-center gap-2">
                Get Started
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
              </span>
              {/* Subtle glow effect */}
              <div className="absolute inset-0 rounded-xl bg-emerald-400/30 blur-xl -z-10 group-hover:bg-emerald-400/50 transition-colors" />
            </motion.button>
            
            {/* Secondary action for logged-in users */}
            {user && (
              <motion.button
                onClick={() => navigate('/review')}
                className="mt-4 px-6 py-3 rounded-lg bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-gray-900"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                aria-label="Continue your review session"
              >
                Continue Review
              </motion.button>
            )}
          </motion.div>
        </div>

        {/* Enhanced Feature Cards with better shadows, padding, and headings */}
        <motion.div
          className="grid gap-6 sm:gap-8 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.2 } }
          }}
        >
          {features.map((f, index) => (
            <motion.div
              key={f.title}
              onClick={f.onClick}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  f.onClick();
                }
              }}
              className="group relative bg-white/10 dark:bg-white/5 hover:bg-white/20 dark:hover:bg-white/10 backdrop-blur-md border border-white/20 dark:border-white/10 rounded-2xl p-8 cursor-pointer shadow-xl hover:shadow-2xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-gray-900"
              whileHover={{ scale: 1.03, y: -5 }}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              tabIndex={0}
              role="button"
              aria-label={`Learn more about ${f.title}`}
            >
              {/* Icon with color-coded background */}
              <div className={`w-14 h-14 rounded-xl ${f.iconBgClass} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                <f.icon className={`w-7 h-7 ${f.iconColorClass}`} aria-hidden="true" />
              </div>
              
              {/* Enhanced heading */}
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 group-hover:text-emerald-300 transition-colors">
                {f.title}
              </h3>
              
              {/* Enhanced description */}
              <p className="text-sm sm:text-base text-gray-300 dark:text-gray-400 leading-relaxed mb-4">
                {f.description}
              </p>

              {/* Subtle arrow indicator */}
              <div className="flex items-center text-emerald-300 opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-sm font-medium">Learn more</span>
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
              </div>

              {/* Hover glow effect */}
              <div className={`absolute inset-0 rounded-2xl ${f.glowClass} blur-xl opacity-0 group-hover:opacity-100 transition-opacity -z-10`} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </main>
  );
};

export default Home;

