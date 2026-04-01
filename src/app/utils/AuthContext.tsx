import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import {
  UserProfile,
  authenticateUser,
  registerUser,
  updateUserProfile,
  findUserById,
  saveSession,
  clearSession,
  getSessionUserId,
} from "../data/mockUsers";

export type AuthView = "login" | "register" | "forgot-password";

// Public-facing user type (no password)
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
  isAuthModalOpen: boolean;
  authView: AuthView;
  openAuthModal: (view?: AuthView) => void;
  closeAuthModal: () => void;
  login: (email: string, password: string) => { success: boolean; error?: string };
  register: (name: string, email: string, password: string) => { success: boolean; error?: string };
  logout: () => void;
  updateProfile: (updates: Partial<Pick<UserProfile, "name" | "bio" | "instrument" | "avatar">>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function toPublicUser(p: UserProfile): User {
  return {
    id: p.id,
    name: p.name,
    email: p.email,
    avatar: p.avatar,
    bio: p.bio,
    instrument: p.instrument,
    createdAt: p.createdAt,
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authView, setAuthView] = useState<AuthView>("login");

  // Restore session on mount
  useEffect(() => {
    const sessionId = getSessionUserId();
    if (sessionId) {
      const profile = findUserById(sessionId);
      if (profile) {
        setUser(toPublicUser(profile));
      } else {
        clearSession();
      }
    }
  }, []);

  const openAuthModal = (view: AuthView = "login") => {
    setAuthView(view);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  const login = (email: string, password: string): { success: boolean; error?: string } => {
    const result = authenticateUser(email, password);
    if (result.success) {
      setUser(toPublicUser(result.user));
      saveSession(result.user.id);
      closeAuthModal();
      return { success: true };
    }
    return { success: false, error: result.error };
  };

  const register = (name: string, email: string, password: string): { success: boolean; error?: string } => {
    const result = registerUser(name, email, password);
    if (result.success) {
      setUser(toPublicUser(result.user));
      saveSession(result.user.id);
      closeAuthModal();
      return { success: true };
    }
    return { success: false, error: result.error };
  };

  const logout = () => {
    setUser(null);
    clearSession();
  };

  const updateProfileFn = (updates: Partial<Pick<UserProfile, "name" | "bio" | "instrument" | "avatar">>) => {
    if (!user) return;
    const updated = updateUserProfile(user.id, updates);
    if (updated) {
      setUser(toPublicUser(updated));
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthModalOpen,
        authView,
        openAuthModal,
        closeAuthModal,
        login,
        register,
        logout,
        updateProfile: updateProfileFn,
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
