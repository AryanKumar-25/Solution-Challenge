import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { ToastProvider } from "./context/ToastContext";
import ProtectedRoute from "./components/layout/ProtectedRoute";
import LoadingSpinner from "./components/common/LoadingSpinner";

// Auth pages
import LoginPage from "./pages/auth/LoginPage";
import VolunteerSignupPage from "./pages/auth/VolunteerSignupPage";

// NGO pages
import NGODashboard from "./pages/ngo/NGODashboard";
import SubmitNeedPage from "./pages/ngo/SubmitNeedPage";
import UploadSurveyPage from "./pages/ngo/UploadSurveyPage";
import MapViewPage from "./pages/ngo/MapViewPage";

// Volunteer pages
import VolunteerHome from "./pages/volunteer/VolunteerHome";
import TaskDetailPage from "./pages/volunteer/TaskDetailPage";
import VolunteerProfile from "./pages/volunteer/VolunteerProfile";
import VolunteerMapPage from "./pages/volunteer/VolunteerMapPage";
import VolunteerTasksPage from "./pages/volunteer/VolunteerTasksPage";

function AppRoutes() {
  const { user, userRole, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface-50">
        <LoadingSpinner size="lg" text="Loading VolunteerBridge..." />
      </div>
    );
  }

  return (
    <Routes>
      {/* Public */}
      <Route path="/login" element={user ? (
        userRole === "ngo" ? <Navigate to="/ngo/dashboard" /> : <Navigate to="/volunteer/home" />
      ) : <LoginPage />} />
      <Route path="/signup/volunteer" element={<VolunteerSignupPage />} />

      {/* NGO Routes */}
      <Route path="/ngo/dashboard" element={
        <ProtectedRoute requiredRole="ngo"><NGODashboard /></ProtectedRoute>
      } />
      <Route path="/ngo/submit-need" element={
        <ProtectedRoute requiredRole="ngo"><SubmitNeedPage /></ProtectedRoute>
      } />
      <Route path="/ngo/upload-survey" element={
        <ProtectedRoute requiredRole="ngo"><UploadSurveyPage /></ProtectedRoute>
      } />
      <Route path="/ngo/map" element={
        <ProtectedRoute requiredRole="ngo"><MapViewPage /></ProtectedRoute>
      } />

      {/* Volunteer Routes */}
      <Route path="/volunteer/home" element={
        <ProtectedRoute requiredRole="volunteer"><VolunteerHome /></ProtectedRoute>
      } />
      <Route path="/volunteer/task/:id" element={
        <ProtectedRoute requiredRole="volunteer"><TaskDetailPage /></ProtectedRoute>
      } />
      <Route path="/volunteer/profile" element={
        <ProtectedRoute requiredRole="volunteer"><VolunteerProfile /></ProtectedRoute>
      } />
      <Route path="/volunteer/map" element={
        <ProtectedRoute requiredRole="volunteer"><VolunteerMapPage /></ProtectedRoute>
      } />
      <Route path="/volunteer/tasks" element={
        <ProtectedRoute requiredRole="volunteer"><VolunteerTasksPage /></ProtectedRoute>
      } />

      {/* Default */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <ToastProvider>
          <AppRoutes />
        </ToastProvider>
      </AuthProvider>
    </Router>
  );
}
