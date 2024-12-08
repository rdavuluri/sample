import React from 'react';
import { LogOut, Settings, Share2 } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

interface HeaderProps {
  onConfigClick: () => void;
  onShareGuideClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onConfigClick, onShareGuideClick }) => {
  const { user, logout } = useAuthStore();

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Tech Chat GPT</h1>
          <div className="flex items-center space-x-4">
            <button
              onClick={onShareGuideClick}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
            >
              <Share2 className="h-5 w-5" />
              <span>Share Guide</span>
            </button>
            <button
              onClick={onConfigClick}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
            >
              <Settings className="h-5 w-5" />
              <span>Model Settings</span>
            </button>
            <span className="text-gray-700">{user?.name}</span>
            <button
              onClick={logout}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
            >
              <LogOut className="h-5 w-5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
