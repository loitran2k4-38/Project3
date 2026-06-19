import React, { useState } from 'react';
import { Video, User, Lock, XCircle } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { formatTime } from '../utils/dateUtils';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, currentTime } = useApp();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await login(username, password);

      if (result.success) {
        navigate('/'); // Chuyển sang trang chủ sau khi đăng nhập thành công
      } else {
        console.log('ĐĂNG NHẬP THẤT BẠI:', result.message); // <-- DEBUG
        setError(result.message || 'Đăng nhập thất bại');
      }
    } catch (err) {
      setError('Lỗi kết nối: ' + (err.message || 'Không thể kết nối đến server'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-600 via-pink-600 to-purple-700 flex items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-20 w-72 h-72 bg-white rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-pink-300 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>
      
      <div className="relative bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl p-10 w-full max-w-md border border-white/20">
        <div className="text-center mb-8">
          <div className="relative inline-block mb-6">
            <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-pink-500 rounded-full blur-xl opacity-50 animate-pulse"></div>
            <div className="relative bg-gradient-to-br from-red-100 to-pink-100 rounded-full p-5 shadow-lg">
              <Video className="w-16 h-16 text-red-600" />
            </div>
          </div>
          <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-pink-600 mb-3">
            Phòng Họp Không Giấy
          </h1>
          <p className="text-gray-600 font-semibold text-lg">Đại học Bách Khoa Hà Nội</p>
          <div className="mt-4 inline-flex items-center gap-2 bg-gradient-to-r from-blue-100 to-cyan-100 px-4 py-2 rounded-xl border border-blue-200">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <p className="text-sm text-blue-800 font-medium">{formatTime(currentTime)}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-gradient-to-r from-red-50 to-pink-50 border-2 border-red-300 rounded-2xl p-4 flex items-start shadow-lg animate-shake">
              <XCircle className="w-5 h-5 text-red-600 mr-3 mt-0.5 flex-shrink-0" />
              <p className="text-red-700 text-sm font-semibold">{error}</p>
            </div>
          )}

          <div>
            <label className="block text-gray-700 font-bold mb-3 text-sm uppercase tracking-wide">
              Tên đăng nhập
            </label>
            <div className="relative group">
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-lg flex items-center justify-center group-hover:from-blue-200 group-hover:to-cyan-200 transition-all">
                <User className="w-5 h-5 text-blue-600" />
              </div>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full pl-16 pr-4 py-4 border-2 border-gray-300 rounded-2xl focus:border-red-500 focus:ring-4 focus:ring-red-200 focus:outline-none transition-all hover:border-gray-400 bg-white shadow-sm"
                placeholder="Nhập tên đăng nhập"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-700 font-bold mb-3 text-sm uppercase tracking-wide">
              Mật khẩu
            </label>
            <div className="relative group">
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg flex items-center justify-center group-hover:from-purple-200 group-hover:to-pink-200 transition-all">
                <Lock className="w-5 h-5 text-purple-600" />
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-16 pr-4 py-4 border-2 border-gray-300 rounded-2xl focus:border-red-500 focus:ring-4 focus:ring-red-200 focus:outline-none transition-all hover:border-gray-400 bg-white shadow-sm"
                placeholder="Nhập mật khẩu"
                required
                minLength={4}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-5 rounded-2xl font-black text-white text-lg shadow-2xl transition-all duration-300 ${
              loading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-red-600 via-pink-600 to-purple-600 hover:from-red-700 hover:via-pink-700 hover:to-purple-700 hover:scale-105 hover:shadow-3xl'
            }`}
          >
            {loading ? (
              <div className="flex items-center justify-center gap-3">
                <div className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Đang đăng nhập...</span>
              </div>
            ) : (
              'Đăng Nhập'
            )}
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-xs text-gray-500">
            © 2026 Trường Công nghệ Thông tin và Truyền thông
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;