import { useState, useRef, useEffect } from "react";
import { X, Mail, Lock, User, ArrowRight, AlertCircle, CheckCircle2, RefreshCw } from "lucide-react";
import { useAuth } from "../utils/AuthContext";

// ── OTP Input component (6 boxes) ────────────────────────────
function OtpInput({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const inputs = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (i: number, char: string) => {
    const digits = value.split("");
    digits[i] = char.replace(/\D/g, "").slice(-1);
    const next = digits.join("");
    onChange(next);
    if (char && i < 5) inputs.current[i + 1]?.focus();
  };

  const handleKeyDown = (i: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !value[i] && i > 0) inputs.current[i - 1]?.focus();
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    onChange(pasted.padEnd(6, ""));
    inputs.current[Math.min(pasted.length, 5)]?.focus();
    e.preventDefault();
  };

  return (
    <div className="flex gap-3 justify-center my-6">
      {Array.from({ length: 6 }).map((_, i) => (
        <input
          key={i}
          ref={(el) => { inputs.current[i] = el; }}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={value[i] || ""}
          onChange={(e) => handleChange(i, e.target.value)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          onPaste={handlePaste}
          className="w-11 h-14 text-center text-2xl font-bold bg-gray-50 dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:border-blue-500 dark:focus:border-blue-400 outline-none transition-all"
        />
      ))}
    </div>
  );
}

// ── Google SVG ───────────────────────────────────────────────
const GoogleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);

// ── Facebook SVG ─────────────────────────────────────────────
const FacebookIcon = () => (
  <svg fill="#1877F2" width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);

