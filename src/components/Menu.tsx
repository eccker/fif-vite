import React, { useState } from 'react';
import { Menu as MenuIcon, Moon, Sun, X, History, User, LogOut, Settings } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { ScoreHistoryModal } from './ScoreHistoryModal';
import { LogoutConfirmModal } from './LogoutConfirmModal';
import { useAuth } from '../contexts/AuthContext';
import { signOut } from '../services/authService';
import { useNavigate } from 'react-router-dom';

interface MenuProps {
  onProfileClick: () => void;
}

export function Menu({ onProfileClick }: MenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { user } = useAuth();

  const handleLogout = async () => {
    await signOut();
    setShowLogoutConfirm(false);
    setIsOpen(false);
  };

  const handleProfileClick = () => {
    onProfileClick();
    setIsOpen(false);
  };

  return (
    <div className="fixed top-4 right-4 z-[100]">
      <ScoreHistoryModal isOpen={showHistory} onClose={() => setShowHistory(false)} />
      <LogoutConfirmModal 
        isOpen={showLogoutConfirm} 
        onClose={() => setShowLogoutConfirm(false)} 
        onConfirm={handleLogout}
      />
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
          {user && (
            <>
              <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700 mb-2">
                <div className="flex items-center gap-2">
                  <User className="w-5 h-5 text-gray-400" />
                  <span className="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {user.displayName || 'Guest'}
                  </span>
                </div>
              </div>
              <button
                onClick={() => {
                  setShowHistory(true);
                  setIsOpen(false);
                }}
                className="w-full flex items-center gap-2 px-4 py-2 text-left text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors duration-200"
              >
                <History className="w-5 h-5" />
                <span>Score History</span>
              </button>
              <button
                onClick={handleProfileClick}
                className="w-full flex items-center gap-2 px-4 py-2 text-left text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors duration-200"
              >
                <Settings className="w-5 h-5" />
                <span>Profile Settings</span>
              </button>
            </>
          )}
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
          {user && (
            <button
              onClick={() => {
                setShowLogoutConfirm(true);
                setIsOpen(false);
              }}
              className="w-full flex items-center gap-2 px-4 py-2 text-left text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors duration-200 mt-2"
            >
              <LogOut className="w-5 h-5" />
              <span>Log Out</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
}
