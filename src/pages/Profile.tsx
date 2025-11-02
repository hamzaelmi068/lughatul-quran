import React, { useMemo } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { BookOpen, Award, Flame, User as UserIcon, TrendingUp, Star, Trophy, Target } from 'lucide-react';
import { useWords } from '../hooks/useWords';
import { motion } from 'framer-motion';

function Profile() {
  const { user } = useAuth();
  const { userWords } = useWords();

  const learnedCount = userWords.length;
  const masteredCount = userWords.filter((uw) => uw.status === 'mastered').length;
  const learningCount = userWords.filter((uw) => uw.status === 'learning').length;
  
  // Calculate streak (simplified - in a real app, this would track daily activity)
  // For now, we'll use localStorage to track daily visits
  const streakCount = useMemo(() => {
    const storedStreak = localStorage.getItem('lughatulquran_streak');
    const lastVisitDate = localStorage.getItem('lughatulquran_last_visit');
    const today = new Date().toDateString();
    
    // If visited today, return current streak
    if (lastVisitDate === today && storedStreak) {
      return parseInt(storedStreak, 10);
    }
    
    // Calculate days difference
    if (lastVisitDate) {
      const lastVisit = new Date(lastVisitDate);
      const todayDate = new Date(today);
      const daysDiff = Math.floor((todayDate.getTime() - lastVisit.getTime()) / (1000 * 60 * 60 * 24));
      
      if (daysDiff === 1) {
        // Continue streak if visited yesterday
        const currentStreak = parseInt(storedStreak || '0', 10);
        const newStreak = currentStreak > 0 ? currentStreak + 1 : 1;
        localStorage.setItem('lughatulquran_streak', newStreak.toString());
        localStorage.setItem('lughatulquran_last_visit', today);
        return newStreak;
      } else if (daysDiff === 0) {
        // Same day, return existing streak
        return parseInt(storedStreak || '0', 10);
      } else {
        // Streak broken, start new
        localStorage.setItem('lughatulquran_streak', '1');
        localStorage.setItem('lughatulquran_last_visit', today);
        return 1;
      }
    } else {
      // First visit
      localStorage.setItem('lughatulquran_streak', '1');
      localStorage.setItem('lughatulquran_last_visit', today);
      return 1;
    }
  }, [userWords.length]); // Trigger when words change (user activity)

  // Enhanced stats with color coding and better icons
  const stats = [
    { 
      label: 'Words Learned', 
      value: learnedCount, 
      icon: BookOpen,
      color: 'emerald',
      description: 'Total words in your learning journey'
    },
    { 
      label: 'Words Mastered', 
      value: masteredCount, 
      icon: Award,
      color: 'amber',
      description: 'Words you\'ve completely mastered'
    },
    { 
      label: 'Currently Learning', 
      value: learningCount, 
      icon: TrendingUp,
      color: 'blue',
      description: 'Words you\'re actively studying'
    },
    { 
      label: 'Day Streak', 
      value: streakCount, 
      icon: Flame,
      color: 'orange',
      description: 'Consecutive days of learning'
    },
  ];

  // Achievement badges based on progress
  const achievements = useMemo(() => {
    const badges = [];
    
    if (learnedCount >= 10) badges.push({ 
      name: 'First Steps', 
      icon: Star, 
      color: 'blue',
      description: 'Learned 10 words'
    });
    if (learnedCount >= 50) badges.push({ 
      name: 'Scholar', 
      icon: BookOpen, 
      color: 'emerald',
      description: 'Learned 50 words'
    });
    if (masteredCount >= 25) badges.push({ 
      name: 'Master', 
      icon: Trophy, 
      color: 'amber',
      description: 'Mastered 25 words'
    });
    if (streakCount >= 7) badges.push({ 
      name: 'Week Warrior', 
      icon: Flame, 
      color: 'orange',
      description: '7-day streak!'
    });
    if (streakCount >= 30) badges.push({ 
      name: 'Month Champion', 
      icon: Target, 
      color: 'purple',
      description: '30-day streak!'
    });
    
    return badges;
  }, [learnedCount, masteredCount, streakCount]);

  // Get personalized greeting
  const getGreeting = () => {
    if (!user) return null;
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const greeting = getGreeting();
  const userName = user?.email?.split('@')[0] || 'Guest';

  return (
    <div className="min-h-screen pt-20 px-4 sm:px-6 pb-12 bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50 dark:from-gray-900 dark:via-gray-950 dark:to-black text-gray-900 dark:text-white transition-colors duration-500">
      <div className="max-w-6xl mx-auto">
        {/* Enhanced User Profile Card with improved shadows and padding */}
        <motion.div
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 sm:p-8 mb-8 border border-gray-200 dark:border-gray-700"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-lg">
                <UserIcon className="h-8 w-8 text-white" aria-hidden="true" />
              </div>
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-1">
                  {greeting ? `${greeting}, ${userName}!` : userName}
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {user?.email || 'Guest User'}
                </p>
              </div>
            </div>
            {streakCount > 0 && (
              <div className="flex items-center gap-2 px-4 py-2 bg-orange-100 dark:bg-orange-900/30 rounded-full border border-orange-300 dark:border-orange-700">
                <Flame className="h-5 w-5 text-orange-600 dark:text-orange-400" aria-hidden="true" />
                <span className="font-bold text-orange-700 dark:text-orange-300">{streakCount} day streak!</span>
              </div>
            )}
          </div>
          <p className="text-base text-gray-600 dark:text-gray-300 leading-relaxed">
            {user
              ? 'Here\'s your learning progress and achievements. Keep up the great work!'
              : 'You are logged in as a guest. Sign in to save your progress permanently.'}
          </p>
        </motion.div>

        {/* Enhanced Stats Grid with better shadows, padding, and icons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
          {stats.map(({ label, value, icon: Icon, color, description }, idx) => {
            const colorClasses = {
              emerald: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800',
              amber: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800',
              blue: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800',
              orange: 'bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-200 dark:border-orange-800',
            };
            
            return (
              <motion.div
                key={idx}
                className="bg-white dark:bg-gray-800 rounded-xl p-6 text-center shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-700 group"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                role="region"
                aria-label={label}
              >
                <div className={`w-12 h-12 rounded-xl ${colorClasses[color as keyof typeof colorClasses]} flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform border`}>
                  <Icon className="h-6 w-6" aria-hidden="true" />
                </div>
                <p className="text-4xl font-bold text-gray-900 dark:text-white mb-2">{value}</p>
                <p className="text-base font-semibold text-gray-700 dark:text-gray-300 mb-1">{label}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{description}</p>
              </motion.div>
            );
          })}
        </div>

        {/* Achievement Badges Section */}
        {achievements.length > 0 && (
          <motion.div
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 sm:p-8 border border-gray-200 dark:border-gray-700"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
              <Trophy className="h-6 w-6 text-amber-500" aria-hidden="true" />
              Your Achievements
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {achievements.map((badge, idx) => {
                const badgeColorClasses = {
                  blue: 'bg-blue-100 dark:bg-blue-900/30 border-blue-300 dark:border-blue-700 text-blue-700 dark:text-blue-300',
                  emerald: 'bg-emerald-100 dark:bg-emerald-900/30 border-emerald-300 dark:border-emerald-700 text-emerald-700 dark:text-emerald-300',
                  amber: 'bg-amber-100 dark:bg-amber-900/30 border-amber-300 dark:border-amber-700 text-amber-700 dark:text-amber-300',
                  orange: 'bg-orange-100 dark:bg-orange-900/30 border-orange-300 dark:border-orange-700 text-orange-700 dark:text-orange-300',
                  purple: 'bg-purple-100 dark:bg-purple-900/30 border-purple-300 dark:border-purple-700 text-purple-700 dark:text-purple-300',
                };
                
                return (
                  <motion.div
                    key={idx}
                    className={`flex items-center gap-4 p-4 rounded-xl border-2 ${badgeColorClasses[badge.color as keyof typeof badgeColorClasses]} shadow-md hover:shadow-lg transition-all group`}
                    whileHover={{ scale: 1.02 }}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 + idx * 0.1 }}
                  >
                    <div className="w-12 h-12 rounded-lg bg-white dark:bg-gray-800 flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                      <badge.icon className="h-6 w-6" aria-hidden="true" />
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-base">{badge.name}</p>
                      <p className="text-xs opacity-80">{badge.description}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

export default Profile;
