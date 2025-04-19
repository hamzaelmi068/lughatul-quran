import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

const Navbar = () => {
  const router = useRouter();
  const links = [
    { href: '/', label: 'Home' },
    { href: '/learn', label: 'Learn' },
    { href: '/review', label: 'Review' },
    { href: '/profile', label: 'Profile' }
  ];

  return (
    <nav className="w-full py-4 px-6 bg-white/90 dark:bg-black/70 backdrop-blur-md shadow-md border-b border-gray-200 dark:border-gray-700 fixed top-0 z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold text-emerald-700 dark:text-emerald-400">LughatulQuran</h1>
        <div className="flex gap-4 text-sm font-medium">
          {links.map(({ href, label }) => (
            <Link key={href} href={href} legacyBehavior>
              <a
                className={`px-3 py-2 rounded-md transition hover:text-emerald-600 dark:hover:text-emerald-400 ${
                  router.pathname === href
                    ? 'text-emerald-700 dark:text-emerald-300'
                    : 'text-gray-700 dark:text-gray-300'
                }`}
              >
                {label}
              </a>
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

