import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children }) {
  const { auth, loadingAuth } = useAuth();

  // ✅ Wait until localStorage check finishes
  if (loadingAuth) return null; // or <p>Loading...</p>

  if (!auth.isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
