import { useEffect } from "react";
import { useParams, useNavigate } from "react-router";

// Component này sẽ tự động điều hướng người dùng đến đúng page
// dựa trên kích thước màn hình
export default function SongRoute() {
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    navigate(`/view/${id}`, { replace: true });
  }, [id, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-600 dark:text-gray-400">Đang tải...</p>
      </div>
    </div>
  );
}
