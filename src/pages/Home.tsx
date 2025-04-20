import React from 'react';
import { BookOpen, Repeat, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const Home = () => {
  const navigate = useNavigate();

  const features = [
    {
      title: 'Comprehensive Vocabulary',
      description: 'Study essential Quranic words with meaning, root, and ayah reference.',
      icon: BookOpen,
      onClick: () => navigate('/learn')
    },
    {
      title: 'Spaced Repetition',
      description: 'An Anki-style method to enhance long-term recall of Arabic terms.',
      icon: Repeat,
      onClick: () => navigate('/review')
    },
    {
      title: 'Track Your Progress',
      description: 'Monitor learned words and your Quranic Arabic growth journey.',
      icon: Search,
      onClick: () => navigate('/profile')
    }
  ];

  return (
    <main className="min-h-screen w-full px-6 pt-32 pb-20 bg-gradient-to-br from-[#0f1c14] via-[#111c1b] to-black text-white transition-all duration-500">
      <div className="text-center mb-12">
        <motion.h1
          className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-wide text-emerald-300"
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          لُغَةُ القُرْآنِ
        </motion.h1>

        <motion.p
          className="mt-4 text-lg md:text-xl text-amber-300 max-w-xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          Learn Quranic Arabic through personalized spaced repetition
        </motion.p>

        <motion.button
          onClick={() => navigate('/learn')}
          className="mt-6 px-6 py-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-medium shadow-lg transition-all"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Get Started
        </motion.button>
      </div>

      <motion.div
        className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 max-w-6xl mx-auto"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {},
          visible: { transition: { staggerChildren: 0.2 } }
        }}
      >
        {features.map((f) => (
          <motion.div
            key={f.title}
            onClick={f.onClick}
            className="bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 rounded-2xl p-6 cursor-pointer shadow-lg transition-all"
            whileHover={{ scale: 1.03 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <f.icon className="w-7 h-7 text-emerald-300 mb-3" />
            <h3 className="text-lg font-semibold text-white mb-1">{f.title}</h3>
            <p className="text-sm text-gray-300">{f.description}</p>
          </motion.div>
        ))}
      </motion.div>
    </main>
  );
};

export default Home;

