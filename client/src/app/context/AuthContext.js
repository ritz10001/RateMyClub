"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext();    

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isInitialized, setIsInitialized] = useState(false); // New state

    const validateToken = (token) => {
        console.log("token information", token);
        if (!token) return false;
        try {
            const decoded = jwtDecode(token);
            return decoded.exp * 1000 > Date.now(); // Check if expired
        } 
        catch {
            return false;
        }
    };

    const clearAuth = () => {
        setUser(null);
        localStorage.removeItem("user");
    };

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        console.log("stored user");
        console.log(storedUser);
        if (storedUser) {
            try {
                const parsedUser = JSON.parse(storedUser);
                if (validateToken(parsedUser.token)) {
                    setUser(parsedUser);
                } 
                else {
                    console.log("PROBLEM 1");
                    clearAuth();
                }
            } 
            catch {
                clearAuth();
            }
        } else {
            clearAuth();
        }
        setIsInitialized(true);
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            const storedUser = localStorage.getItem("user");
            const token = JSON.parse(storedUser)?.token;
            if (token && !validateToken(token)) {
                console.log("PROBLEM 2");
                clearAuth();
            }
        }, 60000); // Check every minute
        
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (user) {
            localStorage.setItem("user", JSON.stringify(user));
        } 
    }, [user]);

    return (
        <AuthContext.Provider value={{ user, setUser, isInitialized }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}