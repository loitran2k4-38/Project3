import React from 'react';
import { User, LogOut } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { formatTime } from '../utils/dateUtils';

const Header = ({ title, showBackButton = false }) => {
  const { currentTime, currentUser, logout } = useApp();

  const handleLogout = () => {
    logout();
    window.location.hash = '/login';
  };

  const handleBack = () => {
    window.location.hash = '/';
  };

  return (
    <div className="bg-gradient-to-r from-red-600 via-red-700 to-pink-600 text-white shadow-2xl border-b border-red-800/20">
      <div className="flex justify-between items-center max-w-7xl mx-auto px-6 py-5">
        <div className="flex items-center gap-4">
          {showBackButton && (
            <button
              onClick={handleBack}
              className="group flex items-center gap-2 bg-white/10 backdrop-blur-sm hover:bg-white/20 px-5 py-2.5 rounded-xl transition-all duration-300 hover:scale-105 border border-white/20"
            >
              <span className="text-lg group-hover:-translate-x-1 transition-transform duration-300">←</span>
              <span className="font-semibold">Quay Lại</span>
            </button>
          )}
          <div className="flex flex-col">
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight drop-shadow-lg">{title}</h1>
            <div className="h-1 w-20 bg-gradient-to-r from-white to-transparent rounded-full mt-1"></div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-xl border border-white/20">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium">{formatTime(currentTime)}</span>
          </div>
          {currentUser && (
            <>
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2.5 rounded-xl border border-white/20 hover:bg-white/15 transition-all duration-300">
                <div className="w-8 h-8 bg-gradient-to-br from-white/30 to-white/10 rounded-lg flex items-center justify-center">
                  <User className="w-4 h-4" />
                </div>
                <span className="text-sm font-semibold hidden md:block">{currentUser.fullName}</span>
              </div>
              <button
                onClick={handleLogout}
                className="group bg-white/10 backdrop-blur-sm hover:bg-red-500 p-2.5 rounded-xl transition-all duration-300 border border-white/20 hover:scale-105 hover:rotate-3"
                title="Đăng xuất"
              >
                <LogOut className="w-4 h-4 group-hover:animate-pulse" />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Header;