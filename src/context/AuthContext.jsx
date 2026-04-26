import { createContext, useContext, useState, useEffect } from "react";
import { firebaseConfigured } from "../services/firebase";
import { onAuthChange, getUserRole } from "../services/authService";
import { getVolunteerProfile } from "../services/volunteersService";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [volunteerProfile, setVolunteerProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!firebaseConfigured) {
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthChange(async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);

        // Fetch role from Firestore
        try {
          const role = await getUserRole(firebaseUser.uid);
          setUserRole(role);

          // If volunteer, fetch profile
          if (role === "volunteer") {
            const profile = await getVolunteerProfile(firebaseUser.uid);
            setVolunteerProfile(profile);
          }
        } catch (err) {
          console.error("Failed to fetch user role:", err);
        }
      } else {
        setUser(null);
        setUserRole(null);
        setVolunteerProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const value = {
    user,
    userRole,
    volunteerProfile,
    setVolunteerProfile,
    loading,
    isNGO: userRole === "ngo",
    isVolunteer: userRole === "volunteer",
    isAuthenticated: !!user,
    firebaseConfigured,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
