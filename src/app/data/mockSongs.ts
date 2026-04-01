export interface Chord {
  name: string;
  position: number; // Vị trí trong lyrics line
  isPrimary: boolean; // Hợp âm chính hay phụ
  timestamp?: number; // Thời gian trong bài hát (giây)
}

export interface LyricLine {
  id: string;
  text: string;
  chords: Chord[];
  note?: string; // Ghi chú cho dòng này
}

export interface Song {
  id: string;
  title: string;
  artist: string;
  key: string;
  duration: string; // Format: "mm:ss"
  genre: string;
  thumbnail: string;
  note?: string; // Ghi chú đầu trang (VD: Intro, Info)
  lyrics: LyricLine[];
  audioUrl?: string;
  createdAt: string;
  updatedAt: string;
  authorId?: string; // Tạm dùng để phân biệt người đăng
}

export const mockSongs: Song[] = [
  {
    id: "1",
    title: "Nơi này có anh",
    artist: "Sơn Tùng M-TP",
    key: "C",
    duration: "4:32",
    genre: "Pop",
    thumbnail: "https://images.unsplash.com/photo-1762917903361-99e0164dbcc5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtdXNpY2lhbiUyMGJhbmQlMjBtdXNpYyUyMHBlcmZvcm1hbmNlfGVufDF8fHx8MTc3NDg1NTQ2MHww&ixlib=rb-4.1.0&q=80&w=1080",
    lyrics: [
      {
        id: "1-1",
        text: "Em là ai từ đâu bước đến nơi đây dịu dàng chân phương",
        chords: [
          { name: "C", position: 0, isPrimary: true, timestamp: 0 },
          { name: "Am", position: 15, isPrimary: false, timestamp: 2 },
          { name: "F", position: 35, isPrimary: true, timestamp: 4 },
          { name: "G", position: 50, isPrimary: false, timestamp: 6 }
        ],
      },
      {
        id: "1-2",
        text: "Làm nhòe khung trời trong xanh phơi phới ngày hè mong manh",
        chords: [
          { name: "C", position: 0, isPrimary: true, timestamp: 8 },
          { name: "Em", position: 20, isPrimary: false, timestamp: 10 },
          { name: "Dm", position: 40, isPrimary: false, timestamp: 12 },
          { name: "G7", position: 55, isPrimary: true, timestamp: 14 }
        ],
      },
      {
        id: "1-3",
        text: "Mùa thu có đến hay không nơi này có anh",
        chords: [
          { name: "Am", position: 0, isPrimary: true, timestamp: 16 },
          { name: "F", position: 25, isPrimary: true, timestamp: 18 },
          { name: "C", position: 45, isPrimary: false, timestamp: 20 }
        ],
      },
      {
        id: "1-4",
        text: "Có cả bầu trời trong mình",
        chords: [
          { name: "G", position: 0, isPrimary: true, timestamp: 22 },
          { name: "Am", position: 15, isPrimary: false, timestamp: 24 }
        ],
      },
    ],
    createdAt: "2026-03-15",
    updatedAt: "2026-03-25",
    authorId: "user1",
  },
  {
    id: "2",
    title: "Anh ơi ở lại",
    artist: "Chi Pu",
    key: "G",
    duration: "3:45",
    genre: "Ballad",
    thumbnail: "https://images.unsplash.com/photo-1591680443128-5d3b1eb3b84b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhY291c3RpYyUyMGd1aXRhciUyMGNob3Jkc3xlbnwxfHx8fDE3NzQ4NTU0NjB8MA&ixlib=rb-4.1.0&q=80&w=1080",
    lyrics: [
      {
        id: "2-1",
        text: "Anh ơi ở lại đây đừng về",
        chords: [
          { name: "G", position: 0, isPrimary: true, timestamp: 0 },
          { name: "D", position: 12, isPrimary: false, timestamp: 2 },
          { name: "Em", position: 23, isPrimary: true, timestamp: 4 }
        ],
      },
      {
        id: "2-2",
        text: "Em xin anh đấy một lần nữa thôi",
        chords: [
          { name: "C", position: 0, isPrimary: true, timestamp: 6 },
          { name: "G", position: 15, isPrimary: false, timestamp: 8 },
          { name: "D", position: 30, isPrimary: true, timestamp: 10 }
        ],
      },
      {
        id: "2-3",
        text: "Dù cho mai sau có xa vời",
        chords: [
          { name: "Em", position: 0, isPrimary: true, timestamp: 12 },
          { name: "Bm", position: 15, isPrimary: false, timestamp: 14 },
          { name: "C", position: 27, isPrimary: false, timestamp: 16 }
        ],
      },
    ],
    createdAt: "2026-03-10",
    updatedAt: "2026-03-20",
    authorId: "user2",
  },
  {
    id: "3",
    title: "Lạc trôi",
    artist: "Sơn Tùng M-TP",
    key: "Am",
    duration: "4:05",
    genre: "EDM",
    thumbnail: "https://images.unsplash.com/photo-1643940881576-459719634a4b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsaXZlJTIwbXVzaWMlMjBjb25jZXJ0JTIwYmFuZHxlbnwxfHx8fDE3NzQ4NTU0NjF8MA&ixlib=rb-4.1.0&q=80&w=1080",
    lyrics: [
      {
        id: "3-1",
        text: "Trong những phút giây ngắn ngủi còn lại",
        chords: [
          { name: "Am", position: 0, isPrimary: true, timestamp: 0 },
          { name: "F", position: 20, isPrimary: false, timestamp: 2 },
          { name: "C", position: 35, isPrimary: true, timestamp: 4 }
        ],
      },
      {
        id: "3-2",
        text: "Hãy quên đi những gì phiền muộn",
        chords: [
          { name: "G", position: 0, isPrimary: true, timestamp: 6 },
          { name: "Am", position: 18, isPrimary: false, timestamp: 8 },
          { name: "Em", position: 33, isPrimary: false, timestamp: 10 }
        ],
      },
    ],
    createdAt: "2026-03-05",
    updatedAt: "2026-03-18",
    authorId: "user1",
  },
  {
    id: "4",
    title: "Em của ngày hôm qua",
    artist: "Sơn Tùng M-TP",
    key: "D",
    duration: "5:12",
    genre: "Pop",
    thumbnail: "https://images.unsplash.com/photo-1637071220527-fbb98fa15892?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtdXNpYyUyMHN0dWRpbyUyMHJlY29yZGluZ3xlbnwxfHx8fDE3NzQ4MzYxMDV8MA&ixlib=rb-4.1.0&q=80&w=1080",
    lyrics: [
      {
        id: "4-1",
        text: "Một ngày em sẽ đến bên tôi bảo rằng",
        chords: [
          { name: "D", position: 0, isPrimary: true, timestamp: 0 },
          { name: "A", position: 15, isPrimary: false, timestamp: 2 },
          { name: "Bm", position: 30, isPrimary: true, timestamp: 4 },
          { name: "G", position: 42, isPrimary: false, timestamp: 6 }
        ],
      },
      {
        id: "4-2",
        text: "Em rất nhớ anh chẳng thể chịu nổi nữa rồi",
        chords: [
          { name: "D", position: 0, isPrimary: true, timestamp: 8 },
          { name: "A", position: 12, isPrimary: false, timestamp: 10 },
          { name: "G", position: 28, isPrimary: false, timestamp: 12 },
          { name: "A", position: 43, isPrimary: true, timestamp: 14 }
        ],
      },
    ],
    createdAt: "2026-02-28",
    updatedAt: "2026-03-12",
    authorId: "user2",
  },
];

