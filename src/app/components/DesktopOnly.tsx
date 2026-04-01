import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Monitor, ArrowLeft } from "lucide-react";

interface DesktopOnlyProps {
  children: React.ReactNode;
}

/**
 * Wraps a page/component and shows a "Desktop only" message
 * on screens smaller than 1024px (lg breakpoint).
 */
export default function DesktopOnly({ children }: DesktopOnlyProps) {
  const [isDesktop, setIsDesktop] = useState<boolean | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const check = () => setIsDesktop(window.innerWidth >= 1024);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // Still detecting
  if (isDesktop === null) return null;

  if (!isDesktop) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col items-center justify-center px-6 text-center">
        <div className="w-20 h-20 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mb-6">
          <Monitor className="w-10 h-10 text-blue-600 dark:text-blue-400" />
        </div>

        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
          Tính năng chỉ dành cho máy tính
        </h1>
        <p className="text-gray-600 dark:text-gray-400 max-w-sm mb-8 leading-relaxed">
          Vui lòng sử dụng <strong>PC / Laptop</strong> để tạo và chỉnh sửa bài hát.
          Trên thiết bị di động / máy tính bảng, bạn chỉ có thể xem bài hát.
        </p>

        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Quay lại
        </button>
      </div>
    );
  }

  return <>{children}</>;
}
