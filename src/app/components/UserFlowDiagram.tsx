import { Home, List, Edit, Eye, Save, Share2, ArrowRight, Smartphone, Monitor } from "lucide-react";

export default function UserFlowDiagram() {
  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 overflow-x-auto">
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
        User Flow Diagram
      </h3>

      {/* Desktop Flow */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <Monitor className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          <h4 className="font-semibold text-gray-900 dark:text-white">
            Desktop Flow - Soạn nhạc & Dò hợp âm
          </h4>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          {/* Home */}
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mb-2">
              <Home className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            </div>
            <span className="text-xs text-gray-600 dark:text-gray-400 text-center">Home</span>
          </div>

          <ArrowRight className="w-5 h-5 text-gray-400" />

          {/* Song List */}
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center mb-2">
              <List className="w-8 h-8 text-purple-600 dark:text-purple-400" />
            </div>
            <span className="text-xs text-gray-600 dark:text-gray-400 text-center">Song List</span>
          </div>

          <ArrowRight className="w-5 h-5 text-gray-400" />

          {/* Song Editor */}
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center mb-2">
              <Edit className="w-8 h-8 text-green-600 dark:text-green-400" />
            </div>
            <span className="text-xs text-gray-600 dark:text-gray-400 text-center">Editor</span>
          </div>

          <ArrowRight className="w-5 h-5 text-gray-400" />

          {/* Save/Share */}
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center mb-2">
              <div className="flex gap-1">
                <Save className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                <Share2 className="w-6 h-6 text-orange-600 dark:text-orange-400" />
              </div>
            </div>
            <span className="text-xs text-gray-600 dark:text-gray-400 text-center">Save/Share</span>
          </div>
        </div>

        {/* Desktop features list */}
        <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <p className="text-sm text-gray-700 dark:text-gray-300">
            <strong>Features:</strong> Toolbar đầy đủ, Auto chord detection, Player tích hợp, 
            Undo/Redo, Thay đổi key, Font size control, Sidebar với chord templates
          </p>
        </div>
      </div>

      {/* Mobile Flow */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Smartphone className="w-5 h-5 text-green-600 dark:text-green-400" />
          <h4 className="font-semibold text-gray-900 dark:text-white">
            Mobile Flow - Xem & Ghi chú
          </h4>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          {/* Home */}
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mb-2">
              <Home className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            </div>
            <span className="text-xs text-gray-600 dark:text-gray-400 text-center">Home</span>
          </div>

          <ArrowRight className="w-5 h-5 text-gray-400" />

          {/* Song List */}
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center mb-2">
              <List className="w-8 h-8 text-purple-600 dark:text-purple-400" />
            </div>
            <span className="text-xs text-gray-600 dark:text-gray-400 text-center">Song List</span>
          </div>

          <ArrowRight className="w-5 h-5 text-gray-400" />

          {/* Song Viewer */}
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center mb-2">
              <Eye className="w-8 h-8 text-green-600 dark:text-green-400" />
            </div>
            <span className="text-xs text-gray-600 dark:text-gray-400 text-center">Viewer</span>
          </div>
        </div>

        {/* Mobile features list */}
        <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
          <p className="text-sm text-gray-700 dark:text-gray-300">
            <strong>Features:</strong> Touch-friendly, Scroll mượt, Thêm note cho từng dòng, 
            Player mini, Toggle show/hide chords, Minimal UI
          </p>
        </div>
      </div>

      {/* Key differences table */}
      <div className="mt-6 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-700">
              <th className="text-left py-2 px-3 text-gray-900 dark:text-white">Component</th>
              <th className="text-left py-2 px-3 text-gray-900 dark:text-white">Desktop</th>
              <th className="text-left py-2 px-3 text-gray-900 dark:text-white">Mobile</th>
            </tr>
          </thead>
          <tbody className="text-gray-600 dark:text-gray-400">
            <tr className="border-b border-gray-200 dark:border-gray-700">
              <td className="py-2 px-3 font-medium">Main Action</td>
              <td className="py-2 px-3">Soạn nhạc + Chỉnh sửa</td>
              <td className="py-2 px-3">Xem + Ghi chú</td>
            </tr>
            <tr className="border-b border-gray-200 dark:border-gray-700">
              <td className="py-2 px-3 font-medium">Toolbar</td>
              <td className="py-2 px-3">Đầy đủ công cụ</td>
              <td className="py-2 px-3">Minimal hoặc ẩn</td>
            </tr>
            <tr className="border-b border-gray-200 dark:border-gray-700">
              <td className="py-2 px-3 font-medium">Player</td>
              <td className="py-2 px-3">Full controls</td>
              <td className="py-2 px-3">Mini player</td>
            </tr>
            <tr className="border-b border-gray-200 dark:border-gray-700">
              <td className="py-2 px-3 font-medium">Sidebar</td>
              <td className="py-2 px-3">Hiển thị đầy đủ</td>
              <td className="py-2 px-3">Collapsible/Ẩn</td>
            </tr>
            <tr>
              <td className="py-2 px-3 font-medium">Navigation</td>
              <td className="py-2 px-3">Keyboard + Mouse</td>
              <td className="py-2 px-3">Touch gestures</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
