import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { Book } from 'lucide-react';
import { supabase } from '../lib/supabaseClient'; // ✅ import Supabase client

export default function Auth() {
  const { signIn, signUp, signInAnonymously } = useAuth();
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<null | string>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      if (isLogin) {
        await signIn(email, password);
      } else {
        const { data, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
        });

        if (signUpError) throw signUpError;

        const userId = data.user?.id;
        if (userId) {
          // ✅ call initialization RPC
          const { error: rpcError } = await supabase.rpc('initialize_user_words', { new_user_id: userId });
          if (rpcError) throw rpcError;
        }
      }
      navigate('/');
    } catch (err: any) {
      setError(err.message || 'Authentication failed');
    }
  };

  const switchMode = () => {
    setIsLogin(!isLogin);
    setError(null);
  };

  const handleGuestLogin = async () => {
    try {
      await signInAnonymously();
      navigate('/');
    } catch (err: any) {
      setError('Failed to sign in as guest');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <motion.div 
        className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md"
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="text-center mb-6">
          <Book className="mx-auto mb-3 h-12 w-12 text-emerald-600" />
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
            {isLogin ? 'Welcome Back' : 'Create an Account'}
          </h2>
        </div>
        <form onSubmit={handleSubmit}>
          <input 
            type="email" 
            className="w-full mb-3 px-4 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-transparent text-gray-800 dark:text-gray-100" 
            placeholder="Email" 
            value={email} 
            onChange={e => setEmail(e.target.value)}
            required 
          />
          <input 
            type="password" 
            className="w-full mb-4 px-4 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-transparent text-gray-800 dark:text-gray-100" 
            placeholder="Password" 
            value={password} 
            onChange={e => setPassword(e.target.value)}
            required 
          />
          {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
          <button 
            type="submit" 
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-2 px-4 rounded-md font-semibold"
          >
            {isLogin ? 'Sign In' : 'Sign Up'}
          </button>
        </form>
        <div className="text-center mt-4">
          <button 
            onClick={handleGuestLogin} 
            className="text-sm text-emerald-600 hover:underline"
          >
            Continue as Guest
          </button>
        </div>
        <p className="mt-6 text-sm text-gray-700 dark:text-gray-300 text-center">
          {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
          <button onClick={switchMode} className="text-emerald-600 hover:underline font-semibold">
            {isLogin ? 'Sign up' : 'Sign in'}
          </button>
        </p>
      </motion.div>
    </div>
  );
}