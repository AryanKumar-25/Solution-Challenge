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
      <div className="min-h-screen flex items-center justify-center bg-surface-50">
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
