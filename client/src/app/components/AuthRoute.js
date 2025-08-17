"use client";
import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function AuthRoute({ children, redirectTo = "/" }) {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    if (!isLoading && !user) {
      setIsRedirecting(true);
      // setTimeout(() => {
        router.replace(redirectTo);
      // }, 100);
    }
  }, [user, isLoading, router, redirectTo]);

  // Show full-screen loading that covers header/footer
  if (isLoading || !user) {
    return (
      <div className="fixed inset-0 bg-white z-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
          <p className="text-gray-600 text-lg font-medium">Loading...</p>
        </div>
      </div>
    ); 
  }

  return children;
}