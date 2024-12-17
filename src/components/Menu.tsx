import React, { useState } from 'react';
import { Menu as MenuIcon, Moon, Sun, X } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

export function Menu() {
  const [isOpen, setIsOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="fixed top-4 right-4 z-[100]">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-full bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-all duration-300"
      >
        {isOpen ? (
          <X className="w-6 h-6 text-gray-600 dark:text-gray-300" />
        ) : (
          <MenuIcon className="w-6 h-6 text-gray-600 dark:text-gray-300" />
        )}
      </button>

      {isOpen && (
        <div className="absolute top-14 right-0 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-xl p-2">
          <button
            onClick={() => {
              toggleTheme();
              setIsOpen(false);
            }}
            className="w-full flex items-center gap-2 px-4 py-2 text-left text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors duration-200"
          >
            {theme === 'light' ? (
              <>
                <Moon className="w-5 h-5" />
                <span>Dark Mode</span>
              </>
            ) : (
              <>
                <Sun className="w-5 h-5" />
                <span>Light Mode</span>
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}
