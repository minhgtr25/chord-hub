// ============================================================
// Mock User Database (JSON in localStorage)
// TODO: Replace with Supabase when deploying to Vercel
// ============================================================

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  password: string; // Plain text for mock only — Supabase will handle hashing
  avatar?: string;
  bio?: string;
  instrument?: string;
  createdAt: string;
}

const STORAGE_KEY = "chordhub-users";
const SESSION_KEY = "chordhub-session"; // stores logged-in user id

// Seed data — 2 default accounts so authorId matching works with mockSongs
const seedUsers: UserProfile[] = [
  {
    id: "user1",
    name: "Quang Minh",
    email: "minh@chordhub.com",
    password: "123456",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=minh",
    bio: "Guitar acoustic, yêu nhạc Việt",
    instrument: "Guitar",
    createdAt: "2026-01-01",
  },
  {
    id: "user2",
    name: "Thanh Hương",
    email: "huong@chordhub.com",
    password: "123456",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=huong",
    bio: "Piano & vocal cover",
    instrument: "Piano",
    createdAt: "2026-02-10",
  },
];

// --------------- helpers ---------------

function getUsers(): UserProfile[] {
  if (typeof window === "undefined") return seedUsers;

  const raw = localStorage.getItem(STORAGE_KEY);
  if (raw) {
    return JSON.parse(raw) as UserProfile[];
  }
  // First run — seed
  localStorage.setItem(STORAGE_KEY, JSON.stringify(seedUsers));
  return seedUsers;
}

function saveUsers(users: UserProfile[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
}

// --------------- public API ---------------

export function findUserByEmail(email: string): UserProfile | undefined {
  return getUsers().find((u) => u.email.toLowerCase() === email.toLowerCase());
}

export function findUserById(id: string): UserProfile | undefined {
  return getUsers().find((u) => u.id === id);
}

export function authenticateUser(
  email: string,
  password: string
): { success: true; user: UserProfile } | { success: false; error: string } {
  const user = findUserByEmail(email);
  if (!user) return { success: false, error: "Email không tồn tại" };
  if (user.password !== password) return { success: false, error: "Sai mật khẩu" };
  return { success: true, user };
}

export function registerUser(
  name: string,
  email: string,
  password: string
): { success: true; user: UserProfile } | { success: false; error: string } {
  const existing = findUserByEmail(email);
  if (existing) return { success: false, error: "Email đã được sử dụng" };

  const newUser: UserProfile = {
    id: `user_${Date.now()}`,
    name,
    email,
    password,
    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(email)}`,
    createdAt: new Date().toISOString().split("T")[0],
  };

  const users = getUsers();
  users.push(newUser);
  saveUsers(users);
  return { success: true, user: newUser };
}

export function updateUserProfile(
  id: string,
  updates: Partial<Pick<UserProfile, "name" | "bio" | "instrument" | "avatar">>
): UserProfile | null {
  const users = getUsers();
  const idx = users.findIndex((u) => u.id === id);
  if (idx === -1) return null;

  users[idx] = { ...users[idx], ...updates };
  saveUsers(users);
  return users[idx];
}

// --------------- session persistence ---------------

export function saveSession(userId: string): void {
  localStorage.setItem(SESSION_KEY, userId);
}

export function clearSession(): void {
  localStorage.removeItem(SESSION_KEY);
}

export function getSessionUserId(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(SESSION_KEY);
}
