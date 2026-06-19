import React from 'react';
import { Search, Calendar, Filter, X } from 'lucide-react';
import { useApp } from '../contexts/AppContext';

const SearchBar = () => {
  const { searchFilters, updateSearchFilters } = useApp();

  const handleClearSearch = () => {
    updateSearchFilters({ searchText: '' });
  };

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200 p-6 hover:shadow-2xl transition-all duration-300">
      {/* Search Text - Full Width Row */}
      <div className="mb-5">
        <label className="text-xs font-semibold text-gray-600 mb-2 block uppercase tracking-wide">
          Tìm kiếm cuộc họp
        </label>
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-hover:text-red-500 transition-colors" />
          <input
            type="text"
            value={searchFilters.searchText}
            onChange={(e) => updateSearchFilters({ searchText: e.target.value })}
            className="w-full pl-12 pr-12 py-4 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-200 transition-all hover:border-gray-400 text-base"
            placeholder="Nhập tên cuộc họp, địa điểm hoặc nội dung..."
          />
          {searchFilters.searchText && (
            <button
              onClick={handleClearSearch}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center rounded-full bg-gray-200 hover:bg-red-500 hover:text-white transition-all duration-300 group/clear"
              title="Xóa tìm kiếm"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
        {searchFilters.searchText && (
          <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
            <span className="inline-block w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            Đang tìm kiếm: <span className="font-semibold text-red-600">"{searchFilters.searchText}"</span>
          </p>
        )}
      </div>

      {/* Date and Filter Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="group">
          <label className="text-xs font-semibold text-gray-600 mb-2 block uppercase tracking-wide">Từ ngày</label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-hover:text-red-500 transition-colors" />
            <input
              type="text"
              value={searchFilters.startDate}
              onChange={(e) => updateSearchFilters({ startDate: e.target.value })}
              className="w-full pl-11 pr-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-200 transition-all hover:border-gray-400"
              placeholder="dd/MM/yyyy"
            />
          </div>
        </div>
        <div className="group">
          <label className="text-xs font-semibold text-gray-600 mb-2 block uppercase tracking-wide">Đến ngày</label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-hover:text-red-500 transition-colors" />
            <input
              type="text"
              value={searchFilters.endDate}
              onChange={(e) => updateSearchFilters({ endDate: e.target.value })}
              className="w-full pl-11 pr-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-200 transition-all hover:border-gray-400"
              placeholder="dd/MM/yyyy"
            />
          </div>
        </div>
        <div className="group">
          <label className="text-xs font-semibold text-gray-600 mb-2 block uppercase tracking-wide">Lọc theo</label>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-hover:text-red-500 transition-colors" />
            <select
              value={searchFilters.filterOption}
              onChange={(e) => updateSearchFilters({ filterOption: e.target.value })}
              className="w-full pl-11 pr-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-200 transition-all hover:border-gray-400 appearance-none bg-white cursor-pointer"
            >
              <option value="all">Tất cả</option>
              <option value="approved">Đã duyệt</option>
              <option value="pending">Chờ duyệt</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchBar;