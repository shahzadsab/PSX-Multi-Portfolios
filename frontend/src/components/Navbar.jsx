import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Sun, Moon, LogOut, TrendingUp } from 'lucide-react';

export default function Navbar({ darkMode, setDarkMode }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 text-xl font-black text-blue-600">
          <TrendingUp size={28} />
          <span className="hidden sm:inline">PSX Demo</span>
        </Link>

        <div className="flex items-center gap-4">
          <button 
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          {user && (
            <div className="flex items-center gap-4 border-l pl-4 border-gray-200 dark:border-gray-700">
              <span className="text-sm font-medium hidden md:inline">{user.email}</span>
              <button 
                onClick={handleLogout}
                className="text-red-500 p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-colors"
                title="Logout"
              >
                <LogOut size={20} />
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}