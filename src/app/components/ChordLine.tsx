import { useState } from "react";
import { MessageSquare } from "lucide-react";
import { Chord, LyricLine } from "../data/mockSongs";
import { transposeChord } from "../utils/chordUtils";

interface ChordLineProps {
  line: LyricLine;
  isEditing?: boolean;
  onAddNote?: (lineId: string, note: string) => void;
  currentTime?: number; // Thời gian hiện tại của player (giây)
  transposeOffset?: number; // Số bước transpose (nửa cung)
  chordsVisible?: boolean; // Ẩn/hiện hợp âm
}

export default function ChordLine({ 
  line, 
  isEditing = false, 
  onAddNote,
  currentTime = 0,
  transposeOffset = 0,
  chordsVisible = true
}: ChordLineProps) {
  const [showNoteInput, setShowNoteInput] = useState(false);
  const [noteText, setNoteText] = useState(line.note || "");

  // Tạo array các vị trí để hiển thị hợp âm
  const renderLine = () => {
    const chordPositions: { [key: number]: Chord[] } = {};
    
    // Group chords by position
    line.chords.forEach(chord => {
      let pos = chord.position;
      
      // Đảm bảo không cắt vào giữa từ: nếu đang ở giữa từ, lùi về chữ cái đầu tiên của từ
      if (line.text[pos] !== ' ' && pos < line.text.length) {
        while (pos > 0 && line.text[pos - 1] !== ' ') {
          pos--;
        }
      }

      if (!chordPositions[pos]) {
        chordPositions[pos] = [];
      }
      chordPositions[pos].push(chord);
    });

    const chars = line.text.split('');
    const elements: JSX.Element[] = [];
    
    // Render helper cho các hợp âm tại 1 vị trí
    const renderChords = (chords: Chord[], positionIndex: number) => {
      if (!chordsVisible) return [];
      
      return chords.map((chord, idx) => {
        const isActive = chord.timestamp !== undefined && 
          currentTime >= chord.timestamp && 
          currentTime < (chord.timestamp + 2); // Active for 2 seconds
        
        return (
          <span
            key={`chord-${positionIndex}-${idx}`}
            className={`inline-block mx-0.5 font-bold transition-all text-[1em] ${
              isActive
                ? "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 scale-110 rounded"
                : "text-red-600 dark:text-red-400"
            }`}
          >
            [{transposeChord(chord.name, transposeOffset)}]
          </span>
        );
      });
    };

    let currentText = "";
    
    for (let i = 0; i <= chars.length; i++) {
      if (chordPositions[i]) {
        if (currentText) {
          elements.push(<span key={`text-${i}`}>{currentText}</span>);
          currentText = "";
        }
        elements.push(...renderChords(chordPositions[i], i));
      }
      
      if (i < chars.length) {
        currentText += chars[i];
      }
    }
    
    if (currentText) {
      elements.push(<span key={`text-end`}>{currentText}</span>);
    }
    
    return elements;
  };

  const handleSaveNote = () => {
    if (onAddNote) {
      onAddNote(line.id, noteText);
    }
    setShowNoteInput(false);
  };

  return (
    <div className="group relative py-3 px-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
      <div className="flex items-start gap-3">
        {/* Line content */}
        <div className="flex-1">
          <div className="text-gray-800 dark:text-gray-200 leading-relaxed font-sans text-[1em] whitespace-pre-wrap">
            {renderLine()}
          </div>
          
          {/* Note display */}
          {line.note && !showNoteInput && (
            <div className="mt-2 p-2 bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-400 rounded text-sm text-gray-700 dark:text-gray-300">
              💡 {line.note}
            </div>
          )}

          {/* Note input */}
          {showNoteInput && (
            <div className="mt-2 p-3 bg-gray-100 dark:bg-gray-800 rounded-lg">
              <textarea
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                placeholder="Thêm ghi chú cho dòng này..."
                className="w-full p-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-500 resize-none outline-none focus:ring-2 focus:ring-blue-500"
                rows={2}
                autoFocus
              />
              <div className="flex gap-2 mt-2">
                <button
                  onClick={handleSaveNote}
                  className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm transition-colors"
                >
                  Lưu
                </button>
                <button
                  onClick={() => {
                    setShowNoteInput(false);
                    setNoteText(line.note || "");
                  }}
                  className="px-3 py-1 bg-gray-300 hover:bg-gray-400 dark:bg-gray-600 dark:hover:bg-gray-500 text-gray-900 dark:text-gray-100 rounded text-sm transition-colors"
                >
                  Hủy
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Note button */}
        {isEditing && (
          <button
            onClick={() => setShowNoteInput(!showNoteInput)}
            className={`p-2 rounded-lg transition-all ${
              line.note || showNoteInput
                ? "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400"
                : "bg-gray-100 dark:bg-gray-800 text-gray-400 opacity-0 group-hover:opacity-100"
            }`}
            title="Thêm ghi chú"
          >
            <MessageSquare className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}
