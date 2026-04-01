import { useState, useEffect } from "react";
import { Link } from "react-router";
import Header from "../components/Header";
import Footer from "../components/Footer";
import SongCard from "../components/SongCard";
import { getSongsByAuthor } from "../lib/songsService";
import type { Song } from "../lib/songsService";
import { useAuth } from "../utils/AuthContext";
import { Plus, Search, Grid, List, Music2, LogIn, Loader2 } from "lucide-react";
import DesktopOnly from "../components/DesktopOnly";

export default function MyChords() {
  const { user, openAuthModal } = useAuth();
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchTerm, setSearchTerm] = useState("");
  const [mySongs, setMySongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setLoading(true);
      getSongsByAuthor(user.id).then((data) => {
        setMySongs(data);
        setLoading(false);
      });
    }
  }, [user]);

  // Not logged in
  if (!user) {
    return (
      <DesktopOnly>
      <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
        <Header />
        <main className="flex-1 flex items-center justify-center px-4">
          <div className="text-center max-w-md">
            <div className="w-20 h-20 mx-auto mb-6 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
              <Music2 className="w-10 h-10 text-blue-600 dark:text-blue-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Đăng nhập để xem bài hát của bạn
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Bạn cần đăng nhập để tạo và quản lý các bài hát hợp âm của riêng mình.
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
      </DesktopOnly>
    );
  }

  const filteredSongs = mySongs.filter((song) =>
    song.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    song.artist.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <DesktopOnly>
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <Header />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Page header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
              Hợp âm của tôi
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
              {mySongs.length} bài hát · Chỉ bạn mới có thể chỉnh sửa
            </p>
          </div>
          <Link
            to="/editor/new"
            className="hidden lg:inline-flex items-center gap-2 px-5 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors shrink-0"
          >
            <Plus className="w-5 h-5" />
            Tạo bài hát mới
          </Link>
        </div>

        {/* Search and controls */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 mb-6">
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Tìm trong bài hát của bạn..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-gray-100 placeholder:text-gray-500 outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>
            <div className="hidden sm:flex border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
              <button
                onClick={() => setViewMode("grid")}
                className={`px-3 py-2 transition-colors ${
                  viewMode === "grid"
                    ? "bg-blue-600 text-white"
                    : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                }`}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`px-3 py-2 border-l border-gray-200 dark:border-gray-700 transition-colors ${
                  viewMode === "list"
                    ? "bg-blue-600 text-white"
                    : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                }`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Song list with edit enabled */}
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
          </div>
        ) : filteredSongs.length > 0 ? (
          <div
            className={
              viewMode === "grid"
                ? "grid sm:grid-cols-2 lg:grid-cols-3 gap-5"
                : "space-y-3"
            }
          >
            {filteredSongs.map((song) => (
              <SongCard key={song.id} song={song} view={viewMode} showEditButton={true} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            {mySongs.length === 0 ? (
              <>
                <div className="w-20 h-20 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Music2 className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Bạn chưa có bài hát nào
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Bắt đầu tạo bài hát đầu tiên của bạn ngay!
                </p>
                <Link
                  to="/editor/new"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
                >
                  <Plus className="w-5 h-5" />
                  Tạo bài hát mới
                </Link>
              </>
            ) : (
              <>
                <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Không tìm thấy kết quả
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Thử từ khóa khác
                </p>
              </>
            )}
          </div>
        )}
      </main>

      <Footer />
    </div>
    </DesktopOnly>
  );
}
