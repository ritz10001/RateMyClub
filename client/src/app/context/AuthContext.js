// /app/context/AuthContext.js

"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { setUpdateUserCallback } from "@/app/utils/axios";

const AuthContext = createContext();    

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isInitialized, setIsInitialized] = useState(false);

    const validateToken = (token) => {
        if (!token) return false;
        try {
            const decoded = jwtDecode(token);
            return decoded.exp * 1000 > Date.now();
        } 
        catch {
            return false;
        }
    };
    
    // This is the centralized logout function
    const logout = (type) => {
        console.log("AuthContext: Performing logout");
        setUser(null);
        localStorage.removeItem("user");
        // Optional: Redirect the user after logout
        if(type === "exp"){
            window.location.href = "/login"; 
        }
    };

    // The login function
    const login = (userData) => {
        localStorage.setItem("user", JSON.stringify(userData));
        setUser(userData);
    };

    // This useEffect handles initialization and connects to the axios interceptor
    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            try {
                const parsedUser = JSON.parse(storedUser);
                setUser(parsedUser);
            } catch {
                logout(); // Use the logout function to clear invalid data
            }
        }
        setIsInitialized(true);

        // --- THIS IS THE CRITICAL MISSING LINK ---
        // Connect the Axios interceptor to the AuthContext state
        setUpdateUserCallback((updatedUser) => {
            if (updatedUser) {
                localStorage.setItem("user", JSON.stringify(updatedUser));
            } else {
                localStorage.removeItem("user");
            }
            setUser(updatedUser);
        });

        // Cleanup the callback when the component unmounts
        return () => {
            setUpdateUserCallback(() => {});
        };
    }, []);

    // This useEffect synchronizes state with localStorage
    useEffect(() => {
        if (user) {
            localStorage.setItem("user", JSON.stringify(user));
        } else if (isInitialized) {
             // This ensures localStorage is cleared on logout
            localStorage.removeItem("user");
        }
    }, [user, isInitialized]);

    return (
        <AuthContext.Provider value={{ user, login, logout, isInitialized }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}