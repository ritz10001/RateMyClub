"use client";
import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { app } from "../utils/firebase";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const router = useRouter();
  const auth = getAuth(app);

  // Login just stores the Firebase user
  const login = useCallback((firebaseUser) => {
    setUser(firebaseUser);
  }, []);

  // Logout from Firebase
  const logout = useCallback(async () => {
    try {
      await signOut(auth);
      setUser(null);
      router.push("/login");
      console.log("Logout successful");
    } 
    catch (error) {
      console.error("Logout error:", error);
      toast.error("Failed to log out.");
    }
  }, [auth, router]);

  // Listen to Firebase auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser || null);
      setIsInitialized(true);
    });

    return () => unsubscribe();
  }, [auth]);

  const value = {
    user,
    setUser,
    login,
    logout,
    isInitialized,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  return useContext(AuthContext);
}
