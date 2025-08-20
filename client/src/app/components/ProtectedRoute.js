"use client";
import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function ProtectedRoute({ children, role }) {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    if (!isLoading) {
      if (!user || (role && !user.roles.includes(role))) {
        setIsRedirecting(true);
        setTimeout(() => {
          router.replace("/");
        }, 100);
      }
    }
  }, [user, isLoading, role, router]);

  // Show full-screen loading that covers header/footer
  if (isLoading || isRedirecting || !user || (role && !user.roles.includes(role))) {
    return (
      <div className="fixed inset-0 bg-white dark:bg-black z-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
          <p className="text-gray-600 dark:text-white text-lg font-medium">Loading...</p>
        </div>
      </div>
    ); 
  }

  return children;
}