import React from 'react';
import { LogIn, LogOut, User, Settings } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { signOut } from '../services/authService';

interface UserMenuProps {
  onAuthClick: () => void;
  onProfileClick: () => void;
}

export function UserMenu({ onAuthClick, onProfileClick }: UserMenuProps) {
  const { user } = useAuth();

  return (
    <div className="fixed top-4 left-4 z-[100]">
      {user ? (
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-full bg-white dark:bg-gray-800 shadow-lg">
            <User className="w-5 h-5 text-gray-600 dark:text-gray-300" />
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-full shadow-lg py-1 px-3">
            <span className="text-sm text-gray-700 dark:text-gray-300">
              {user.displayName || 'Guest'}
            </span>
          </div>
          <button
            onClick={onProfileClick}
            className="p-2 rounded-full bg-white dark:bg-gray-800 shadow-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <Settings className="w-5 h-5 text-gray-600 dark:text-gray-300" />
          </button>
          <button
            onClick={() => signOut()}
            className="p-2 rounded-full bg-white dark:bg-gray-800 shadow-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <LogOut className="w-5 h-5 text-gray-600 dark:text-gray-300" />
          </button>
        </div>
      ) : (
        <button
          onClick={onAuthClick}
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-gray-800 shadow-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          <LogIn className="w-5 h-5 text-gray-600 dark:text-gray-300" />
          <span className="text-sm text-gray-700 dark:text-gray-300">Sign In</span>
        </button>
      )}
    </div>
  );
}