import { Outlet } from "react-router";
import { AuthProvider } from "../utils/AuthContext";
import AuthModal from "./AuthModal";

export default function RootLayout() {
  return (
    <AuthProvider>
      <Outlet />
      <AuthModal />
    </AuthProvider>
  );
}
