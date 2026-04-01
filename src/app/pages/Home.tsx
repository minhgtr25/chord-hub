import { useState } from "react";
import { Link } from "react-router";
import Header from "../components/Header";
import Footer from "../components/Footer";
import SongCard from "../components/SongCard";
import { getSongs } from "../data/mockSongs";
import { Music2, Search, Grid, List, SlidersHorizontal, TrendingUp, Clock, Sparkles } from "lucide-react";

export default function Home() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterGenre, setFilterGenre] = useState<string>("all");
  const [activeTab, setActiveTab] = useState<"latest" | "all">("latest");

  const songs = getSongs();

  // Sort by updatedAt descending
  const sortedSongs = [...songs].sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );

  const recentSongs = sortedSongs.slice(0, 6);
  const displaySongs = activeTab === "latest" ? recentSongs : sortedSongs;

  // Filter
  const filteredSongs = displaySongs.filter((song) => {
    const matchSearch =
      song.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      song.artist.toLowerCase().includes(searchTerm.toLowerCase());
    const matchGenre = filterGenre === "all" || song.genre === filterGenre;
    return matchSearch && matchGenre;
  });

  const genres = Array.from(new Set(songs.map((s) => s.genre))).sort();

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <Header />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Welcome banner */}
        <div className="mb-8 bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-6 sm:p-8 text-white">
          <div className="flex items-center gap-3 mb-2">
            <Music2 className="w-8 h-8" />
            <h1 className="text-2xl sm:text-3xl font-bold">ChordHub</h1>
          </div>
          <p className="text-blue-100 max-w-xl">
            Khám phá và chia sẻ hợp âm bài hát. Đăng nhập để tạo và quản lý bài hát của riêng bạn.
          </p>
        </div>

        {/* Tabs + Search bar */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Tabs */}
            <div className="flex bg-gray-100 dark:bg-gray-900 rounded-lg p-1 shrink-0">
              <button
                onClick={() => setActiveTab("latest")}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === "latest"
                    ? "bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm"
                    : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                }`}
              >
                <Clock className="w-4 h-4" />
                Gần đây
              </button>
              <button
                onClick={() => setActiveTab("all")}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === "all"
                    ? "bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm"
                    : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                }`}
              >
                <TrendingUp className="w-4 h-4" />
                Tất cả
              </button>
            </div>

            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Tìm bài hát hoặc nghệ sĩ..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-gray-100 placeholder:text-gray-500 outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>

            {/* Genre filter & View toggle */}
            <div className="flex gap-2 shrink-0">
              <select
                value={filterGenre}
                onChange={(e) => setFilterGenre(e.target.value)}
                className="px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-gray-100 outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              >
                <option value="all">Thể loại</option>
                {genres.map((g) => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>

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
        </div>

        {/* Results info */}
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {filteredSongs.length} bài hát
            {activeTab === "latest" && " gần đây"}
            {searchTerm && ` · "${searchTerm}"`}
          </p>
          {activeTab === "latest" && filteredSongs.length > 0 && (
            <button
              onClick={() => setActiveTab("all")}
              className="text-sm text-blue-600 dark:text-blue-400 hover:underline font-medium"
            >
              Xem tất cả →
            </button>
          )}
        </div>

        {/* Song list */}
        {filteredSongs.length > 0 ? (
          <div
            className={
              viewMode === "grid"
                ? "grid sm:grid-cols-2 lg:grid-cols-3 gap-5"
                : "space-y-3"
            }
          >
            {filteredSongs.map((song) => (
              <SongCard key={song.id} song={song} view={viewMode} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Không tìm thấy bài hát
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm
            </p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}