import { useState } from "react";
import { X, Mail, Lock, User, ArrowRight, AlertCircle } from "lucide-react";
import { useAuth } from "../utils/AuthContext";

export default function AuthModal() {
  const { isAuthModalOpen, closeAuthModal, authView, openAuthModal, login, register } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (!isAuthModalOpen) return null;

  const resetForm = () => {
    setEmail("");
    setPassword("");
    setName("");
    setError("");
  };

  const switchView = (view: "login" | "register" | "forgot-password") => {
    resetForm();
    openAuthModal(view);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (authView === "forgot-password") {
      const { error: sbError } = await (await import("../lib/supabase")).supabase.auth.resetPasswordForEmail(email);
      if (sbError) setError(sbError.message);
      else { alert("Đã gửi link khôi phục mật khẩu vào email của bạn!"); switchView("login"); }
      setLoading(false);
      return;
    }

    if (authView === "login") {
      const result = await login(email, password);
      if (!result.success) setError(result.error || "Đăng nhập thất bại");
      else resetForm();
    }

    if (authView === "register") {
      if (password.length < 6) {
        setError("Mật khẩu phải có ít nhất 6 ký tự");
        setLoading(false);
        return;
      }
      const result = await register(name, email, password);
      if (!result.success) setError(result.error || "Đăng ký thất bại");
      else { resetForm(); alert("Kiểm tra email để xác nhận tài khoản!"); }
    }

    setLoading(false);
  };

  const handleSocialLogin = async (provider: "Google" | "Facebook") => {
    const { supabase } = await import("../lib/supabase");
    await supabase.auth.signInWithOAuth({ provider: provider.toLowerCase() as "google" | "facebook" });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Nút đóng */}
        <button
          onClick={() => { closeAuthModal(); resetForm(); }}
          className="absolute top-4 right-4 p-2 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              {authView === "login" && "Đăng nhập"}
              {authView === "register" && "Tạo tài khoản"}
              {authView === "forgot-password" && "Khôi phục mật khẩu"}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              {authView === "login" && "Chào mừng bạn trở lại với ChordHub"}
              {authView === "register" && "Tham gia cộng đồng âm nhạc lớn nhất"}
              {authView === "forgot-password" && "Nhập email của bạn để lấy lại mật khẩu"}
            </p>
          </div>

          {/* Error message */}
          {error && (
            <div className="mb-4 flex items-center gap-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-sm text-red-700 dark:text-red-300">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {authView === "register" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Họ và Tên
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition"
                    placeholder="Nguyễn Văn A"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setError(""); }}
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition"
                  placeholder="bạn@domain.com"
                />
              </div>
            </div>

            {authView !== "forgot-password" && (
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Mật khẩu
                  </label>
                  {authView === "login" && (
                    <button
                      type="button"
                      onClick={() => switchView("forgot-password")}
                      className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      Quên mật khẩu?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); setError(""); }}
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition"
                    placeholder="••••••••"
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white rounded-xl font-medium flex items-center justify-center gap-2 transition"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  {authView === "login" && "Đăng nhập ngay"}
                  {authView === "register" && "Đăng ký tài khoản"}
                  {authView === "forgot-password" && "Gửi liên kết"}
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {authView !== "forgot-password" && (
            <>
              <div className="mt-6 mb-6 relative flex items-center justify-center">
                <div className="absolute inset-y-1/2 w-full border-t border-gray-200 dark:border-gray-700"></div>
                <span className="relative bg-white dark:bg-gray-800 px-3 text-sm text-gray-500 dark:text-gray-400 font-medium">
                  Hoặc đăng nhập với
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => handleSocialLogin("Google")}
                  className="flex items-center justify-center gap-2 px-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 font-medium transition"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                  Google
                </button>
                <button
                  onClick={() => handleSocialLogin("Facebook")}
                  className="flex items-center justify-center gap-2 px-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 font-medium transition"
                >
                  <svg fill="#1877F2" width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                  Facebook
                </button>
              </div>
            </>
          )}

          {/* Footer */}
          <div className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
            {authView === "login" && (
              <p>
                Chưa có tài khoản?{" "}
                <button
                  onClick={() => switchView("register")}
                  className="font-medium text-blue-600 dark:text-blue-400 hover:underline"
                >
                  Đăng ký
                </button>
              </p>
            )}
            {authView === "register" && (
              <p>
                Đã có tài khoản?{" "}
                <button
                  onClick={() => switchView("login")}
                  className="font-medium text-blue-600 dark:text-blue-400 hover:underline"
                >
                  Đăng nhập
                </button>
              </p>
            )}
            {authView === "forgot-password" && (
              <p>
                Quay lại{" "}
                <button
                  onClick={() => switchView("login")}
                  className="font-medium text-blue-600 dark:text-blue-400 hover:underline"
                >
                  Đăng nhập
                </button>
              </p>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