// Helper functions để làm việc với localStorage
const DATA_VERSION = "v2"; // Bump this when mockSongs seed data changes

export const getSongs = (): Song[] => {
  if (typeof window === 'undefined') return mockSongs;
  
  const storedVersion = localStorage.getItem('chordify-songs-version');
  if (storedVersion !== DATA_VERSION) {
    // Seed data changed, reset
    localStorage.setItem('chordify-songs', JSON.stringify(mockSongs));
    localStorage.setItem('chordify-songs-version', DATA_VERSION);
    return mockSongs;
  }

  const stored = localStorage.getItem('chordify-songs');
  if (stored) {
    return JSON.parse(stored);
  }
  localStorage.setItem('chordify-songs', JSON.stringify(mockSongs));
  return mockSongs;
};

export const getSongById = (id: string): Song | undefined => {
  const songs = getSongs();
  return songs.find(song => song.id === id);
};

export const saveSong = (song: Song): void => {
  const songs = getSongs();
  const index = songs.findIndex(s => s.id === song.id);
  
  if (index >= 0) {
    songs[index] = { ...song, updatedAt: new Date().toISOString().split('T')[0] };
  } else {
    songs.push(song);
  }
  
  localStorage.setItem('chordify-songs', JSON.stringify(songs));
};

export const deleteSong = (id: string): void => {
  const songs = getSongs();
  const filtered = songs.filter(s => s.id !== id);
  localStorage.setItem('chordify-songs', JSON.stringify(filtered));
};
