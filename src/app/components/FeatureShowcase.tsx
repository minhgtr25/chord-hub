import { Monitor, Smartphone, Zap, Users } from "lucide-react";

export default function FeatureShowcase() {
  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
      <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6 text-center">
        Platform-Specific Features
      </h3>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Desktop Card */}
        <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg p-6 border-2 border-blue-200 dark:border-blue-800">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
              <Monitor className="w-6 h-6 text-white" />
            </div>
            <div>
              <h4 className="font-bold text-gray-900 dark:text-white">Desktop</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">Power User Tools</p>
            </div>
          </div>

          <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
            <li className="flex items-start gap-2">
              <span className="text-blue-600 dark:text-blue-400 mt-0.5">✓</span>
              <span>Trình soạn nhạc đầy đủ với toolbar chuyên nghiệp</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 dark:text-blue-400 mt-0.5">✓</span>
              <span>Thêm/xóa hợp âm, thay đổi key tự động</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 dark:text-blue-400 mt-0.5">✓</span>
              <span>Undo/Redo với history tracking</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 dark:text-blue-400 mt-0.5">✓</span>
              <span>Player tích hợp: play/pause, speed control, volume</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 dark:text-blue-400 mt-0.5">✓</span>
              <span>Sidebar với chord templates và thông tin bài hát</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 dark:text-blue-400 mt-0.5">✓</span>
              <span>Zoom in/out, font size control</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-purple-600 dark:text-purple-400 mt-0.5">⚡</span>
              <span><strong>Auto Chord Detection</strong> - AI dò hợp âm tự động</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 dark:text-blue-400 mt-0.5">✓</span>
              <span>Keyboard shortcuts hỗ trợ workflow nhanh</span>
            </li>
          </ul>
        </div>

        {/* Mobile Card */}
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg p-6 border-2 border-green-200 dark:border-green-800">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center">
              <Smartphone className="w-6 h-6 text-white" />
            </div>
            <div>
              <h4 className="font-bold text-gray-900 dark:text-white">Mobile</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">Performance Optimized</p>
            </div>
          </div>

          <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
            <li className="flex items-start gap-2">
              <span className="text-green-600 dark:text-green-400 mt-0.5">✓</span>
              <span>Giao diện tối ưu cho màn hình nhỏ</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600 dark:text-green-400 mt-0.5">✓</span>
              <span>Touch-friendly với scroll mượt mà</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600 dark:text-green-400 mt-0.5">✓</span>
              <span>Xem hợp âm và lời bài hát rõ ràng</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600 dark:text-green-400 mt-0.5">✓</span>
              <span>Thêm ghi chú nhanh cho từng dòng</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600 dark:text-green-400 mt-0.5">✓</span>
              <span>Player mini với controls cơ bản</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600 dark:text-green-400 mt-0.5">✓</span>
              <span>Toggle show/hide hợp âm nhanh chóng</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600 dark:text-green-400 mt-0.5">✓</span>
              <span>Lưu ghi chú tự động khi biểu diễn</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600 dark:text-green-400 mt-0.5">✓</span>
              <span>Minimal UI - tập trung vào nội dung</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Common Features */}
      <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
        <h5 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
          <Users className="w-5 h-5 text-orange-600 dark:text-orange-400" />
          Tính năng chung
        </h5>
        <div className="grid sm:grid-cols-2 gap-3 text-sm text-gray-700 dark:text-gray-300">
          <div className="flex items-center gap-2">
            <span className="text-orange-600 dark:text-orange-400">✓</span>
            <span>Dark/Light mode</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-orange-600 dark:text-orange-400">✓</span>
            <span>Hiển thị hợp âm rõ ràng</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-orange-600 dark:text-orange-400">✓</span>
            <span>Đồng bộ hợp âm với player</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-orange-600 dark:text-orange-400">✓</span>
            <span>Lưu trữ local & backup</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-orange-600 dark:text-orange-400">✓</span>
            <span>Search & filter bài hát</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-orange-600 dark:text-orange-400">✓</span>
            <span>Profile & settings</span>
          </div>
        </div>
      </div>

      {/* AI Features Badge */}
      <div className="mt-6 p-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
            <Zap className="w-6 h-6" />
          </div>
          <div>
            <h5 className="font-semibold mb-1">AI-Powered Features</h5>
            <p className="text-sm text-blue-100">
              Tự động dò hợp âm từ audio, gợi ý hợp âm thông minh, 
              và tối ưu hóa workflow cho nhạc công
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
