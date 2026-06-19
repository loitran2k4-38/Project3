import React, { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { dayOfWeekViFromDmy } from '../utils/dateUtils';

const AdminCreateMeeting = ({ onClose }) => {
  const { createMeeting } = useApp();
  const [open, setOpen] = useState(true);

  const [form, setForm] = useState({
    title: '',
    date: '', // dd/mm/yyyy
    time: '', // HH:mm
    location: '',
    session: 'Buổi sáng',
    organizer: '',
    file_rev: '',
    file_rev_link: '',
    file_rev_file: null,
    file_rev_name: '',
    file_pre: '',
    file_pre_link: '',
    file_pre_file: null,
    file_pre_name: '',
    status: 'not_started',
    approved: true
  });

  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === 'file') {
      const file = files && files.length ? files[0] : null;
      if (!file) {
        setForm(prev => ({ ...prev, [name]: null }));
        return;
      }
      const url = URL.createObjectURL(file);
      if (name === 'file_rev_file') {
        setForm(prev => ({
          ...prev,
          file_rev_file: file,
          file_rev_link: url,
          file_rev_name: prev.file_rev_name || file.name
        }));
      } else if (name === 'file_pre_file') {
        setForm(prev => ({
          ...prev,
          file_pre_file: file,
          file_pre_link: url,
          file_pre_name: prev.file_pre_name || file.name
        }));
      }
      return;
    }
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.date || !form.time) {
      setMessage('Vui lòng nhập tiêu đề, ngày và giờ');
      return;
    }

    try {
      const result = await createMeeting({
        title: form.title,
        date: form.date,
        time: form.time,
        location: form.location,
        organizer: form.organizer,
        session: form.session,
        status: form.status,
        approved: form.approved,
        participants: [] // TODO: Thêm danh sách người tham gia
      });

      if (result.success) {
        setMessage('✅ Tạo cuộc họp thành công!');
        setTimeout(() => {
          if (onClose) onClose();
          setOpen(false);
        }, 1500);
        setForm({
          title: '',
          date: '',
          time: '',
          location: '',
          session: 'Buổi sáng',
          organizer: '',
          file_rev: '',
          file_rev_link: '',
          file_rev_file: null,
          file_rev_name: '',
          file_pre: '',
          file_pre_link: '',
          file_pre_file: null,
          file_pre_name: '',
          status: 'not_started',
          approved: true
        });
        setTimeout(() => setMessage(''), 2000);
      } else {
        setMessage('❌ Lỗi: ' + result.error);
      }
    } catch (error) {
      setMessage('❌ Lỗi tạo cuộc họp: ' + error.message);
    }
  };

  if (!open) {
    return (
      <div className="mb-6">
        <button 
          onClick={() => setOpen(true)} 
          className="group bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white font-bold py-3 px-8 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 flex items-center gap-3"
        >
          <span className="text-2xl group-hover:rotate-90 transition-transform duration-300">+</span>
          <span>Tạo cuộc họp mới</span>
        </button>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-white via-red-50/30 to-pink-50/30 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-200 p-8 hover:shadow-3xl transition-all duration-300">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
            <span className="text-white text-2xl font-bold">+</span>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Tạo cuộc họp mới</h2>
            <p className="text-sm text-gray-600">Quản trị viên</p>
          </div>
        </div>
      </div>
      
      {message && (
        <div className={`mb-6 text-sm font-semibold rounded-xl px-5 py-4 shadow-md border-2 ${
          message.startsWith('✅') 
            ? 'text-green-700 bg-gradient-to-r from-green-50 to-emerald-50 border-green-300' 
            : 'text-red-700 bg-gradient-to-r from-red-50 to-pink-50 border-red-300'
        }`}>
          {message}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <input 
            name="title" 
            value={form.title} 
            onChange={handleChange} 
            className="px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-200 transition-all hover:border-gray-400" 
            placeholder="Tiêu đề cuộc họp" 
            required 
          />
          <input 
            name="date" 
            value={form.date} 
            onChange={handleChange} 
            className="px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-200 transition-all hover:border-gray-400" 
            placeholder="Ngày (dd/mm/yyyy)" 
            required 
          />
          <input 
            name="time" 
            value={form.time} 
            onChange={handleChange} 
            className="px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-200 transition-all hover:border-gray-400" 
            placeholder="Giờ (HH:mm)" 
            required 
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <input 
            name="location" 
            value={form.location} 
            onChange={handleChange} 
            className="px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-200 transition-all hover:border-gray-400" 
            placeholder="Địa điểm" 
          />
          <input 
            name="organizer" 
            value={form.organizer} 
            onChange={handleChange} 
            className="px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-200 transition-all hover:border-gray-400" 
            placeholder="Lãnh đạo chủ trì" 
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="relative group">
            <input
              name="file_rev_link"
              value={form.file_rev_link}
              onChange={handleChange}
              className="w-full px-4 py-3 pr-14 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-200 transition-all hover:border-gray-400"
              placeholder="Tài liệu được phát"
            />
            <input type="file" name="file_rev_file" onChange={handleChange} className="hidden" id="revUpload" />
            <button
              type="button"
              onClick={() => document.getElementById('revUpload').click()}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white text-xl font-bold shadow-md hover:shadow-lg transition-all hover:scale-110"
              title="Chọn file"
            >
              +
            </button>
          </div>
          <div className="relative group">
            <input
              name="file_pre_link"
              value={form.file_pre_link}
              onChange={handleChange}
              className="w-full px-4 py-3 pr-14 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-200 transition-all hover:border-gray-400"
              placeholder="Tài liệu chuẩn bị"
            />
            <input type="file" name="file_pre_file" onChange={handleChange} className="hidden" id="preUpload" />
            <button
              type="button"
              onClick={() => document.getElementById('preUpload').click()}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white text-xl font-bold shadow-md hover:shadow-lg transition-all hover:scale-110"
              title="Chọn file"
            >
              +
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <select 
            name="session" 
            value={form.session} 
            onChange={handleChange} 
            className="px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-200 transition-all hover:border-gray-400 bg-white appearance-none cursor-pointer"
          >
            <option value="Buổi sáng">Buổi sáng</option>
            <option value="Buổi chiều">Buổi chiều</option>
          </select>
          <select 
            name="status" 
            value={form.status} 
            onChange={handleChange} 
            className="px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-200 transition-all hover:border-gray-400 bg-white appearance-none cursor-pointer"
          >
            <option value="not_started">Chưa diễn ra</option>
            <option value="ongoing">Đang diễn ra</option>
            <option value="postponed">Bị hoãn</option>
            <option value="completed">Kết thúc</option>
          </select>
          <label className="inline-flex items-center gap-3 px-5 py-3 border-2 border-gray-300 rounded-xl hover:border-red-400 transition-all cursor-pointer bg-white">
            <input 
              type="checkbox" 
              name="approved" 
              checked={form.approved} 
              onChange={handleChange} 
              className="w-5 h-5 text-red-600 border-gray-300 rounded focus:ring-red-500 cursor-pointer"
            />
            <span className="font-semibold text-gray-700">Đã duyệt</span>
          </label>
        </div>

        <div className="flex items-center gap-4 pt-4">
          <button 
            type="submit" 
            className="flex-1 bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white font-bold py-4 px-8 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105"
          >
            Tạo cuộc họp
          </button>
          <button 
            type="button" 
            onClick={() => { setOpen(false); if (onClose) onClose(); }} 
            className="px-8 py-4 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold rounded-xl transition-all duration-300 hover:scale-105 shadow-md"
          >
            Đóng
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminCreateMeeting;


