"use client";
import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function GuestRoute({ children, redirectTo = "/" }) {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [isRedirecting, setIsRedirecting] = useState(false);
  
  console.log("USER (Guest Route)");
  console.log(user);

  useEffect(() => {
    // If user is already logged in, redirect them away from auth pages
    if (!isLoading && user && user.emailVerified) {
      setIsRedirecting(true);
      setTimeout(() => {
        router.replace(redirectTo);
      }, 100);
    }
  }, [user, isLoading, router, redirectTo]);

  // Show full-screen loading while redirecting logged-in users
  if (isLoading || (user && isRedirecting)) {
    return (
      <div className="fixed inset-0 bg-white dark:bg-black z-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
          <p className="text-gray-600 dark:text-white text-lg font-medium">Loading...</p>
        </div>
      </div>
    ); 
  }

  // Only render children if user is NOT logged in
  return user && user.emailVerified ? null : children;
}