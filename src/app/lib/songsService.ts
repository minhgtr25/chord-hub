// ============================================================
// Supabase Songs Service
// Replaces localStorage-based mockSongs functions
// ============================================================

import { supabase } from "../lib/supabase";

// ── Types ────────────────────────────────────────────────────

export interface Chord {
  name: string;
  position: number;
  isPrimary: boolean;
  timestamp?: number;
}

export interface LyricLine {
  id: string;
  text: string;
  chords: Chord[];
  note?: string;
}

export interface Song {
  id: string;
  title: string;
  artist: string;
  key: string;
  duration: string;
  genre: string;
  thumbnail: string;
  note?: string;
  lyrics: LyricLine[];
  audioUrl?: string;
  authorId?: string;
  authorName?: string; // joined from profiles
  createdAt: string;
  updatedAt: string;
}

// ── DB row → Song ────────────────────────────────────────────

function rowToSong(row: Record<string, unknown>): Song {
  return {
    id: row.id as string,
    title: row.title as string,
    artist: row.artist as string,
    key: row.key as string,
    duration: row.duration as string || "0:00",
    genre: row.genre as string || "Pop",
    thumbnail: row.thumbnail as string || "https://images.unsplash.com/photo-1762917903361-99e0164dbcc5",
    note: row.note as string | undefined,
    lyrics: (row.lyrics as LyricLine[]) || [],
    audioUrl: row.audio_url as string | undefined,
    authorId: row.author_id as string,
    authorName: (row.profiles as Record<string, unknown>)?.name as string | undefined,
    createdAt: (row.created_at as string)?.split("T")[0] || "",
    updatedAt: (row.updated_at as string)?.split("T")[0] || "",
  };
}

// ── Read Operations ──────────────────────────────────────────

export async function getSongs(): Promise<Song[]> {
  const { data, error } = await supabase
    .from("songs")
    .select("*, profiles(name)")
    .order("updated_at", { ascending: false });

  if (error) {
    console.error("getSongs error:", error.message);
    return [];
  }
  return (data || []).map(rowToSong);
}

export async function getSongById(id: string): Promise<Song | null> {
  const { data, error } = await supabase
    .from("songs")
    .select("*, profiles(name)")
    .eq("id", id)
    .single();

  if (error || !data) return null;
  return rowToSong(data);
}

export async function getSongsByAuthor(authorId: string): Promise<Song[]> {
  const { data, error } = await supabase
    .from("songs")
    .select("*, profiles(name)")
    .eq("author_id", authorId)
    .order("updated_at", { ascending: false });

  if (error) return [];
  return (data || []).map(rowToSong);
}

// ── Write Operations ─────────────────────────────────────────

export async function saveSong(song: Song, authorId: string): Promise<{ success: boolean; id?: string; error?: string }> {
  const isNew = !song.id || song.id === "new";

  const payload = {
    title: song.title,
    artist: song.artist,
    key: song.key,
    duration: song.duration,
    genre: song.genre,
    thumbnail: song.thumbnail,
    note: song.note || null,
    lyrics: song.lyrics,
    audio_url: song.audioUrl || null,
    author_id: authorId,
  };

  if (isNew) {
    const { data, error } = await supabase
      .from("songs")
      .insert(payload)
      .select("id")
      .single();

    if (error) return { success: false, error: error.message };
    return { success: true, id: data.id };
  } else {
    const { error } = await supabase
      .from("songs")
      .update(payload)
      .eq("id", song.id)
      .eq("author_id", authorId); // RLS enforces this, but be explicit

    if (error) return { success: false, error: error.message };
    return { success: true, id: song.id };
  }
}

export async function deleteSong(songId: string): Promise<{ success: boolean; error?: string }> {
  const { error } = await supabase
    .from("songs")
    .delete()
    .eq("id", songId);

  if (error) return { success: false, error: error.message };
  return { success: true };
}
