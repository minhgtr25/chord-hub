import { Outlet } from "react-router";
import { AuthProvider } from "../utils/AuthContext";
import { ToastProvider } from "../utils/ToastContext";
import AuthModal from "./AuthModal";
import BottomNav from "./BottomNav";
import ToastContainer from "./ToastContainer";

export default function RootLayout() {
  return (
    <ToastProvider>
      <AuthProvider>
        <div className="pb-16 md:pb-0">
          <Outlet />
        </div>
        <BottomNav />
        <AuthModal />
        <ToastContainer />
      </AuthProvider>
    </ToastProvider>
  );
}
