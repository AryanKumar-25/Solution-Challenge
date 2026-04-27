import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import LoadingSpinner from "../common/LoadingSpinner";

/**
 * Protected route wrapper — redirects to login if unauthenticated,
 * or wrong role.
 */
export default function ProtectedRoute({ children, requiredRole }) {
  const { user, userRole, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#E8F4FD" }}>
        <LoadingSpinner size="lg" text="Loading..." />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && userRole !== requiredRole) {
    // Redirect to their correct dashboard
    if (userRole === "ngo") return <Navigate to="/ngo/dashboard" replace />;
    if (userRole === "volunteer") return <Navigate to="/volunteer/home" replace />;
    return <Navigate to="/login" replace />;
  }

  return children;
}
