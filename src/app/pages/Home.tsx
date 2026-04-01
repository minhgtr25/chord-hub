import { useState, useEffect } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import SongCard from "../components/SongCard";
import { getSongs } from "../lib/songsService";
import type { Song } from "../lib/songsService";
import { Music2, Search, Grid, List, TrendingUp, Clock, Loader2 } from "lucide-react";

export default function Home() {
  const isMobile = typeof window !== "undefined" && window.innerWidth < 640;
  const [viewMode, setViewMode] = useState<"grid" | "list">(isMobile ? "list" : "grid");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterGenre, setFilterGenre] = useState<string>("all");
  const [activeTab, setActiveTab] = useState<"latest" | "all">("latest");
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getSongs().then((data) => {
      setSongs(data);
      setLoading(false);
    });
  }, []);

  const recentSongs = songs.slice(0, 6);
  const displaySongs = activeTab === "latest" ? recentSongs : songs;

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

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        {/* Welcome banner — compact on mobile */}
        <div className="mb-5 bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl sm:rounded-2xl p-4 sm:p-8 text-white">
          <div className="flex items-center gap-2.5 mb-1">
            <Music2 className="w-6 h-6 sm:w-8 sm:h-8" />
            <h1 className="text-xl sm:text-3xl font-bold">ChordHub</h1>
          </div>
          <p className="text-blue-100 text-sm sm:text-base max-w-xl">
            Khám phá và chia sẻ hợp âm bài hát.
          </p>
        </div>

        {/* Search + Filters — sticky on mobile */}
        <div className="sticky top-16 z-30 bg-gray-50 dark:bg-gray-900 pb-3 -mx-4 px-4 sm:mx-0 sm:px-0 sm:static sm:bg-transparent sm:pb-0">
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-3 sm:p-4 mb-4 sm:mb-6 shadow-sm sm:shadow-none">
            {/* Search bar */}
            <div className="relative mb-3">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Tìm bài hát hoặc nghệ sĩ..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 sm:pl-10 pr-4 py-2.5 sm:py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-gray-100 placeholder:text-gray-500 outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>

            {/* Tabs + filters row */}
            <div className="flex items-center gap-2">
              {/* Tabs */}
              <div className="flex bg-gray-100 dark:bg-gray-900 rounded-lg p-0.5 shrink-0">
                <button
                  onClick={() => setActiveTab("latest")}
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-md text-xs sm:text-sm font-medium transition-colors ${
                    activeTab === "latest"
                      ? "bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm"
                      : "text-gray-600 dark:text-gray-400"
                  }`}
                >
                  <Clock className="w-3.5 h-3.5" />
                  Gần đây
                </button>
                <button
                  onClick={() => setActiveTab("all")}
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-md text-xs sm:text-sm font-medium transition-colors ${
                    activeTab === "all"
                      ? "bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm"
                      : "text-gray-600 dark:text-gray-400"
                  }`}
                >
                  <TrendingUp className="w-3.5 h-3.5" />
                  Tất cả
                </button>
              </div>

              {/* Genre filter */}
              <select
                value={filterGenre}
                onChange={(e) => setFilterGenre(e.target.value)}
                className="flex-1 px-2 py-1.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-gray-100 outline-none focus:ring-2 focus:ring-blue-500 text-xs sm:text-sm"
              >
                <option value="all">Tất cả thể loại</option>
                {genres.map((g) => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>

              {/* View toggle — desktop only */}
              <div className="hidden sm:flex border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden shrink-0">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`px-2.5 py-1.5 transition-colors ${
                    viewMode === "grid"
                      ? "bg-blue-600 text-white"
                      : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300"
                  }`}
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`px-2.5 py-1.5 border-l border-gray-200 dark:border-gray-700 transition-colors ${
                    viewMode === "list"
                      ? "bg-blue-600 text-white"
                      : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300"
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
            {loading ? "Đang tải..." : `${filteredSongs.length} bài hát${activeTab === "latest" ? " gần đây" : ""}${searchTerm ? ` · "${searchTerm}"` : ""}`}
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

        {/* Loading state */}
        {loading ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
          </div>
        ) : filteredSongs.length > 0 ? (
          <div className={viewMode === "grid" ? "grid sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-5" : "space-y-2 sm:space-y-3"}>
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