import { 
  Undo2, 
  Redo2, 
  Save, 
  Plus, 
  Trash2, 
  Eye, 
  EyeOff, 
  ZoomIn, 
  ZoomOut,
  Music,
  Columns2
} from "lucide-react";
import { transposeChord } from "../utils/chordUtils";

interface ChordToolbarProps {
  onUndo?: () => void;
  onRedo?: () => void;
  onSave?: () => void;
  onAddChord?: () => void;
  onDeleteChord?: () => void;
  onToggleChords?: (visible: boolean) => void;
  onZoomIn?: () => void;
  onZoomOut?: () => void;
  onAutoDetect?: () => void;
  chordsVisible?: boolean;
  canUndo?: boolean;
  canRedo?: boolean;
  currentKey?: string;
  transposeOffset?: number;
  onTransposeOffsetChange?: (offset: number) => void;
  isTwoColumns?: boolean;
  onToggleColumns?: () => void;
  isEditor?: boolean;
}

export default function ChordToolbar({
  onUndo,
  onRedo,
  onSave,
  onAddChord,
  onDeleteChord,
  onToggleChords,
  onZoomIn,
  onZoomOut,
  onAutoDetect,
  chordsVisible = true,
  canUndo = false,
  canRedo = false,
  currentKey,
  transposeOffset = 0,
  onTransposeOffsetChange,
  isTwoColumns = false,
  onToggleColumns,
  isEditor = false,
}: ChordToolbarProps) {
  const Divider = () => <div className="hidden sm:block w-px h-5 bg-gray-200 dark:bg-gray-700 shrink-0"></div>;

  const IconButton = ({ onClick, disabled, icon: Icon, title, className = "", active = false }: any) => (
    <button
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`p-1.5 flex items-center justify-center rounded-lg transition-all ${
        disabled ? "opacity-40 cursor-not-allowed" : "hover:bg-gray-100 dark:hover:bg-gray-700 active:scale-95"
      } ${
        active ? "bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400" : "text-gray-600 dark:text-gray-300"
      } ${className}`}
    >
      <Icon className="w-4 h-4" />
    </button>
  );

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-1.5 shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="flex flex-wrap items-center gap-1.5 sm:gap-3">
        {/* Render editor-specific controls only if user is owner */}
        {isEditor && (
          <>
            <div className="flex items-center">
              <IconButton onClick={onUndo} disabled={!canUndo} title="Hoàn tác" icon={Undo2} />
              <IconButton onClick={onRedo} disabled={!canRedo} title="Làm lại" icon={Redo2} />
            </div>
            
            <Divider />

            <div className="flex items-center gap-1">
              <button
                onClick={onAddChord}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/40 font-medium transition-all text-sm"
                title="Thêm hợp âm"
              >
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">Thêm</span>
              </button>
              <IconButton onClick={onDeleteChord} title="Xóa" icon={Trash2} className="hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20" />
            </div>
          </>
        )}

        {/* Transpose Tool (always visible for viewer comfort) */}
        {(currentKey && onTransposeOffsetChange) && (
          <>
            {isEditor && <Divider />}
            <div className="flex items-center gap-1">
              <div className="flex items-center bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-lg p-0.5">
                <button 
                  onClick={() => onTransposeOffsetChange(transposeOffset - 1)}
                  className="px-2 py-1 text-gray-500 hover:text-gray-900 dark:hover:text-white hover:bg-white dark:hover:bg-gray-700 rounded-md transition-all font-medium text-sm"
                  title="Tone xuống (-0.5)"
                >
                  −
                </button>
                <div className="px-3 min-w-[3.5rem] flex flex-col items-center justify-center">
                  <span className="text-sm font-semibold text-blue-600 dark:text-blue-400 leading-none">
                    {transposeChord(currentKey, transposeOffset)}
                  </span>
                  {transposeOffset !== 0 && (
                    <span className="text-[10px] text-gray-400 mt-0.5 leading-none">
                      {transposeOffset > 0 ? '+' : ''}{transposeOffset}
                    </span>
                  )}
                </div>
                <button 
                  onClick={() => onTransposeOffsetChange(transposeOffset + 1)}
                  className="px-2 py-1 text-gray-500 hover:text-gray-900 dark:hover:text-white hover:bg-white dark:hover:bg-gray-700 rounded-md transition-all font-medium text-sm"
                  title="Tone lên (+0.5)"
                >
                  +
                </button>
              </div>
              {transposeOffset !== 0 && (
                <button
                  onClick={() => onTransposeOffsetChange(0)}
                  className="px-1.5 py-1 text-xs font-medium text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                  title="Khôi phục tone gốc"
                >
                  Reset
                </button>
              )}
            </div>
          </>
        )}

        <Divider />

        {/* View controls (always visible toggle visuals) */}
        <div className="flex items-center">
          <IconButton 
            onClick={() => onToggleChords?.(!chordsVisible)} 
            title={chordsVisible ? "Ẩn hợp âm" : "Hiện hợp âm"} 
            icon={chordsVisible ? Eye : EyeOff} 
            active={chordsVisible}
          />
          <IconButton onClick={onZoomOut} title="Thu nhỏ" icon={ZoomOut} />
          <IconButton onClick={onZoomIn} title="Phóng to" icon={ZoomIn} />
          {onToggleColumns && (
            <IconButton 
              onClick={onToggleColumns} 
              title={isTwoColumns ? "Hủy chia 2 cột" : "Chia 2 cột hiển thị"} 
              icon={Columns2} 
              active={isTwoColumns}
            />
          )}
        </div>

        {isEditor && (
          <>
            <Divider />

            {/* Feature Tools */}
            <button
              onClick={onAutoDetect}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 hover:bg-purple-100 dark:hover:bg-purple-900/40 font-medium transition-all text-sm"
              title="Tự động dò hợp âm"
            >
              <Music className="w-4 h-4" />
              <span className="hidden sm:inline">Dò tự động</span>
            </button>

            {/* Actions - Save always pushed to edge */}
            <div className="ml-auto">
              <button
                onClick={onSave}
                className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-green-600 hover:bg-green-700 text-white font-medium transition-all text-sm shadow-sm active:scale-95"
                title="Lưu"
              >
                <Save className="w-4 h-4" />
                <span className="hidden sm:inline">Lưu</span>
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

