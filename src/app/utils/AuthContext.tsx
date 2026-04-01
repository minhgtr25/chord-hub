import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { supabase } from "../lib/supabase";
import type { User as SupabaseUser, Session } from "@supabase/supabase-js";

export type AuthView = "login" | "register" | "forgot-password";

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  bio?: string;
  instrument?: string;
  createdAt: string;
}

export interface PendingOAuthProfile {
  provider: "google" | "facebook";
  supabaseUser: SupabaseUser;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  isAuthModalOpen: boolean;
  authView: AuthView;
  pendingOAuthProfile: PendingOAuthProfile | null;
  openAuthModal: (view?: AuthView) => void;
  closeAuthModal: () => void;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  verifyOtp: (email: string, token: string) => Promise<{ success: boolean; error?: string }>;
  loginWithOAuth: (provider: "google" | "facebook") => Promise<void>;
  completePendingProfile: (name: string, email: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  updateProfile: (updates: Partial<Pick<User, "name" | "bio" | "instrument" | "avatar">>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function buildUser(supabaseUser: SupabaseUser, profile?: Record<string, unknown> | null): User {
  const meta = supabaseUser.user_metadata || {};
  return {
    id: supabaseUser.id,
    name:
      (profile?.name as string) ||
      (meta.full_name as string) ||
      (meta.name as string) ||
      supabaseUser.email?.split("@")[0] ||
      "User",
    email: supabaseUser.email || (meta.email as string) || "",
    avatar:
      (profile?.avatar_url as string) ||
      (meta.avatar_url as string) ||
      (meta.picture as string) ||
      `https://api.dicebear.com/7.x/avataaars/svg?seed=${supabaseUser.id}`,
    bio: (profile?.bio as string) || undefined,
    instrument: (profile?.instrument as string) || "Guitar",
    createdAt: (profile?.created_at as string) || supabaseUser.created_at,
  };
}

function isMissingProfile(supabaseUser: SupabaseUser): boolean {
  const provider = supabaseUser.app_metadata?.provider;
  if (provider === "facebook") {
    return !supabaseUser.email && !supabaseUser.user_metadata?.email;
  }
  return false;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authView, setAuthView] = useState<AuthView>("login");
  const [pendingOAuthProfile, setPendingOAuthProfile] = useState<PendingOAuthProfile | null>(null);

  async function fetchProfile(supabaseUser: SupabaseUser) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", supabaseUser.id)
      .single();
    setUser(buildUser(supabaseUser, profile));
  }

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user) {
        const sbUser = session.user;
        if (isMissingProfile(sbUser)) {
          const provider = sbUser.app_metadata?.provider as "google" | "facebook";
          setPendingOAuthProfile({ provider, supabaseUser: sbUser });
          setIsAuthModalOpen(true);
          setLoading(false);
        } else {
          fetchProfile(sbUser).finally(() => setLoading(false));
        }
      } else {
        setLoading(false);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);
      if (session?.user) {
        const sbUser = session.user;
        if (isMissingProfile(sbUser)) {
          const provider = sbUser.app_metadata?.provider as "google" | "facebook";
          setPendingOAuthProfile({ provider, supabaseUser: sbUser });
          setIsAuthModalOpen(true);
        } else {
          setPendingOAuthProfile(null);
          fetchProfile(sbUser);
          if (event === "SIGNED_IN") setIsAuthModalOpen(false);
        }
      } else {
        setUser(null);
        setPendingOAuthProfile(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const openAuthModal = (view: AuthView = "login") => {
    setAuthView(view);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
    setPendingOAuthProfile(null);
  };

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      let msg = error.message;
      if (msg.includes("Invalid login credentials")) msg = "Email hoặc mật khẩu không đúng";
      else if (msg.includes("Email not confirmed")) msg = "Email chưa được xác minh. Kiểm tra hộp thư của bạn";
      return { success: false, error: msg };
    }
    closeAuthModal();
    return { success: true };
  };

  // Register: call signUp → Supabase sends 6-digit OTP (configured in dashboard)
  const register = async (name: string, email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name } },
    });
    if (error) {
      let msg = error.message;
      if (msg.includes("already registered") || msg.includes("already been registered")) {
        msg = "Email này đã được đăng ký. Hãy thử đăng nhập.";
      }
      return { success: false, error: msg };
    }
    return { success: true };
  };

  // Verify OTP sent by signUp (type: "signup")
  const verifyOtp = async (email: string, token: string): Promise<{ success: boolean; error?: string }> => {
    const { error } = await supabase.auth.verifyOtp({ email, token, type: "signup" });
    if (error) {
      let msg = error.message;
      if (msg.includes("Token has expired") || msg.includes("invalid") || msg.includes("expired")) {
        msg = "Mã không hợp lệ hoặc đã hết hạn. Vui lòng thử lại.";
      }
      return { success: false, error: msg };
    }
    // Sign out after verification so user logs in manually with password
    await supabase.auth.signOut();
    return { success: true };
  };

  const loginWithOAuth = async (provider: "google" | "facebook") => {
    await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/`,
        scopes: provider === "facebook" ? "email,public_profile" : undefined,
      },
    });
  };

  const completePendingProfile = async (name: string, email: string): Promise<{ success: boolean; error?: string }> => {
    if (!pendingOAuthProfile) return { success: false, error: "Không có thông tin chờ xử lý" };
    const { supabaseUser } = pendingOAuthProfile;

    if (!supabaseUser.email && email) {
      const { error: emailError } = await supabase.auth.updateUser({ email });
      if (emailError) return { success: false, error: emailError.message };
    }

    const { error: profileError } = await supabase
      .from("profiles")
      .upsert({ id: supabaseUser.id, name, avatar_url: buildUser(supabaseUser).avatar }, { onConflict: "id" });

    if (profileError) return { success: false, error: profileError.message };

    setPendingOAuthProfile(null);
    await fetchProfile(supabaseUser);
    setIsAuthModalOpen(false);
    return { success: true };
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setPendingOAuthProfile(null);
  };

  const updateProfile = async (updates: Partial<Pick<User, "name" | "bio" | "instrument" | "avatar">>) => {
    if (!user) return;
    const dbUpdates: Record<string, string | undefined> = {};
    if (updates.name !== undefined) dbUpdates.name = updates.name;
    if (updates.bio !== undefined) dbUpdates.bio = updates.bio;
    if (updates.instrument !== undefined) dbUpdates.instrument = updates.instrument;
    if (updates.avatar !== undefined) dbUpdates.avatar_url = updates.avatar;

    const { error } = await supabase.from("profiles").update(dbUpdates).eq("id", user.id);
    if (!error) setUser({ ...user, ...updates });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading,
        isAuthModalOpen,
        authView,
        pendingOAuthProfile,
        openAuthModal,
        closeAuthModal,
        login,
        register,
        verifyOtp,
        loginWithOAuth,
        completePendingProfile,
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
  if (context === undefined) throw new Error("useAuth must be used within an AuthProvider");
  return context;
}
