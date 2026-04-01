import Header from "../components/Header";
import Footer from "../components/Footer";
import { User, Mail, Music, Calendar, Settings, Save, LogIn } from "lucide-react";
import { useAuth } from "../utils/AuthContext";
import { getSongs } from "../data/mockSongs";

export default function Profile() {
  const { user, openAuthModal, updateProfile } = useAuth();

  // Not logged in
  if (!user) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
        <Header />
        <main className="flex-1 flex items-center justify-center px-4">
          <div className="text-center max-w-md">
            <div className="w-20 h-20 mx-auto mb-6 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
              <User className="w-10 h-10 text-gray-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Bạn chưa đăng nhập
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Đăng nhập để quản lý bài hát và cá nhân hóa trải nghiệm của bạn.
            </p>
            <button
              onClick={() => openAuthModal("login")}
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition"
            >
              <LogIn className="w-5 h-5" />
              Đăng nhập ngay
            </button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Stats from real data
  const allSongs = getSongs();
  const mySongs = allSongs.filter((s) => s.authorId === user.id);

  const handleSave = () => {
    // updateProfile is called on each field change below, so this is just a confirmation
    alert("Đã lưu thông tin profile!");
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <Header />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Profile</h1>

        <div className="space-y-6">
          {/* Avatar section */}
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
            <div className="flex items-center gap-6">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center overflow-hidden">
                {user.avatar ? (
                  <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                ) : (
                  <User className="w-12 h-12 text-white" />
                )}
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-1">
                  {user.name}
                </h2>
                <p className="text-gray-600 dark:text-gray-400">{user.email}</p>
              </div>
            </div>
          </div>

          {/* Personal info */}
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
            <div className="flex items-center gap-2 mb-4">
              <Settings className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                Thông tin cá nhân
              </h3>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Tên
                </label>
                <input
                  type="text"
                  value={user.name}
                  onChange={(e) => updateProfile({ name: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-gray-100 outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    value={user.email}
                    readOnly
                    className="w-full pl-10 pr-4 py-2 bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-500 dark:text-gray-400 cursor-not-allowed"
                  />
                </div>
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Email không thể thay đổi</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Nhạc cụ
                </label>
                <div className="relative">
                  <Music className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <select
                    value={user.instrument || "Guitar"}
                    onChange={(e) => updateProfile({ instrument: e.target.value })}
                    className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-gray-100 outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option>Guitar</option>
                    <option>Piano</option>
                    <option>Drums</option>
                    <option>Bass</option>
                    <option>Vocal</option>
                    <option>Khác</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Giới thiệu
                </label>
                <textarea
                  value={user.bio || ""}
                  onChange={(e) => updateProfile({ bio: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-gray-100 outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>
            </div>

            <button
              onClick={handleSave}
              className="mt-6 flex items-center gap-2 px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
            >
              <Save className="w-4 h-4" />
              <span>Lưu thay đổi</span>
            </button>
          </div>

          {/* Stats */}
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Thống kê
            </h3>
            <div className="grid sm:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-1">
                  {mySongs.length}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Bài hát của tôi</div>
              </div>
              <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-1">
                  {allSongs.length}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Tổng bài hát</div>
              </div>
              <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-1">
                  {mySongs.reduce((sum, s) => sum + s.lyrics.length, 0)}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Tổng dòng nhạc</div>
              </div>
            </div>
          </div>

          {/* Member since */}
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
            <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
              <Calendar className="w-5 h-5" />
              <span>Thành viên từ {user.createdAt}</span>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