// ── Main Modal ───────────────────────────────────────────────
export default function AuthModal() {
  const {
    isAuthModalOpen, closeAuthModal, authView, openAuthModal,
    login, register, verifyOtp, loginWithOAuth, completePendingProfile,
    pendingOAuthProfile,
  } = useAuth();

  // Core state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // OTP step
  const [step, setStep] = useState<"form" | "otp" | "complete">("form");
  const [otpCode, setOtpCode] = useState("");
  const [resendCooldown, setResendCooldown] = useState(0);

  // Prefill for OAuth profile completion
  useEffect(() => {
    if (pendingOAuthProfile) {
      setStep("form");
      // Pre-fill what we have
      const sbUser = pendingOAuthProfile.supabaseUser;
      const meta = sbUser.user_metadata || {};
      setName((meta.full_name as string) || (meta.name as string) || "");
      setEmail(sbUser.email || (meta.email as string) || "");
    }
  }, [pendingOAuthProfile]);

  // Cooldown timer for resend OTP
  useEffect(() => {
    if (resendCooldown > 0) {
      const t = setTimeout(() => setResendCooldown((c) => c - 1), 1000);
      return () => clearTimeout(t);
    }
  }, [resendCooldown]);

  if (!isAuthModalOpen) return null;

  // ── Helpers ──
  const resetAll = () => {
    setEmail(""); setPassword(""); setName(""); setError("");
    setOtpCode(""); setStep("form"); setResendCooldown(0);
  };

  const switchView = (view: "login" | "register" | "forgot-password") => {
    resetAll();
    openAuthModal(view);
  };

  // ── OAuth handler ──
  const handleOAuth = async (provider: "google" | "facebook") => {
    setLoading(true);
    try {
      await loginWithOAuth(provider);
      // Page redirects, nothing to do here
    } catch {
      setError("Không thể kết nối. Thử lại sau.");
      setLoading(false);
    }
  };

  // ── Main form submit ──
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // OAuth profile completion (Facebook)
    if (pendingOAuthProfile) {
      if (!name.trim()) { setError("Vui lòng nhập tên của bạn"); setLoading(false); return; }
      if (pendingOAuthProfile.provider === "facebook" && !email.trim()) {
        setError("Vui lòng nhập email của bạn"); setLoading(false); return;
      }
      const result = await completePendingProfile(name.trim(), email.trim());
      if (!result.success) setError(result.error || "Đã xảy ra lỗi");
      setLoading(false);
      return;
    }

    // Forgot password
    if (authView === "forgot-password") {
      const { supabase } = await import("../lib/supabase");
      const { error: sbError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (sbError) setError(sbError.message);
      else setStep("complete");
      setLoading(false);
      return;
    }

    // Login
    if (authView === "login") {
      const result = await login(email, password);
      if (!result.success) setError(result.error || "Đăng nhập thất bại");
      else resetAll();
      setLoading(false);
      return;
    }

    // Register → send OTP
    if (authView === "register") {
      if (!name.trim()) { setError("Vui lòng nhập họ và tên"); setLoading(false); return; }
      if (password.length < 6) { setError("Mật khẩu phải có ít nhất 6 ký tự"); setLoading(false); return; }
      const result = await register(name.trim(), email, password);
      if (!result.success) { setError(result.error || "Đăng ký thất bại"); setLoading(false); return; }
      // Move to OTP step
      setStep("otp");
      setResendCooldown(60);
      setLoading(false);
      return;
    }

    setLoading(false);
  };

  // ── OTP verify ──
  const handleVerifyOtp = async () => {
    if (otpCode.length < 6) { setError("Vui lòng nhập đủ 6 chữ số"); return; }
    setError(""); setLoading(true);
    const result = await verifyOtp(email, otpCode);
    if (!result.success) { setError(result.error || "Mã không hợp lệ"); }
    else { setStep("complete"); }
    setLoading(false);
  };

  // ── Resend OTP ──
  const handleResendOtp = async () => {
    if (resendCooldown > 0) return;
    setError(""); setLoading(true);
    const { supabase } = await import("../lib/supabase");
    await supabase.auth.resend({ type: "signup", email });
    setResendCooldown(60);
    setOtpCode("");
    setLoading(false);
  };

  // ── Determine title ──
  const isPendingOAuth = !!pendingOAuthProfile;
  const title = isPendingOAuth
    ? `Hoàn tất đăng ký ${pendingOAuthProfile.provider === "google" ? "Google" : "Facebook"}`
    : step === "otp" ? "Xác minh email"
    : step === "complete" ? (authView === "register" ? "Đăng ký thành công!" : "Email đã gửi!")
    : authView === "login" ? "Đăng nhập"
    : authView === "register" ? "Tạo tài khoản"
    : "Khôi phục mật khẩu";

  const subtitle = isPendingOAuth
    ? pendingOAuthProfile.provider === "facebook"
      ? "Vui lòng điền thông tin để hoàn tất đăng ký"
      : "Xác nhận thông tin của bạn"
    : step === "otp" ? `Nhập mã 6 số đã gửi đến ${email}`
    : step === "complete" && authView === "register" ? "Tài khoản đã được xác minh. Đăng nhập để tiếp tục."
    : step === "complete" ? "Kiểm tra hộp thư để lấy liên kết đặt lại mật khẩu."
    : authView === "login" ? "Chào mừng bạn trở lại với ChordHub"
    : authView === "register" ? "Tham gia cộng đồng âm nhạc lớn nhất"
    : "Nhập email để lấy lại mật khẩu";

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden">

        {/* Close button */}
        <button
          onClick={() => { closeAuthModal(); resetAll(); }}
          className="absolute top-4 right-4 p-2 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Blue top accent bar */}
        <div className="h-1.5 w-full bg-gradient-to-r from-blue-500 via-blue-600 to-indigo-600" />

        <div className="p-8">
          {/* Header */}
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{title}</h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm">{subtitle}</p>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-4 flex items-start gap-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-sm text-red-700 dark:text-red-300">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* ══ SUCCESS SCREEN ══ */}
          {step === "complete" && (
            <div className="text-center py-4">
              <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-10 h-10 text-green-600 dark:text-green-400" />
              </div>
              {authView === "register" ? (
                <>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">
                    Tài khoản của bạn đã được xác minh thành công. Bạn có thể đăng nhập ngay bây giờ.
                  </p>
                  <button
                    onClick={() => switchView("login")}
                    className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition"
                  >
                    Đăng nhập ngay
                  </button>
                </>
              ) : (
                <>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">
                    Kiểm tra hộp thư email <strong>{email}</strong> và nhấn vào liên kết để đặt lại mật khẩu.
                  </p>
                  <button
                    onClick={() => switchView("login")}
                    className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition"
                  >
                    Quay lại đăng nhập
                  </button>
                </>
              )}
            </div>
          )}

          {/* ══ OTP SCREEN ══ */}
          {step === "otp" && (
            <div>
              <div className="flex items-center justify-center w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full mx-auto mb-2">
                <Mail className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>

              <OtpInput value={otpCode} onChange={(v) => { setOtpCode(v); setError(""); }} />

              <button
                onClick={handleVerifyOtp}
                disabled={loading || otpCode.length < 6}
                className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl font-medium flex items-center justify-center gap-2 transition mb-4"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>Xác minh mã <ArrowRight className="w-4 h-4" /></>
                )}
              </button>

              <div className="text-center text-sm text-gray-500 dark:text-gray-400">
                Không nhận được mã?{" "}
                <button
                  onClick={handleResendOtp}
                  disabled={resendCooldown > 0 || loading}
                  className="font-medium text-blue-600 dark:text-blue-400 hover:underline disabled:opacity-50 inline-flex items-center gap-1"
                >
                  <RefreshCw className="w-3 h-3" />
                  {resendCooldown > 0 ? `Gửi lại (${resendCooldown}s)` : "Gửi lại"}
                </button>
              </div>

              <div className="mt-4 text-center">
                <button onClick={() => { setStep("form"); setOtpCode(""); setError(""); }} className="text-sm text-gray-500 hover:underline">
                  ← Sửa email
                </button>
              </div>
            </div>
          )}

          {/* ══ MAIN FORM (login / register / forgot / OAuth complete) ══ */}
          {step === "form" && (
            <>
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Name field — register + OAuth completion */}
                {(authView === "register" || isPendingOAuth) && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Họ và tên <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => { setName(e.target.value); setError(""); }}
                        className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition"
                        placeholder="Nguyễn Văn A"
                        // Google name is prefilled but editable; Facebook is empty
                        readOnly={isPendingOAuth && pendingOAuthProfile?.provider === "google" && !!name}
                      />
                    </div>
                    {isPendingOAuth && pendingOAuthProfile?.provider === "google" && (
                      <p className="text-xs text-gray-400 mt-1">Lấy từ tài khoản Google của bạn</p>
                    )}
                  </div>
                )}

                {/* Email field */}
                {/* Hide email if Google OAuth (already have it) */}
                {!(isPendingOAuth && pendingOAuthProfile?.provider === "google") && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Email {isPendingOAuth && pendingOAuthProfile?.provider === "facebook" && <span className="text-red-500">*</span>}
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
                )}

                {/* Password — login + register only */}
                {!isPendingOAuth && authView !== "forgot-password" && (
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Mật khẩu
                      </label>
                      {authView === "login" && (
                        <button type="button" onClick={() => switchView("forgot-password")} className="text-xs text-blue-600 dark:text-blue-400 hover:underline">
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
                        minLength={authView === "register" ? 6 : undefined}
                      />
                    </div>
                    {authView === "register" && (
                      <p className="text-xs text-gray-400 mt-1">Tối thiểu 6 ký tự</p>
                    )}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white rounded-xl font-semibold flex items-center justify-center gap-2 transition"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      {isPendingOAuth ? "Hoàn tất đăng ký" : authView === "login" ? "Đăng nhập" : authView === "register" ? "Tiếp tục →" : "Gửi liên kết"}
                      {!isPendingOAuth && <ArrowRight className="w-4 h-4" />}
                    </>
                  )}
                </button>
              </form>

              {/* Register hint about OTP */}
              {authView === "register" && (
                <p className="text-xs text-gray-400 dark:text-gray-500 text-center mt-3">
                  Sau khi điền xong, chúng tôi sẽ gửi mã xác minh 6 số đến email của bạn.
                </p>
              )}

              {/* Social login separator — only on login/register, not OAuth complete */}
              {!isPendingOAuth && authView !== "forgot-password" && (
                <>
                  <div className="my-5 relative flex items-center justify-center">
                    <div className="absolute inset-y-1/2 w-full border-t border-gray-200 dark:border-gray-700" />
                    <span className="relative bg-white dark:bg-gray-800 px-3 text-sm text-gray-400 font-medium">
                      Hoặc đăng nhập với
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => handleOAuth("google")}
                      disabled={loading}
                      className="flex items-center justify-center gap-2 px-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 font-medium transition disabled:opacity-50"
                    >
                      <GoogleIcon />
                      Google
                    </button>
                    <button
                      type="button"
                      onClick={() => handleOAuth("facebook")}
                      disabled={loading}
                      className="flex items-center justify-center gap-2 px-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 font-medium transition disabled:opacity-50"
                    >
                      <FacebookIcon />
                      Facebook
                    </button>
                  </div>
                </>
              )}

              {/* Footer links */}
              <div className="mt-5 text-center text-sm text-gray-500 dark:text-gray-400">
                {authView === "login" && (
                  <p>
                    Chưa có tài khoản?{" "}
                    <button onClick={() => switchView("register")} className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">
                      Đăng ký miễn phí
                    </button>
                  </p>
                )}
                {authView === "register" && (
                  <p>
                    Đã có tài khoản?{" "}
                    <button onClick={() => switchView("login")} className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">
                      Đăng nhập
                    </button>
                  </p>
                )}
                {authView === "forgot-password" && (
                  <p>
                    Quay lại{" "}
                    <button onClick={() => switchView("login")} className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">
                      Đăng nhập
                    </button>
                  </p>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
