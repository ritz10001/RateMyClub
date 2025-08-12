"use client";
import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function ProtectedRoute({ children, role }) {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [isRedirecting, setIsRedirecting] = useState(false);
  
  console.log("USER");
  console.log(user);

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
      <div className="fixed inset-0 bg-white z-[9999] flex items-center justify-center">
        <div className="flex items-center space-x-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          <p className="font-bold text-xl">
            {isRedirecting ? "Redirecting..." : "Loading..."}
          </p>
        </div>
      </div>
    ); 
  }

  return children;
}