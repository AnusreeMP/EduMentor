import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function AdminRoute({ children }) {
  const { auth, loadingAuth } = useAuth();

  // ✅ wait until localStorage loads
  if (loadingAuth) return null;

  // ✅ not logged in
  if (!auth.isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // ✅ logged in but not admin
  if (!auth.user?.is_admin) {
    return <Navigate to="/courses" replace />;
  }

  // ✅ admin can access
  return children;
}
