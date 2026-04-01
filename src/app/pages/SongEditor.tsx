import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router";
import Header from "../components/Header";
import Footer from "../components/Footer";
import ChordLine from "../components/ChordLine";
import ChordToolbar from "../components/ChordToolbar";
import MusicPlayer from "../components/MusicPlayer";
import { getSongById, saveSong } from "../lib/songsService";
import type { Song, LyricLine } from "../lib/songsService";
import { ArrowLeft, Info, Music, Edit3, Square, CheckSquare, Loader2 } from "lucide-react";
import { transposeChord, lyricsToRawText, rawTextToLyrics } from "../utils/chordUtils";
import { useAuth } from "../utils/AuthContext";


export default function SongEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, openAuthModal } = useAuth();

  const [song, setSong] = useState<Song | null>(null);
  const [songLoading, setSongLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [chordsVisible, setChordsVisible] = useState(true);
  const [fontSize, setFontSize] = useState(16);
  const [history, setHistory] = useState<Song[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [showKeyDialog, setShowKeyDialog] = useState(false);
  const [selectedKey, setSelectedKey] = useState("");
  const [transposeOffset, setTransposeOffset] = useState(0);
  const [isTwoColumns, setIsTwoColumns] = useState(false);
  const [isRawMode, setIsRawMode] = useState(id === "new");
  const [rawText, setRawText] = useState("");
  const [autoBracket, setAutoBracket] = useState(true);

  // Derive if current user is the author
  const isEditor = user != null && ((song && song.authorId === user.id) || id === "new");

  useEffect(() => {
    async function loadSong() {
      if (id && id !== "new") {
        const foundSong = await getSongById(id);
        if (foundSong) {
          setSong(foundSong);
          setSelectedKey(foundSong.key);
          setHistory([foundSong]);
          setHistoryIndex(0);
        } else {
          navigate("/");
        }
        setSongLoading(false);
      } else {
        if (!user) {
          openAuthModal("login");
          navigate("/");
          return;
        }
        // New song template
        const newSong: Song = {
          id: "new",
          title: "Bài hát mới",
          artist: "Nghệ sĩ",
          key: "C",
          duration: "0:00",
          genre: "Pop",
          thumbnail: "https://images.unsplash.com/photo-1762917903361-99e0164dbcc5",
          lyrics: [{ id: "1", text: "Nhập lời bài hát tại đây...", chords: [] }],
          createdAt: new Date().toISOString().split('T')[0],
          updatedAt: new Date().toISOString().split('T')[0],
          authorId: user.id,
        };
        setSong(newSong);
        setSelectedKey(newSong.key);
        setHistory([newSong]);
        setHistoryIndex(0);
        setSongLoading(false);
      }
    }
    loadSong();
  }, [id, navigate, user, openAuthModal]);

  // Khởi tạo raw text khi chuyển mode hoặc đổi bài
  useEffect(() => {
    if (song && isRawMode) {
      setRawText(lyricsToRawText(song.lyrics));
    }
  }, [isRawMode, song?.id]);

  const handleRawTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setRawText(val);
    
    // Đồng bộ lại vào song.lyrics
    if (song) {
      const parsedLyrics = rawTextToLyrics(val, song.lyrics);
      setSong({ ...song, lyrics: parsedLyrics });
    }
  };

  const handleRawTextKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (!autoBracket) return;
    
    // Kích hoạt khi bấm phím khoảng trắng (Space)
    if (e.key === ' ') {
      const el = e.currentTarget;
      const val = el.value;
      const curPos = el.selectionStart;

      // Tìm từ gần nhất ngay trước con trỏ
      const textBefore = val.slice(0, curPos);
      const lastSpace = textBefore.lastIndexOf(' ');
      const lastNewline = textBefore.lastIndexOf('\n');
      const wordStart = Math.max(lastSpace, lastNewline) + 1;
      
      const word = textBefore.slice(wordStart);
      
      // Regex nhận diện cấu trúc hợp âm chuẩn
      const chordRegex = new RegExp("^[CDEFGAB][#b]?(m|maj|min|dim|aug|sus)?\\d*(/[CDEFGAB][#b]?)?$");
      
      // Khớp được thì bọc trong []
      if (chordRegex.test(word)) {
        e.preventDefault(); // Ngăn nhập space tự động để chủ động chèn sau bracket
        
        const newText = val.slice(0, wordStart) + `[${word}] ` + val.slice(curPos);
        setRawText(newText);
        
        if (song) {
          const parsedLyrics = rawTextToLyrics(newText, song.lyrics);
          setSong({ ...song, lyrics: parsedLyrics });
        }
        
        // Đặt lại con trỏ, cần dùng setTimeout do React state batching
        const newCursor = wordStart + word.length + 3; // +2 for [], +1 for space
        setTimeout(() => {
          el.selectionStart = el.selectionEnd = newCursor;
        }, 0);
      }
    }
  };

  const addToHistory = (newSong: Song) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(newSong);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
    setSong(newSong);
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setSong(history[historyIndex - 1]);
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      setSong(history[historyIndex + 1]);
    }
  };

  const handleSave = async () => {
    if (!song || !user) return;
    const result = await saveSong(song, user.id);
    if (result.success) {
      alert("Đã lưu bài hát thành công!");
      // If it was a new song, navigate to the real ID
      if (id === "new" && result.id) {
        navigate(`/editor/${result.id}`, { replace: true });
      }
    } else {
      alert(`Lỗi khi lưu: ${result.error}`);
    }
  };

  const handleAddNote = (lineId: string, note: string) => {
    if (!song) return;
    
    const newSong = {
      ...song,
      lyrics: song.lyrics.map((line) =>
        line.id === lineId ? { ...line, note } : line
      ),
    };
    addToHistory(newSong);
  };

  const handleChangeKey = () => {
    setShowKeyDialog(true);
  };

  const applyKeyChange = () => {
    if (!song || selectedKey === song.key) {
      setShowKeyDialog(false);
      return;
    }

    // This is a simplified key change - in real app, would transpose chords
    const newSong = { ...song, key: selectedKey };
    addToHistory(newSong);
    setShowKeyDialog(false);
    alert(`Đã chuyển key từ ${song.key} sang ${selectedKey}`);
  };

  const handleAutoDetect = () => {
    alert(
      "Tính năng tự động dò hợp âm đang được phát triển.\n\n" +
      "Tính năng này sẽ:\n" +
      "- Upload file âm thanh hoặc ghi âm từ microphone\n" +
      "- Sử dụng AI để nhận diện hợp âm\n" +
      "- Tự động thêm hợp âm vào đúng thời điểm"
    );
  };

  const handleZoomIn = () => {
    setFontSize(Math.min(fontSize + 2, 24));
  };

  const handleZoomOut = () => {
    setFontSize(Math.max(fontSize - 2, 12));
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

  const keys = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
  
  // Tính toán tất cả các hợp âm có trong bài
  const songChords = Array.from(
    new Set(
      song.lyrics.flatMap((line) => line.chords.map((c) => 
        transposeChord(c.name, transposeOffset)
      ))
    )
  ).filter(Boolean);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <Header />

      <main className="flex-1 w-full px-4 sm:px-6 lg:px-8 py-6 mx-auto">
        {/* Back button */}
        <Link
          to="/songs"
          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Quay lại danh sách</span>
        </Link>

        {/* Cấu trúc grid mở rộng: Editor chiếm 1 phần hoặc nhiều phần tùy screen */}
        <div className="grid xl:grid-cols-4 lg:grid-cols-3 gap-6">
          {/* Main editor area */}
          <div className="xl:col-span-3 lg:col-span-2 space-y-4">
            {/* Song info */}
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
              <div className="flex items-start gap-4">
                <div className="flex-1">
                  <input
                    type="text"
                    value={song.title}
                    readOnly={!isEditor}
                    onChange={(e) => {
                      if (!isEditor) return;
                      const newSong = { ...song, title: e.target.value };
                      setSong(newSong);
                    }}
                    className={`text-2xl font-bold text-gray-900 dark:text-white mb-2 w-full bg-transparent border-none ${isEditor ? "outline-none focus:ring-2 focus:ring-blue-500" : "outline-none cursor-default focus:ring-0"} rounded px-2`}
                  />
                  <input
                    type="text"
                    value={song.artist}
                    readOnly={!isEditor}
                    onChange={(e) => {
                      if (!isEditor) return;
                      const newSong = { ...song, artist: e.target.value };
                      setSong(newSong);
                    }}
                    className={`text-gray-600 dark:text-gray-400 w-full bg-transparent border-none ${isEditor ? "outline-none focus:ring-2 focus:ring-blue-500" : "outline-none cursor-default focus:ring-0"} rounded px-2`}
                  />
                  <div className="flex gap-4 mt-3 text-sm">
                    <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full font-medium">
                      Key: {transposeChord(song.key, transposeOffset)}
                      {transposeOffset !== 0 && ` (Gốc: ${song.key})`}
                    </span>
                    <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full">
                      {song.genre}
                    </span>
                  </div>
                  <div className="mt-4">
                    {(song.note || isEditor) && (
                      <>
                        <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1 uppercase tracking-wider">
                          Ghi chú đầu trang (Tone, Intro...)
                        </label>
                        {isEditor ? (
                          <textarea
                            value={song.note || ""}
                            onChange={(e) => {
                              const newSong = { ...song, note: e.target.value };
                              setSong(newSong);
                            }}
                            placeholder="Nhập phần Intro hoặc Note đầu trang..."
                            className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded p-3 text-sm text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-blue-500 outline-none resize-y min-h-[80px]"
                          />
                        ) : (
                          <div className="w-full bg-transparent border border-transparent rounded px-2 py-3 text-sm text-gray-800 dark:text-gray-200 whitespace-pre-wrap">
                            {song.note}
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Toolbar */}
            <ChordToolbar
              currentKey={song.key}
              transposeOffset={transposeOffset}
              onTransposeOffsetChange={setTransposeOffset}
              onUndo={handleUndo}
              onRedo={handleRedo}
              onSave={handleSave}
              onAddChord={() => alert("Tính năng thêm hợp âm đang được phát triển")}
              onDeleteChord={() => alert("Tính năng xóa hợp âm đang được phát triển")}
              onToggleChords={setChordsVisible}
              onZoomIn={handleZoomIn}
              onZoomOut={handleZoomOut}
              onAutoDetect={handleAutoDetect}
              chordsVisible={chordsVisible}
              canUndo={historyIndex > 0}
              canRedo={historyIndex < history.length - 1}
              isTwoColumns={isTwoColumns && !isRawMode} // Chỉ chia cột ở dạng visual
              onToggleColumns={() => setIsTwoColumns(!isTwoColumns)}
              isEditor={isEditor}
            />

            {/* Edit Mode Toggle & Options (Author only) */}
            {isEditor && (
              <div className="flex flex-wrap items-center justify-between gap-4 bg-gray-100 dark:bg-gray-800 p-3 rounded-lg border border-gray-200 dark:border-gray-700">
              <div className="flex gap-2">
                <button
                  onClick={() => setIsRawMode(true)}
                  className={`px-4 py-2 rounded-md font-medium text-sm flex items-center gap-2 transition-colors ${
                    isRawMode 
                      ? "bg-blue-600 text-white shadow-sm" 
                      : "bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600"
                  }`}
                >
                  <Edit3 className="w-4 h-4" />
                  Sửa Lời & Hợp âm
                </button>
                <button
                  onClick={() => setIsRawMode(false)}
                  className={`px-4 py-2 rounded-md font-medium text-sm flex items-center gap-2 transition-colors ${
                    !isRawMode 
                      ? "bg-blue-600 text-white shadow-sm" 
                      : "bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600"
                  }`}
                >
                  <Music className="w-4 h-4" />
                  Xem trước / Ghi chú
                </button>
              </div>

              {isRawMode && (
                <button
                  onClick={() => setAutoBracket(!autoBracket)}
                  className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  {autoBracket ? (
                    <CheckSquare className="w-5 h-5 text-blue-600" />
                  ) : (
                    <Square className="w-5 h-5 text-gray-400" />
                  )}
                  Tự động đóng ngoặc vuông [] (khi cách chữ)
                </button>
              )}
            </div>
          )}

            {/* Lyrics editor Content */}
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
              {isRawMode ? (
                <textarea
                  value={rawText}
                  onChange={handleRawTextChange}
                  onKeyDown={handleRawTextKeyDown}
                  className="w-full min-h-[500px] border-none outline-none resize-y bg-transparent text-gray-800 dark:text-gray-200 font-mono leading-relaxed"
                  style={{ fontSize: `${Math.max(14, fontSize - 2)}px` }}
                  spellCheck={false}
                  placeholder="[G] Ngày thay [C/G] đêm, vội [G] trôi giấc [D/F#] mơ êm... &#10;Bạn gõ 'C ' => Tự bọc thành '[C] '"
                />
              ) : (
                <div 
                  className={`transition-all ${isTwoColumns ? 'md:columns-2 gap-8' : ''}`} 
                  style={{ fontSize: `${fontSize}px` }}
                >
                  {song.lyrics.map((line) => (
                    <div key={line.id} className="break-inside-avoid-column mb-2">
                      <ChordLine
                        line={line}
                        isEditing={isEditor}
                        onAddNote={handleAddNote}
                        currentTime={currentTime}
                        chordsVisible={chordsVisible}
                        transposeOffset={transposeOffset}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Player */}
            <MusicPlayer
              audioUrl={song.audioUrl}
              duration={song.duration}
              onTimeUpdate={setCurrentTime}
              title={song.title}
              artist={song.artist}
            />

            {/* Chords in song */}
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-4">
                <Music className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <h3 className="font-semibold text-gray-900 dark:text-white">Hợp âm trong bài ({songChords.length})</h3>
              </div>
              {songChords.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {songChords.map((chord) => (
                    <span
                      key={chord}
                      className="px-3 py-1.5 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded text-sm font-semibold border border-gray-200 dark:border-gray-600"
                    >
                      {chord}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500 dark:text-gray-400 italic">
                  Chưa có hợp âm nào.
                </p>
              )}
            </div>

            {/* Info panel moved to bottom */}
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-4">
                <Info className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <h3 className="font-semibold text-gray-900 dark:text-white">Thông tin</h3>
              </div>
              <div className="space-y-3 text-sm">
                <div>
                  <div className="text-gray-500 dark:text-gray-400">Tạo lúc</div>
                  <div className="text-gray-900 dark:text-white">{song.createdAt}</div>
                </div>
                <div>
                  <div className="text-gray-500 dark:text-gray-400">Cập nhật</div>
                  <div className="text-gray-900 dark:text-white">{song.updatedAt}</div>
                </div>
                <div>
                  <div className="text-gray-500 dark:text-gray-400">Số dòng</div>
                  <div className="text-gray-900 dark:text-white">{song.lyrics.length} dòng</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Key change dialog */}
      {showKeyDialog && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full p-6">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Thay đổi Key
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Chọn key mới cho bài hát. Hợp âm sẽ được chuyển đổi tự động.
            </p>
            <div className="grid grid-cols-4 gap-2 mb-6">
              {keys.map((key) => (
                <button
                  key={key}
                  onClick={() => setSelectedKey(key)}
                  className={`px-4 py-3 rounded-lg font-semibold transition-colors ${
                    selectedKey === key
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600"
                  }`}
                >
                  {key}
                </button>
              ))}
            </div>
            <div className="flex gap-3">
              <button
                onClick={applyKeyChange}
                className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
              >
                Áp dụng
              </button>
              <button
                onClick={() => {
                  setShowKeyDialog(false);
                  setSelectedKey(song.key);
                }}
                className="flex-1 px-4 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-white rounded-lg font-medium transition-colors"
              >
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
