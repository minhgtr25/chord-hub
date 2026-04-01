import { Music, Clock, Eye, Edit, User } from "lucide-react";
import { Link } from "react-router";
import { Song } from "../data/mockSongs";
import { findUserById } from "../data/mockUsers";

interface SongCardProps {
  song: Song;
  view?: "grid" | "list";
  showEditButton?: boolean; // Only true on "My Chords" page
}

export default function SongCard({ song, view = "grid", showEditButton = false }: SongCardProps) {
  const author = song.authorId ? findUserById(song.authorId) : null;
  const authorName = author?.name || "Ẩn danh";

  // Format relative time
  const timeAgo = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    if (days === 0) return "Hôm nay";
    if (days === 1) return "Hôm qua";
    if (days < 7) return `${days} ngày trước`;
    if (days < 30) return `${Math.floor(days / 7)} tuần trước`;
    return dateStr;
  };

  if (view === "list") {
    return (
      <div className="flex items-center gap-4 p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-500 transition-all hover:shadow-md">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 dark:text-white truncate">
            {song.title}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
            {song.artist}
          </p>
        </div>

        <div className="hidden sm:flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 shrink-0">
          <div className="flex items-center gap-1" title="Người đăng">
            <User className="w-3.5 h-3.5" />
            <span className="max-w-[100px] truncate">{authorName}</span>
          </div>
          <div className="flex items-center gap-1">
            <Music className="w-3.5 h-3.5" />
            <span>{song.key}</span>
          </div>
          <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 rounded text-xs">
            {song.genre}
          </span>
          <span className="text-xs whitespace-nowrap">{timeAgo(song.updatedAt)}</span>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Link
            to={`/view/${song.id}`}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm transition-colors"
          >
            <Eye className="w-4 h-4" />
            <span className="hidden sm:inline">Xem</span>
          </Link>
          {showEditButton && (
            <Link
              to={`/editor/${song.id}`}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 text-sm transition-colors"
            >
              <Edit className="w-4 h-4" />
              <span className="hidden sm:inline">Sửa</span>
            </Link>
          )}
        </div>
      </div>
    );
  }

  // Grid view
  return (
    <div className="group bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden hover:border-blue-500 dark:hover:border-blue-500 transition-all hover:shadow-lg">
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-1 truncate">
          {song.title}
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 truncate">
          {song.artist}
        </p>

        {/* Meta row */}
        <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-3">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <Music className="w-3.5 h-3.5" />
              <span>{song.key}</span>
            </div>
            <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 rounded text-xs">
              {song.genre}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            <span className="text-xs">{song.duration}</span>
          </div>
        </div>

        {/* Author & time row */}
        <div className="flex items-center justify-between text-xs text-gray-400 dark:text-gray-500 mb-4 pb-3 border-b border-gray-100 dark:border-gray-700">
          <div className="flex items-center gap-1.5">
            <User className="w-3.5 h-3.5" />
            <span>{authorName}</span>
          </div>
          <span>{timeAgo(song.updatedAt)}</span>
        </div>

        {/* Action buttons */}
        <div className="flex gap-2">
          <Link
            to={`/view/${song.id}`}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-colors text-sm"
          >
            <Eye className="w-4 h-4" />
            <span>Xem</span>
          </Link>
          {showEditButton && (
            <Link
              to={`/editor/${song.id}`}
              className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 transition-colors text-sm"
            >
              <Edit className="w-4 h-4" />
              <span>Sửa</span>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}