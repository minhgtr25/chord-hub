import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router";
import Header from "../components/Header";
import ChordLine from "../components/ChordLine";
import MusicPlayer from "../components/MusicPlayer";
import { getSongById } from "../lib/songsService";
import type { Song } from "../lib/songsService";
import { ArrowLeft, Music2, User, Columns2, Type, ChevronDown, ChevronUp, Edit3 } from "lucide-react";
import { transposeChord } from "../utils/chordUtils";
import { useAuth } from "../utils/AuthContext";
import { useToast } from "../utils/ToastContext";

export default function SongViewer() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [song, setSong] = useState<Song | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [transposeOffset, setTransposeOffset] = useState(0);
  const [chordsVisible, setChordsVisible] = useState(true);
  const [isTwoColumns, setIsTwoColumns] = useState(false);
  const [fontSize, setFontSize] = useState(16);
  const [scrollSpeed, setScrollSpeed] = useState(0);

  const { user } = useAuth();
  const isAuthor = !!(user && song?.authorId === user.id);

  // Auto-scroll logic
  useEffect(() => {
    let animationFrameId: number;
    let lastTime = performance.now();
    let accumulatedScroll = 0;

    const scroll = (time: number) => {
      if (scrollSpeed !== 0) {
        const deltaTime = time - lastTime;
        // Tốc độ: speed 1 khoảng 12px/s
        const scrollAmount = (scrollSpeed * 12 * deltaTime) / 1000;
        
        accumulatedScroll += scrollAmount;
        if (Math.abs(accumulatedScroll) >= 1) {
          const pixels = Math.floor(accumulatedScroll);
          window.scrollBy(0, pixels);
          accumulatedScroll -= pixels;
        }
      }
      lastTime = time;
      animationFrameId = requestAnimationFrame(scroll);
    };

    if (scrollSpeed !== 0) {
      animationFrameId = requestAnimationFrame(scroll);
    }

    return () => cancelAnimationFrame(animationFrameId);
  }, [scrollSpeed]);

  useEffect(() => {
    async function load() {
      if (id) {
        const foundSong = await getSongById(id);
        if (foundSong) {
          setSong(foundSong);
        } else {
          navigate("/");
        }
      }
    }
    load();
  }, [id, navigate]);

  const handleAddNote = (_lineId: string, _note: string) => {
    // Notes are view-only; no save needed in viewer
  };

  if (!song) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Đang tải...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <Header />

      <main className="flex-1">
        {/* Song header - Sticky */}
        <div className="sticky top-16 z-40 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="w-full px-4 py-4">
            <Link
              to="/songs"
              className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 mb-3"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="text-sm">Quay lại danh sách</span>
            </Link>

            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <h1 className="text-xl font-bold text-gray-900 dark:text-white truncate">
                  {song.title}
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                  {song.artist}
                </p>
                <div className="flex gap-2 mt-2">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full text-xs font-medium">
                    <Music2 className="w-3 h-3" />
                    {song.key}
                  </span>
                  <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-xs">
                    {song.genre}
                  </span>
                </div>
              </div>

              {/* Nút Edit/Hợp âm của tôi */}
              <Link
                to={`/editor/${song.id}`}
                className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition flex items-center gap-2 whitespace-nowrap hidden sm:flex"
              >
                <Edit3 className="w-4 h-4" />
                {isAuthor ? "Chỉnh sửa bài hát" : "Hợp âm của tôi"}
              </Link>
            </div>
          </div>
        </div>

        {/* Sub-Header / Toolbar: Kiểu thiết kế dạng thanh control */}
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-[97px] z-30 transition-shadow shadow-sm">
          <div className="w-full px-4 text-sm overflow-x-auto">
            <div className="flex flex-wrap items-center gap-3 py-3 w-max min-w-full">
              
              {/* Thanh chỉnh Key (+ / -) */}
              <div className="flex items-center gap-2">
                <span className="text-gray-500 font-medium hidden sm:inline-block">Tone:</span>
                <div className="flex items-center bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded">
                  <button 
                    onClick={() => setTransposeOffset(prev => prev - 1)}
                    className="px-2 py-1 text-blue-600 hover:bg-white dark:hover:bg-gray-600 font-bold border-r border-gray-300 dark:border-gray-600 transition-colors"
                    title="Giảm 1 nửa cung"
                  >
                    −
                  </button>
                  <div className="px-3 text-blue-600 dark:text-blue-400 font-medium min-w-[3.5rem] text-center whitespace-nowrap">
                    {transposeChord(song.key, transposeOffset)} 
                    {transposeOffset !== 0 && (
                      <span className="text-xs ml-0.5 opacity-80">
                        ({transposeOffset > 0 ? '+' : ''}{transposeOffset})
                      </span>
                    )}
                  </div>
                  <button 
                    onClick={() => setTransposeOffset(prev => prev + 1)}
                    className="px-2 py-1 text-blue-600 hover:bg-white dark:hover:bg-gray-600 font-bold border-l border-gray-300 dark:border-gray-600 transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>
              
              <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 hidden sm:block"></div>

              {/* Chỉnh cỡ chữ */}
              <div className="flex items-center gap-2">
                <Type className="w-4 h-4 text-gray-500 hidden sm:block" />
                <div className="flex items-center bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded">
                  <button 
                    onClick={() => setFontSize(Math.max(10, fontSize - 1))}
                    className="px-2 py-1 text-gray-700 hover:bg-white dark:text-gray-300 border-r border-gray-300 dark:border-gray-600 transition-colors"
                  >
                    −
                  </button>
                  <div className="px-3 font-medium min-w-[3.5rem] text-center text-gray-700 dark:text-gray-300">
                    {fontSize}pt
                  </div>
                  <button 
                    onClick={() => setFontSize(Math.min(32, fontSize + 1))}
                    className="px-2 py-1 text-gray-700 hover:bg-white dark:text-gray-300 border-l border-gray-300 dark:border-gray-600 transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 hidden sm:block"></div>

              {/* Cuộn trang (Auto-scroll) */}
              <div className="flex items-center gap-2">
                <span className="text-gray-500 font-medium whitespace-nowrap hidden sm:inline-block">Cuộn trang:</span>
                <div className="flex items-center bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded">
                  <button 
                    onClick={() => setScrollSpeed(Math.max(0, scrollSpeed - 1))}
                    className="px-2 cursor-pointer py-1 text-gray-700 hover:bg-white dark:text-gray-300 border-r border-gray-300 dark:border-gray-600 transition-colors"
                    title="Giảm tốc độ"
                    disabled={scrollSpeed === 0}
                  >
                    <ChevronUp className="w-4 h-4" />
                  </button>
                  <div className="px-3 font-medium min-w-[2.5rem] text-center text-gray-700 dark:text-gray-300">
                    {scrollSpeed > 0 ? scrollSpeed : 0}
                  </div>
                  <button 
                    onClick={() => setScrollSpeed(scrollSpeed + 1)}
                    className="px-2 cursor-pointer py-1 text-gray-700 hover:bg-white dark:text-gray-300 border-l border-gray-300 dark:border-gray-600 transition-colors"
                    title="Tăng tốc độ"
                  >
                    <ChevronDown className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="flex-1 min-w-[1rem]"></div>

              {/* Các nút toggle (Hợp âm / Chia đôi) */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsTwoColumns(!isTwoColumns)}
                  className={`flex items-center gap-2 px-3 py-1.5 border rounded-md font-medium transition-colors shadow-sm whitespace-nowrap ${
                    isTwoColumns 
                      ? "bg-blue-50 border-blue-300 text-blue-700 dark:bg-blue-900/40 dark:border-blue-700 dark:text-blue-300"
                      : "bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600"
                  }`}
                  title="Chia cột hiển thị dàn trải hai bên màn hình"
                >
                  <Columns2 className="w-4 h-4" />
                  <span className="hidden sm:inline">Chia cột</span>
                </button>

                <button
                   onClick={() => setChordsVisible(!chordsVisible)}
                   className="flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors shadow-sm whitespace-nowrap"
                >
                   {chordsVisible ? "Ẩn hợp âm" : "Hiện hợp âm"}
                </button>
              </div>

            </div>
          </div>
        </div>

        {/* Content */}
        <div className="w-full px-4 py-6">
          {/* Note đầu trang (Tone & Intro giống ảnh mẫu) */}
          <div className="bg-[#fff9e6] dark:bg-yellow-900/10 border border-dashed border-gray-400 dark:border-gray-600 p-4 mb-6 rounded text-sm text-gray-800 dark:text-gray-200 shadow-sm">
            <div className="mb-2 italic">
              Tone <span className="text-red-600 dark:text-red-400 font-semibold">[{transposeChord(song.key, transposeOffset)}]</span>
              {transposeOffset !== 0 && ` (Tone gốc ${song.key})`}
            </div>
            <div className="whitespace-pre-line leading-relaxed">
              {song.note || "Intro:\n[Cmaj7] [Bm7] [Am7] [D7] [Gmaj7]"}
            </div>
          </div>

          {/* Player */}
          <div className="mb-6">
            <MusicPlayer
              audioUrl={song.audioUrl}
              duration={song.duration}
              onTimeUpdate={setCurrentTime}
              title={song.title}
              artist={song.artist}
            />
          </div>

          {/* Instructions */}
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
            <p className="text-sm text-blue-900 dark:text-blue-100">
              💡 <strong>Gợi ý:</strong> Nhấn vào biểu tượng ghi chú để thêm chú thích cho từng dòng.
            </p>
          </div>

          {/* Lyrics */}
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 shadow-sm">
            <div 
              className={`transition-all ${isTwoColumns ? 'md:columns-2 gap-x-20 xl:gap-x-32' : ''}`}
            >
              <div style={{ fontSize: `${fontSize}px` }}>
                {song.lyrics.map((line) => (
                  <div key={line.id} className="break-inside-avoid-column mb-3">
                    <ChordLine
                      line={line}
                      onAddNote={handleAddNote}
                      currentTime={currentTime}
                      transposeOffset={transposeOffset}
                      chordsVisible={chordsVisible}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quick actions */}
          <div className="mt-6 flex gap-3">
            <Link
              to={`/editor/${song.id}`}
              className="hidden md:flex flex-1 items-center justify-center gap-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
            >
              <Music2 className="w-5 h-5" />
              <span>Chỉnh sửa</span>
            </Link>
            <button
              onClick={() => showToast("Tính năng chia sẻ đang được phát triển", "info")}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-white rounded-lg font-medium transition-colors"
            >
              <User className="w-5 h-5" />
              <span>Chia sẻ</span>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
