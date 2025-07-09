"use client";

import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();    

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isInitialized, setIsInitialized] = useState(false); // New state

    useEffect(() => {
        const storedAuth = localStorage.getItem('token');
        if (storedAuth) {
        try {
            setUser(JSON.parse(storedAuth));
        } catch (e) {
            localStorage.removeItem('token');
        }
        }
        setIsInitialized(true); // Mark initialization complete
    }, []);

    useEffect(() => {
        const storedAuth = localStorage.getItem('token');
        if (storedAuth) {
            try {
                setUser(JSON.parse(storedAuth));
            } 
            catch (e) {
                localStorage.removeItem('token');
            }
        }
    }, []);

    useEffect(() => {
        if (user) {
            localStorage.setItem('token', JSON.stringify(user));
        } 
        else {
            localStorage.removeItem('token');
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