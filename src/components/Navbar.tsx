// src/components/Navbar.tsx
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, BookOpen, RotateCcw, User, Menu, X } from 'lucide-react';
import ThemeToggle from './ThemeToggle';

const Navbar = () => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Navigation links with icons for better visual clarity
  const links = [
    { to: '/', label: 'Home', icon: Home },
    { to: '/learn', label: 'Learn', icon: BookOpen },
    { to: '/review', label: 'Review', icon: RotateCcw },
    { to: '/profile', label: 'Profile', icon: User }
  ];

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  // Close mobile menu on escape key press
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsMobileMenuOpen(false);
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  return (
    <nav
      className="w-full py-4 px-4 sm:px-6 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md shadow-md border-b border-gray-200 dark:border-gray-700 fixed top-0 z-50"
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo - accessible heading */}
        <Link
          to="/"
          className="text-2xl sm:text-3xl font-bold text-emerald-700 dark:text-emerald-400 hover:text-emerald-800 dark:hover:text-emerald-300 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 rounded-md"
          aria-label="LughatulQuran home"
        >
          LughatulQuran
        </Link>

        {/* Desktop Navigation - Larger buttons for better accessibility */}
        <div className="hidden md:flex gap-2 items-center">
          {links.map(({ to, label, icon: Icon }) => {
            const isActive = location.pathname === to;
            return (
              <Link
                key={to}
                to={to}
                className={`flex items-center gap-2 px-4 py-3 rounded-lg text-base font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 ${
                  isActive
                    ? 'text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-900/30'
                    : 'text-gray-700 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
                aria-current={isActive ? 'page' : undefined}
                aria-label={`Navigate to ${label} page`}
              >
                <Icon className="w-5 h-5" aria-hidden="true" />
                <span>{label}</span>
              </Link>
            );
          })}
          <ThemeToggle />
        </div>

        {/* Mobile Menu Button - Larger touch target */}
        <div className="md:hidden flex items-center gap-3">
          <ThemeToggle />
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transition-colors"
            aria-expanded={isMobileMenuOpen}
            aria-label="Toggle mobile menu"
            aria-controls="mobile-menu"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" aria-hidden="true" />
            ) : (
              <Menu className="w-6 h-6" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Menu - Slide-in animation */}
      {isMobileMenuOpen && (
        <div
          id="mobile-menu"
          className="md:hidden mt-4 pb-4 border-t border-gray-200 dark:border-gray-700"
          role="menu"
          aria-label="Mobile navigation menu"
        >
          <div className="flex flex-col gap-2 mt-4">
            {links.map(({ to, label, icon: Icon }) => {
              const isActive = location.pathname === to;
              return (
                <Link
                  key={to}
                  to={to}
                  role="menuitem"
                  className={`flex items-center gap-3 px-4 py-4 rounded-lg text-base font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 ${
                    isActive
                      ? 'text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-900/30'
                      : 'text-gray-700 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                  aria-current={isActive ? 'page' : undefined}
                  tabIndex={0}
                >
                  <Icon className="w-6 h-6" aria-hidden="true" />
                  <span>{label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
