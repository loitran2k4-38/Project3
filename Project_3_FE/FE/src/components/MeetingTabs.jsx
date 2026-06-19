import React from 'react';
import { Clock, PlayCircle, PauseCircle, CheckCircle } from 'lucide-react';
import { useApp } from '../contexts/AppContext';

const MeetingTabs = () => {
  const { activeTab, setActiveTab } = useApp();

  const tabs = [
    { 
      key: 'not_started', 
      label: 'CHƯA DIỄN RA', 
      icon: Clock,
      activeColor: 'from-red-500 to-pink-500',
      bgColor: 'bg-gradient-to-br from-red-50 to-pink-50',
      borderColor: 'border-red-500',
      textColor: 'text-red-700'
    },
    { 
      key: 'ongoing', 
      label: 'ĐANG DIỄN RA', 
      icon: PlayCircle,
      activeColor: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-gradient-to-br from-blue-50 to-cyan-50',
      borderColor: 'border-blue-500',
      textColor: 'text-blue-700'
    },
    { 
      key: 'postponed', 
      label: 'BỊ HOÃN', 
      icon: PauseCircle,
      activeColor: 'from-orange-500 to-amber-500',
      bgColor: 'bg-gradient-to-br from-orange-50 to-amber-50',
      borderColor: 'border-orange-500',
      textColor: 'text-orange-700'
    },
    { 
      key: 'completed', 
      label: 'KẾT THÚC', 
      icon: CheckCircle,
      activeColor: 'from-green-500 to-emerald-500',
      bgColor: 'bg-gradient-to-br from-green-50 to-emerald-50',
      borderColor: 'border-green-500',
      textColor: 'text-green-700'
    }
  ];

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200 overflow-hidden hover:shadow-2xl transition-all duration-300">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-0">
        {tabs.map((tab, index) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;
          
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`
                relative px-4 py-5 font-bold text-xs md:text-sm transition-all duration-300
                ${isActive 
                  ? `bg-gradient-to-r ${tab.activeColor} text-white shadow-lg scale-105 z-10` 
                  : `text-gray-600 hover:${tab.bgColor} hover:scale-102`
                }
                ${index !== tabs.length - 1 ? 'border-r border-gray-200' : ''}
              `}
            >
              <div className="flex flex-col items-center gap-2">
                <Icon className={`w-5 h-5 ${isActive ? 'animate-pulse' : ''}`} />
                <span className="tracking-wide">{tab.label}</span>
                {isActive && (
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/50 rounded-full"></div>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default MeetingTabs;