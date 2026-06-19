
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useApp } from "../contexts/AppContext";
import { useMeetingWithWebRTC } from "../hook/useMeeting";
import VideoTile from "../components/VideoTile";
import { Mic, MicOff, Video, VideoOff, Share2, PhoneOff } from "lucide-react";

export default function MeetingDetailPage() {
  const { meetingId } = useParams();
  const { currentUser } = useApp();
  const navigate = useNavigate();

  const [showLeaveMessage, setShowLeaveMessage] = useState(false);

  const handleLeaveMeeting = () => {
    setShowLeaveMessage(true);

    setTimeout(() => {
      navigate(-1); // quay về trang trước
    }, 1000);
  };

  const {
    status,
    participants,
    remoteStreams,
    toggleCamera,
    toggleMicrophone,
    startScreenShare,
    stopScreenShare,
    error,
    localStream,
    isMicOn,
    isVideoOn,
    isScreenSharing,
  } = useMeetingWithWebRTC(meetingId);

  if (status === "connecting" || status === "reconnecting")
    return (
      <div className="flex h-screen items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <div className="text-center">
          <div className="relative w-20 h-20 mx-auto mb-6">
            <div className="absolute inset-0 border-4 border-red-500/30 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-t-red-500 rounded-full animate-spin"></div>
          </div>
          <p className="text-white text-xl font-semibold mb-2">
            {status === "connecting" ? "Đang kết nối..." : "Đang kết nối lại..."}
          </p>
          <p className="text-gray-400 text-sm">Vui lòng đợi trong giây lát</p>
        </div>
      </div>
    );

  if (status === "error" || error)
    return (
      <div className="flex h-screen items-center justify-center bg-gradient-to-br from-gray-900 via-red-900/20 to-gray-900">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-red-500 to-pink-500 rounded-full flex items-center justify-center shadow-2xl">
            <span className="text-white text-4xl">⚠️</span>
          </div>
          <p className="text-red-400 text-xl font-bold mb-2">Lỗi kết nối</p>
          <p className="text-gray-300">{error || "Không thể tham gia cuộc họp"}</p>
          <button
            onClick={() => navigate(-1)}
            className="mt-6 px-6 py-3 bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
          >
            Quay lại
          </button>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white p-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 via-transparent to-purple-500/5 pointer-events-none"></div>

      {/* VIDEO GRID */}
      <div
        className="grid gap-5 relative z-10"
        style={{ gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))" }}
      >
        <VideoTile
          connectionId="local"
          fullName={currentUser?.fullName}
          stream={localStream}
          isLocal={true}
          isScreenSharing={isScreenSharing}
          camEnabled={isVideoOn}
          micEnabled={isMicOn}
          onToggleCam={toggleCamera}
          onToggleMic={toggleMicrophone}
        />

        {participants.map((p) => (
          <VideoTile
            key={p.connectionId}
            connectionId={p.connectionId}
            fullName={p.fullName}
            stream={remoteStreams[p.connectionId]}
            camEnabled={p.isVideoEnabled !== false}
            micEnabled={p.isMicEnabled !== false}
          />
        ))}
      </div>

      {/* CONTROL BAR */}
      <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50">
        <div className="bg-gradient-to-r from-gray-800/95 via-gray-900/95 to-gray-800/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-700/50 p-3 flex gap-3">
          
          {/* MIC */}
          <button
            onClick={toggleMicrophone}
            className={`group p-4 rounded-xl transition-all duration-300 hover:scale-110 shadow-lg ${
              isMicOn 
                ? "bg-gradient-to-br from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white" 
                : "bg-gray-700/80 hover:bg-gray-600 text-gray-300"
            }`}
            title={isMicOn ? "Tắt micro" : "Bật micro"}
          >
            {isMicOn ? <Mic size={24} className="group-hover:animate-pulse" /> : <MicOff size={24} />}
          </button>

          {/* CAMERA */}
          <button
            onClick={toggleCamera}
            className={`group p-4 rounded-xl transition-all duration-300 hover:scale-110 shadow-lg ${
              isVideoOn 
                ? "bg-gradient-to-br from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white" 
                : "bg-gray-700/80 hover:bg-gray-600 text-gray-300"
            }`}
            title={isVideoOn ? "Tắt camera" : "Bật camera"}
          >
            {isVideoOn ? <Video size={24} className="group-hover:animate-pulse" /> : <VideoOff size={24} />}
          </button>

          {/* SHARE SCREEN */}
          <button
            onClick={isScreenSharing ? stopScreenShare : startScreenShare}
            className={`group p-4 rounded-xl transition-all duration-300 hover:scale-110 shadow-lg ${
              isScreenSharing
                ? "bg-gradient-to-br from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
                : "bg-gray-700/80 hover:bg-gray-600 text-gray-300"
            }`}
            title={isScreenSharing ? "Dừng chia sẻ" : "Chia sẻ màn hình"}
          >
            <Share2 size={24} className={isScreenSharing ? "animate-pulse" : ""} />
          </button>

          <div className="w-px bg-gray-600 mx-1"></div>

          {/* LEAVE MEETING */}
          <button
            className="group p-4 rounded-xl bg-gradient-to-br from-red-600/30 to-pink-600/30 hover:from-red-600 hover:to-pink-600 
                       text-red-400 hover:text-white border-2 border-red-500/50 hover:border-red-500
                       transition-all duration-300 hover:scale-110 shadow-lg"
            onClick={handleLeaveMeeting}
            title="Rời cuộc họp"
          >
            <PhoneOff size={24} className="group-hover:animate-pulse" />
          </button>

        </div>
      </div>

      {showLeaveMessage && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-8 rounded-3xl shadow-2xl border border-gray-700 text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-red-500 to-pink-500 rounded-full flex items-center justify-center animate-pulse">
              <PhoneOff size={32} className="text-white" />
            </div>
            <p className="text-white text-xl font-bold mb-2">Đang rời cuộc họp...</p>
            <p className="text-gray-400 text-sm">Cảm ơn bạn đã tham gia</p>
          </div>
        </div>
      )}

    </div>
  );
}
