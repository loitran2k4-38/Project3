import { File } from 'lucide-react';
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { parseDmyToDate } from '../utils/dateUtils';
import { apiCall } from '../utils/api';

const AppContext = createContext(null);

export const AppProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [deviceStatus, setDeviceStatus] = useState('ready');
  const [currentMeeting, setCurrentMeeting] = useState(null);
  const [meetings, setMeetings] = useState([]);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [activeTab, setActiveTab] = useState('not_started');
  const [searchFilters, setSearchFilters] = useState({
    startDate: '04/11/2025',
    endDate: '31/12/2025',
    filterOption: 'all',
    searchText: ''
  });

  // Timer cho currentTime
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Save meetings to localStorage
  useEffect(() => {
    try {
      if (meetings.length > 0) {
        localStorage.setItem('meetings', JSON.stringify(meetings));
      }
    } catch {}
  }, [meetings]);

  //Wrap fetchMeetings với useCallback
  const fetchMeetings = useCallback(async () => {
    try {
      console.log('🔄 Fetching meetings...');
      const response = await apiCall('/Meetings', { method: 'GET' });
      const meetingsList = response.value || response || [];
      console.log('📥 Fetched meetings from API:', meetingsList.length, 'items');
      
      const convertedMeetings = meetingsList.map(m => {
        const startDate = new Date(m.startTime);
        const dayOfWeek = ['Chủ nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'][startDate.getDay()];
        return {
          id: m.meetingId,
          meetingId: m.meetingId,
          title: m.title,
          description: m.description || '',
          startTime: m.startTime,
          endTime: m.endTime,
          location: m.location || '',
          status: ['not_started', 'ongoing', 'completed', 'postponed'][m.status] || 'not_started',
          date: startDate.toLocaleDateString('vi-VN'),
          dayOfWeek: dayOfWeek,
          session: startDate.getHours() < 12 ? 'Buổi sáng' : 'Buổi chiều',
          time: startDate.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
          file_rev: m.file_rev || '',
        file_rev_url: m.file_rev_url || '',  // ← QUAN TRỌNG cho link download
        file_pre: m.file_pre || '',
        file_pre_url: m.file_pre_url || '',  // ← QUAN TRỌNG cho link download
          approved: m.status === 0,
        };
      });
      setMeetings(convertedMeetings);
    } catch (error) {
      console.error('❌ Lỗi tải cuộc họp:', error);
    }
  }, []); //

  //  chạy 1 lần khi app mount
  useEffect(() => {
  const token = localStorage.getItem('token');
  const savedUser = localStorage.getItem('currentUser');

  if (token && savedUser) {
    try {
      setCurrentUser(JSON.parse(savedUser));
      setIsAuthenticated(true);

      // GỌI fetchMeetings CHỈ 1 LẦN
      fetchMeetings();
    } catch (e) {
      logout();
    }
  }
}, []); //  <-- FIX QUAN TRỌNG


  // Hàm đăng nhập
  const login = async (username, password) => {
    try {
      const response = await apiCall('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ username, password })
      });
      
      localStorage.setItem('token', response.token);
      localStorage.setItem('refreshToken', response.refreshToken);
      
      const user = {
        username: response.username,
        role: response.role,
        fullName: response.fullName,
        userId: response.userId
      };
      localStorage.setItem('currentUser', JSON.stringify(user));
      
      setCurrentUser(user);
      setIsAuthenticated(true);
      
      // Fetch meetings sau khi login
      await fetchMeetings();
      
      return { success: true };
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('currentUser');
    setCurrentUser(null);
    setIsAuthenticated(false);
    setCurrentMeeting(null);
    setDeviceStatus('ready');
    setMeetings([]); //Clear meetings khi logout
  };

  const startMeeting = (meeting) => {
    setCurrentMeeting(meeting);
    setDeviceStatus('in_meeting');
  };

  const endMeeting = () => {
    setCurrentMeeting(null);
    setDeviceStatus('ready');
  };

  const createMeeting = async (payload) => {
    try {
      const [day, month, year] = payload.date.split('/').map(Number);
      const [hour, minute] = (payload.time || '08:00').split(':').map(Number);
      
      const startTime = new Date(year, month - 1, day, hour, minute);
      const endTime = new Date(year, month - 1, day, hour + 1, minute);
      
      const meetingData = {
        title: payload.title,
        description: payload.location || '',
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString(),
        location: payload.location || '',
        participants: payload.participants || []
      };
      
      const response = await apiCall('/meetings', {
        method: 'POST',
        body: JSON.stringify(meetingData)
      });
      
      await fetchMeetings();
      return { success: true, data: response };
    } catch (error) {
      console.error('Lỗi tạo cuộc họp:', error);
      return { success: false, error: error.message };
    }
  };

  const updateSearchFilters = (filters) => {
    setSearchFilters(prev => ({ ...prev, ...filters }));
  };

  //  Wrap getFilteredMeetings với useCallback
  const getFilteredMeetings = useCallback(() => {
    const start = parseDmyToDate(searchFilters.startDate);
    const end = parseDmyToDate(searchFilters.endDate);
    const endOfDay = end ? new Date(end.getFullYear(), end.getMonth(), end.getDate(), 23, 59, 59, 999) : null;

    return meetings.filter(meeting => {
      // Filter theo tab (status)
      if (activeTab !== 'all' && meeting.status !== activeTab) {
        return false;
      }
      
      // Filter theo approved/pending
      if (searchFilters.filterOption === 'approved' && !meeting.approved) {
        return false;
      }
      if (searchFilters.filterOption === 'pending' && meeting.approved) {
        return false;
      }
      
      // Filter theo ngày
      const mDate = parseDmyToDate(meeting.date);
      if (!mDate) return false;
      if (start && mDate < start) return false;
      if (endOfDay && mDate > endOfDay) return false;
      
      // Filter theo text search (tìm trong title, location, description)
      if (searchFilters.searchText && searchFilters.searchText.trim() !== '') {
        const searchLower = searchFilters.searchText.toLowerCase().trim();
        const titleMatch = meeting.title?.toLowerCase().includes(searchLower);
        const locationMatch = meeting.location?.toLowerCase().includes(searchLower);
        const descriptionMatch = meeting.description?.toLowerCase().includes(searchLower);
        
        if (!titleMatch && !locationMatch && !descriptionMatch) {
          return false;
        }
      }
      
      return true;
    });
  }, [meetings, activeTab, searchFilters]); // ✅ Dependencies

  const value = {
    isAuthenticated,
    currentUser,
    deviceStatus,
    currentMeeting,
    meetings,
    currentTime,
    activeTab,
    setActiveTab,
    searchFilters,
    updateSearchFilters,
    getFilteredMeetings,
    createMeeting,
    fetchMeetings,
    login,
    logout,
    startMeeting,
    endMeeting
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};