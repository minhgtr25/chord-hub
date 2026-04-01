import { Link, useLocation } from "react-router";
import { Home, Music, LogIn, User } from "lucide-react";
import { useAuth } from "../utils/AuthContext";

export default function BottomNav() {
  const { user, openAuthModal } = useAuth();
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="md:hidden fixed bottom-0 inset-x-0 z-50 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 safe-area-pb">
      <div className="flex items-stretch h-16">
        {/* Trang chủ */}
        <Link
          to="/"
          className={`flex-1 flex flex-col items-center justify-center gap-0.5 transition-colors ${
            isActive("/")
              ? "text-blue-600 dark:text-blue-400"
              : "text-gray-500 dark:text-gray-400"
          }`}
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px] font-medium">Trang chủ</span>
        </Link>

        {/* Bài hát */}
        <Link
          to="/songs"
          className={`flex-1 flex flex-col items-center justify-center gap-0.5 transition-colors ${
            isActive("/songs")
              ? "text-blue-600 dark:text-blue-400"
              : "text-gray-500 dark:text-gray-400"
          }`}
        >
          <Music className="w-5 h-5" />
          <span className="text-[10px] font-medium">Bài hát</span>
        </Link>


        {/* Profile / Đăng nhập */}
        {user ? (
          <Link
            to="/profile"
            className={`flex-1 flex flex-col items-center justify-center gap-0.5 transition-colors ${
              isActive("/profile")
                ? "text-blue-600 dark:text-blue-400"
                : "text-gray-500 dark:text-gray-400"
            }`}
          >
            <img
              src={user.avatar}
              alt={user.name}
              className="w-6 h-6 rounded-full object-cover border border-gray-200 dark:border-gray-700"
            />
            <span className="text-[10px] font-medium truncate max-w-[56px]">
              {user.name.split(" ").pop()}
            </span>
          </Link>
        ) : (
          <button
            onClick={() => openAuthModal("login")}
            className="flex-1 flex flex-col items-center justify-center gap-0.5 text-gray-500 dark:text-gray-400 transition-colors"
          >
            <LogIn className="w-5 h-5" />
            <span className="text-[10px] font-medium">Đăng nhập</span>
          </button>
        )}
      </div>
    </nav>
  );
}
