import React, { useEffect } from 'react';
import { useApp } from '../contexts/AppContext';
import Header from '../components/Header';
import AdminCreateMeeting from '../components/AdminCreateMeeting';
import SearchBar from '../components/SearchBar';
import MeetingTabs from '../components/MeetingTabs';
import MeetingTable from '../components/MeetingTable';

const HomePage = () => {
  const { isAuthenticated, currentUser } = useApp();

  useEffect(() => {
    if (!isAuthenticated) {
      window.location.hash = '/login';
    }
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/20">
      <Header title="Phòng họp không giấy Đại học Bách khoa Hà Nội" />
      
      <div className="max-w-7xl mx-auto px-6 py-8">
        {currentUser?.role === 'admin' && (
          <div className="mb-6 animate-fade-in">
            <AdminCreateMeeting />
          </div>
        )}
        
        <div className="space-y-6">
          <div className="animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <SearchBar />
          </div>
          
          <div className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <MeetingTabs />
          </div>
          
          <div className="animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <MeetingTable />
          </div>
        </div>

        <div className="mt-12 text-center">
          <div className="inline-block bg-white/80 backdrop-blur-sm px-6 py-3 rounded-xl shadow-sm border border-gray-200">
            <p className="text-sm text-gray-600 font-medium">
              © 2026 Trường Công nghệ Thông tin và Truyền thông - Đại học Bách Khoa Hà Nội
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
