"use client"
import { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/app/utils/firebase'; // adjust import path as needed

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Function to fetch SQL user data (only called when needed)
  const fetchSqlUserData = async (firebaseUser) => {
    try {
      const idToken = await firebaseUser.getIdToken();
      const response = await fetch("http://localhost:5095/api/Account/firebase-login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify(idToken)
      });

      if (response.ok) {
        const authResponse = await response.json();
        const combinedUser = {
          ...firebaseUser,
          firstName: authResponse.firstName,
          lastName: authResponse.lastName,
          sqlUserId: authResponse.userId,
          roles: authResponse.roles,
        };
        
        // Store in sessionStorage for persistence across refreshes
        sessionStorage.setItem('combinedUserData', JSON.stringify({
          uid: firebaseUser.uid,
          firstName: authResponse.firstName,
          lastName: authResponse.lastName,
          sqlUserId: authResponse.userId,
          roles: authResponse.roles,
          timestamp: Date.now()
        }));
        
        return combinedUser;
      }
    } catch (error) {
      console.error("Error fetching SQL user data:", error);
    }
    
    // Return just Firebase user if SQL fetch fails
    return firebaseUser;
  };

  // Function to get stored SQL data from sessionStorage
  const getStoredSqlData = (firebaseUid) => {
    try {
      const stored = sessionStorage.getItem('combinedUserData');
      if (stored) {
        const data = JSON.parse(stored);
        // Check if the stored data is for the same user
        if (data.uid === firebaseUid) {
          return data;
        }
      }
    } catch (error) {
      console.error("Error reading from sessionStorage:", error);
    }
    return null;
  };

  // Custom login function that combines data and stores it
  const login = (combinedUserData) => {
    setUser(combinedUserData);
    
    // Store SQL data in sessionStorage
    sessionStorage.setItem('combinedUserData', JSON.stringify({
      uid: combinedUserData.uid,
      firstName: combinedUserData.firstName,
      lastName: combinedUserData.lastName,
      sqlUserId: combinedUserData.sqlUserId,
      roles: combinedUserData.roles,
      timestamp: Date.now()
    }));
  };

  // Custom logout function
  const logout = async () => {
    try {
      await auth.signOut();
      setUser(null);
      sessionStorage.removeItem('combinedUserData'); // Clear stored data
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setIsLoading(true);
      
      if (firebaseUser) {
        // Try to get stored SQL data first
        const storedSqlData = getStoredSqlData(firebaseUser.uid);
        
        if (storedSqlData) {
          // We have stored data, combine it with fresh Firebase data
          console.log("Using sessionStorage SQL data, no API call needed");
          setUser({
            ...firebaseUser,
            firstName: storedSqlData.firstName,
            lastName: storedSqlData.lastName,
            sqlUserId: storedSqlData.sqlUserId,
            roles: storedSqlData.roles,
          });
        } else {
          // No stored data, fetch from SQL (only happens on first login or new session)
          console.log("Fetching fresh SQL data");
          const combinedUser = await fetchSqlUserData(firebaseUser);
          setUser(combinedUser);
        }
      } else {
        // User is signed out
        setUser(null);
        sessionStorage.removeItem('combinedUserData');
      }
      
      setIsInitialized(true);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const value = {
    user,
    isInitialized,
    isLoading,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};