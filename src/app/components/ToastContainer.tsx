import { X, CheckCircle, XCircle, Info, AlertTriangle } from "lucide-react";
import { useToast } from "../utils/ToastContext";
import type { ToastType } from "../utils/ToastContext";

const icons: Record<ToastType, React.ReactNode> = {
  success: <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 shrink-0 text-green-500" />,
  error:   <XCircle    className="w-4 h-4 sm:w-5 sm:h-5 shrink-0 text-red-500" />,
  warning: <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 shrink-0 text-yellow-500" />,
  info:    <Info       className="w-4 h-4 sm:w-5 sm:h-5 shrink-0 text-blue-500" />,
};

const styles: Record<ToastType, string> = {
  success: "bg-white dark:bg-gray-800 border-l-4 border-green-500",
  error:   "bg-white dark:bg-gray-800 border-l-4 border-red-500",
  warning: "bg-white dark:bg-gray-800 border-l-4 border-yellow-500",
  info:    "bg-white dark:bg-gray-800 border-l-4 border-blue-500",
};

export default function ToastContainer() {
  const { toasts, dismissToast } = useToast();

  if (toasts.length === 0) return null;

  return (
    // Fixed top-right (desktop) / top-center (mobile)
    // All toasts stack in same position — they overlap via z-index and absolute positioning
    <div className="fixed top-4 left-1/2 -translate-x-1/2 sm:left-auto sm:translate-x-0 sm:right-4 z-[9999] w-[calc(100vw-2rem)] sm:w-80 max-w-sm pointer-events-none">
      {toasts.map((toast, index) => (
        <div
          key={toast.id}
          style={{
            // Stack toasts: each subsequent one is slightly offset down and behind
            transform: `translateY(${index * 4}px) scale(${1 - index * 0.02})`,
            zIndex: 9999 - index,
            opacity: index > 1 ? 0.6 : 1,
          }}
          className={`
            absolute inset-x-0 top-0
            flex items-start gap-2 sm:gap-3
            px-3 py-2.5 sm:px-4 sm:py-3
            rounded-lg shadow-lg border border-gray-200 dark:border-gray-700
            pointer-events-auto
            transition-all duration-300
            ${styles[toast.type]}
          `}
        >
          <span className="mt-0.5">{icons[toast.type]}</span>
          <p className="flex-1 text-xs sm:text-sm font-medium text-gray-800 dark:text-gray-100 leading-snug">
            {toast.message}
          </p>
          <button
            onClick={() => dismissToast(toast.id)}
            className="mt-0.5 p-0.5 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors shrink-0"
          >
            <X className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-400" />
          </button>
        </div>
      ))}
      {/* Spacer so container has height of the first toast */}
      <div className="invisible px-3 py-2.5 sm:px-4 sm:py-3 text-xs sm:text-sm">placeholder</div>
    </div>
  );
}
