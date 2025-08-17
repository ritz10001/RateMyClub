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
      <div className="fixed inset-0 bg-white z-[9999] flex items-center justify-center">
        <div className="flex items-center space-x-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          <p className="font-bold text-xl">
            Now Loading...
          </p>
        </div>
      </div>
    ); 
  }

  // Only render children if user is NOT logged in
  return user && user.emailVerified ? null : children;
}