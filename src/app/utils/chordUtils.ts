export const notesSharps = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
export const notesFlats = ["C", "Db", "D", "Eb", "E", "F", "Gb", "G", "Ab", "A", "Bb", "B"];

/**
 * Dịch giọng (transpose) một hợp âm lên hoặc xuống N nửa cung
 */
export const transposeChord = (chord: string, step: number): string => {
  if (!chord || step === 0) return chord;
  
  // Tìm nốt gốc (VD: C#, Db, A) và phần mở rộng (m, 7, maj7, v.v.)
  const match = chord.match(/^([CDEFGAB][#b]?)(.*)$/);
  if (!match) return chord; // Không nhận diện được, giữ nguyên

  const root = match[1];
  const suffix = match[2];

  let rootIndex = notesSharps.indexOf(root);
  let useFlats = false;

  if (rootIndex === -1) {
    rootIndex = notesFlats.indexOf(root);
    useFlats = true;
  }
  
  if (rootIndex === -1) return chord;

  // Tính toán index mới (đảm bảo không bị âm bằng cách cộng một bội số lớn của 12)
  const newIndex = (rootIndex + step + 120) % 12;

  // Lấy nốt mới tương ứng
  const transposedRoot = useFlats ? notesFlats[newIndex] : notesSharps[newIndex];

  return transposedRoot + suffix;
};

// ======================================
// Trình chuyển đổi Text và Cấu trúc Lời
// ======================================

import { LyricLine, Chord } from "../data/mockSongs";

/**
 * Chuyển LyricLine[] thành Raw Text (có ngoặc vuông hợp âm [C])
 */
export const lyricsToRawText = (lines: LyricLine[]): string => {
  return lines.map(line => {
    let result = line.text;
    // Chèn từ sau về trước để không làm sai lệch vị trí index
    const sortedChords = [...line.chords].sort((a, b) => b.position - a.position);
    for (const chord of sortedChords) {
      result = result.slice(0, chord.position) + `[${chord.name}]` + result.slice(chord.position);
    }
    return result;
  }).join('\n');
};

/**
 * Phân tách Raw Text (có ngoặc vuông) thành LyricLine[]
 */
export const rawTextToLyrics = (rawText: string, oldLines: LyricLine[]): LyricLine[] => {
  return rawText.split('\n').map((lineStr, index) => {
    const chords: Chord[] = [];
    let text = "";
    let inBracket = false;
    let currentChord = "";
    let textPos = 0;

    for (let i = 0; i < lineStr.length; i++) {
      const char = lineStr[i];
      if (char === '[') {
        inBracket = true;
        currentChord = "";
      } else if (char === ']' && inBracket) {
        inBracket = false;
        // Nếu tên hợp âm rỗng thì bỏ qua
        if (currentChord.trim()) {
          chords.push({ position: textPos, name: currentChord.trim(), isPrimary: true });
        }
      } else {
        if (inBracket) {
          currentChord += char;
        } else {
          text += char;
          textPos++;
        }
      }
    }

    const oldLine = oldLines[index];
    return {
      id: oldLine ? oldLine.id : Date.now() + '-' + index,
      text,
      chords,
      note: oldLine ? oldLine.note : undefined
    };
  });
};
