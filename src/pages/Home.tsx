import React from 'react';
import { BookOpen, Repeat, Search } from 'lucide-react';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';

const Home = () => {
  const router = useRouter();

  const features = [
    {
      title: 'Comprehensive Vocabulary',
      description: 'Study essential Quranic words with meanings and context.',
      icon: BookOpen,
      onClick: () => router.push('/learn')
    },
    {
      title: 'Spaced Repetition',
      description: 'Proven technique to enhance retention and recall over time.',
      icon: Repeat,
      onClick: () => router.push('/review')
    },
    {
      title: 'Track Your Progress',
      description: 'Review learned words and monitor your journey to mastery.',
      icon: Search,
      onClick: () => router.push('/profile')
    }
  ];

  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-4 bg-[#fdfaf3] text-gray-900 dark:bg-gradient-to-br dark:from-[#0f1c14] dark:to-black dark:text-white transition-colors duration-500">
      <motion.h1
        className="text-4xl md:text-5xl font-extrabold mb-4 text-center text-emerald-700 dark:text-emerald-300"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        لُغَةُ القُرْآنِ
      </motion.h1>

      <motion.p
        className="mb-6 text-lg text-center text-amber-700 dark:text-amber-400"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.6 }}
      >
        Learn Quranic Arabic through spaced repetition
      </motion.p>

      <motion.button
        onClick={() => router.push('/learn')}
        className="px-6 py-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold shadow-md transition-all"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.97 }}
      >
        Get Started
      </motion.button>

      <motion.div
        className="mt-12 grid gap-6 sm:grid-cols-2 md:grid-cols-3 w-full max-w-5xl"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {},
          visible: {
            transition: {
              staggerChildren: 0.2
            }
          }
        }}
      >
        {features.map((feature) => (
          <motion.div
            key={feature.title}
            onClick={feature.onClick}
            className="bg-white/80 dark:bg-white/5 rounded-2xl p-6 cursor-pointer shadow hover:shadow-lg backdrop-blur-md border dark:border-gray-700 transition-all"
            whileHover={{ scale: 1.03 }}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <feature.icon className="w-7 h-7 text-emerald-600 dark:text-emerald-400 mb-3" />
            <h3 className="font-bold text-lg text-gray-800 dark:text-white mb-1">
              {feature.title}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {feature.description}
            </p>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default Home;
