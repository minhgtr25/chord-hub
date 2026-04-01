import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { supabase } from "../lib/supabase";
import type { User as SupabaseUser, Session } from "@supabase/supabase-js";

export type AuthView = "login" | "register" | "forgot-password";

// Public-facing user type
export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  bio?: string;
  instrument?: string;
  createdAt: string;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  isAuthModalOpen: boolean;
  authView: AuthView;
  openAuthModal: (view?: AuthView) => void;
  closeAuthModal: () => void;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  updateProfile: (updates: Partial<Pick<User, "name" | "bio" | "instrument" | "avatar">>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Convert Supabase user + profile to our User type
function buildUser(supabaseUser: SupabaseUser, profile?: Record<string, unknown> | null): User {
  return {
    id: supabaseUser.id,
    name: (profile?.name as string) || supabaseUser.email?.split("@")[0] || "User",
    email: supabaseUser.email || "",
    avatar: (profile?.avatar_url as string) || `https://api.dicebear.com/7.x/avataaars/svg?seed=${supabaseUser.email}`,
    bio: (profile?.bio as string) || undefined,
    instrument: (profile?.instrument as string) || "Guitar",
    createdAt: (profile?.created_at as string) || supabaseUser.created_at,
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authView, setAuthView] = useState<AuthView>("login");

  // Load profile from Supabase
  async function fetchProfile(supabaseUser: SupabaseUser) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", supabaseUser.id)
      .single();
    setUser(buildUser(supabaseUser, profile));
  }

  // Listen to auth state changes
  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user) {
        fetchProfile(session.user).finally(() => setLoading(false));
      } else {
        setLoading(false);
      }
    });

    // Subscribe to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session?.user) {
        fetchProfile(session.user);
      } else {
        setUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const openAuthModal = (view: AuthView = "login") => {
    setAuthView(view);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => setIsAuthModalOpen(false);

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      // Translate Supabase error messages to Vietnamese
      const msg = error.message.includes("Invalid login credentials")
        ? "Email hoặc mật khẩu không đúng"
        : error.message;
      return { success: false, error: msg };
    }
    closeAuthModal();
    return { success: true };
  };

  const register = async (name: string, email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name }, // stored in raw_user_meta_data, trigger uses it
      },
    });
    if (error) {
      const msg = error.message.includes("already registered")
        ? "Email này đã được đăng ký"
        : error.message;
      return { success: false, error: msg };
    }
    closeAuthModal();
    return { success: true };
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
  };

  const updateProfile = async (updates: Partial<Pick<User, "name" | "bio" | "instrument" | "avatar">>) => {
    if (!user) return;
    const dbUpdates: Record<string, string | undefined> = {};
    if (updates.name !== undefined) dbUpdates.name = updates.name;
    if (updates.bio !== undefined) dbUpdates.bio = updates.bio;
    if (updates.instrument !== undefined) dbUpdates.instrument = updates.instrument;
    if (updates.avatar !== undefined) dbUpdates.avatar_url = updates.avatar;

    const { error } = await supabase
      .from("profiles")
      .update(dbUpdates)
      .eq("id", user.id);

    if (!error) {
      setUser({ ...user, ...updates });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading,
        isAuthModalOpen,
        authView,
        openAuthModal,
        closeAuthModal,
        login,
        register,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
