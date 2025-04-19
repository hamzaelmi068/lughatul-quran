import { Moon, Sun } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function Navbar() {
  const [darkMode, setDarkMode] = useState(true);

  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  const toggleDarkMode = () => {
    document.documentElement.classList.toggle('dark');
    setDarkMode(!darkMode);
  };

  return (
    <nav className="flex justify-between items-center px-6 py-4 bg-background shadow-md">
      <h1 className="text-xl font-bold text-primary">
        <Link to="/">LughatulQuran</Link>
      </h1>
      <div className="flex items-center gap-6">
        <Link to="/learn" className="hover:text-primary">Learn</Link>
        <Link to="/review" className="hover:text-primary">Review</Link>
        <Link to="/profile" className="hover:text-primary">Profile</Link>
        <button onClick={toggleDarkMode} className="hover:text-yellow-500 transition">
          {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>
      </div>
    </nav>
  );
}
