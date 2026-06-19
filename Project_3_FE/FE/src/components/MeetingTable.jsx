import React, { useState, useEffect } from 'react';
import { useApp } from '../contexts/AppContext';
import { Link, useNavigate } from 'react-router-dom';
import { FileText } from 'lucide-react';
import { apiCall } from '../utils/api';

const MeetingTable = () => {
  const { getFilteredMeetings, fetchMeetings, meetings, searchFilters, activeTab } = useApp();
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // const handleJoinMeeting = async (e, meetingId) => {
  //   e.preventDefault(); //  chặn Link tự điều hướng

  //   try {
  //     const token = localStorage.getItem("token");
  //     if (!token) throw new Error("Bạn chưa đăng nhập.");

  //     // GỌI API JOIN
  //     const joinInfo = await apiCall(`/Meetings/join/${meetingId}`, {
  //       method: "GET",
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //       }
  //     });

  //     // Lưu joinInfo
  //     sessionStorage.setItem(`joinInfo_${meetingId}`, JSON.stringify(joinInfo));

  //     // Điều hướng thủ công
  //     navigate(`/meeting/${meetingId}`, {
  //       state: { joinInfo }
  //     });

  //   } catch (err) {
  //     console.error(err);
  //     alert(err.message || "Không thể tham gia cuộc họp.");
  //   }
  // };

  // Tải dữ liệu cuộc họp khi component mount
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      await fetchMeetings();
      setIsLoading(false);
    };
    loadData();
  }, []);

  // Lấy danh sách cuộc họp đã lọc
  const filteredMeetings = getFilteredMeetings();

  // // Debug log
  // useEffect(() => {
  //   console.log('Dữ liệu cuộc họp:', filteredMeetings.length, 'item(s)');
  //   console.log('Chi tiết:', filteredMeetings);
  // }, [filteredMeetings.length]);

  const getStatusBadge = (meeting) => {
    if (meeting.approved) {
      return (
        <span className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 text-xs font-bold rounded-xl border-2 border-green-300 shadow-sm">
          <span className="w-2 h-2 bg-green-500 rounded-full"></span>
          ĐÃ HỌP
        </span>
      );
    }

    return (
      <button
        onClick={() => navigate(`/meeting/${meeting.id}/prejoin`)}
        className="group/btn inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white text-xs font-bold rounded-xl transition-all duration-300 shadow-md hover:shadow-xl transform hover:scale-110"
      >
        <span className="group-hover/btn:animate-pulse">▶</span>
        <span>Tham gia</span>
      </button>
    );
  };

  if (isLoading) {
    return (
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200 p-12 text-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-600 font-medium">Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  if (!filteredMeetings || filteredMeetings.length === 0) {
    return (
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200 p-12 text-center">
        <div className="max-w-md mx-auto">
          <div className="w-20 h-20 bg-gradient-to-br from-red-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-4xl">📅</span>
          </div>
          <p className="text-gray-700 font-semibold text-lg mb-2">Không có cuộc họp nào</p>
          <p className="text-gray-500 text-sm">
            Không tìm thấy cuộc họp trong khoảng thời gian này
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gradient-to-r from-gray-100 via-blue-50 to-purple-50 border-b-2 border-gray-300">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Ngày</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Thời gian</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Giờ</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Nội dung</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Địa điểm</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Tài liệu</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Trạng thái</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredMeetings.map((meeting, index) => (
              <tr
                key={meeting.id}
                className="group hover:bg-gradient-to-r hover:from-blue-50 hover:via-purple-50/30 hover:to-pink-50/30 transition-all duration-300 cursor-pointer hover:shadow-md"
                onClick={() => navigate(`/meeting/${meeting.id}/prejoin`)}
              >
                <td className="px-6 py-5 text-sm">
                  <div className="font-semibold text-gray-900">{meeting.dayOfWeek}</div>
                  <div className="text-gray-600 mt-1">{meeting.date}</div>
                </td>
                <td className="px-6 py-5 text-sm">
                  <span className="inline-flex items-center px-3 py-1.5 rounded-lg bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-800 font-medium border border-blue-200">
                    {meeting.session}
                  </span>
                </td>
                <td className="px-6 py-5 text-sm">
                  <span className="font-bold text-red-600 text-base">{meeting.time}</span>
                </td>
                <td className="px-6 py-5 text-sm">
                  <div className="font-medium text-gray-900 group-hover:text-blue-700 transition-colors">
                    {meeting.title}
                  </div>
                </td>
                <td className="px-6 py-5 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-400">📍</span>
                    {meeting.location}
                  </div>
                </td>
                <td className="px-6 py-5 text-sm" onClick={(e) => e.stopPropagation()}>
                  <Link
                    to={`/meeting/${meeting.id}/documents`}
                    className="group/link inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white rounded-xl transition-all duration-300 font-semibold shadow-md hover:shadow-lg hover:scale-105"
                  >
                    <FileText size={18} className="group-hover/link:rotate-12 transition-transform" />
                    <span>Xem tài liệu</span>
                  </Link>
                </td>
                <td className="px-6 py-5">
                  {getStatusBadge(meeting)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MeetingTable;