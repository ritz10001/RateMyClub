"use client"

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import { getAuth, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { app } from "../utils/firebase";
import { toast } from "sonner";

export default function LoginContent() {
  const [isLoading, setIsLoading] = useState(false);
  const auth = getAuth(app);
  const provider = new GoogleAuthProvider();
  const router = useRouter();
  const { user, isInitialized, login } = useAuth();
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setIsLoading(true);
    setError(false);
    try{
      const userCredential = await signInWithEmailAndPassword(auth, formData.email, formData.password);
      const user = userCredential.user;
      console.log("✅ Firebase login successful:", user);
      const idToken = await user.getIdToken(true);

      // Call backend login to verify user and get roles, etc.
      const response = await fetch("http://localhost:5095/api/Account/firebase-login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify(idToken)
      });

      if (!response.ok) {
        if (response.status === 401) {
          setError("Email not verified or user not registered.");
        } 
        else {
          setError("Backend login failed. Please try again.");
        }
        await auth.signOut(); // Sign out on backend login failure
        setIsLoading(false);
        return;
      }
      const authResponse = await response.json();
      console.log("THIS IS THE AUTHRESPONSE", authResponse);

      // Merge Firebase + SQL info
      const combinedUser = {
        ...user, // keeps Firebase properties (uid, email, etc.)
        firstName: authResponse.firstName,
        lastName: authResponse.lastName,
        sqlUserId: authResponse.userId,
        roles: authResponse.roles,
        tags: authResponse.tags,
        universityId: authResponse.universityId
      };

      if(login){
        login(combinedUser);
      }
      router.replace("/");
    }
    catch (err) {
      console.error("❌ Firebase login error:", err);
      if (err.code === "auth/wrong-password" || err.code === "auth/user-not-found") {
        setError("Invalid email or password.");
      } 
      else {
        setError("An unexpected error occurred. Please try again.");
      }
    } 
    finally {
      setIsLoading(false);
      setIsLoggingIn(false);
    }
  } 
  const handleGoogleLogin = async () => {
  try {
    // Step 1: Sign in with Firebase popup
    const result = await signInWithPopup(auth, provider);
    const firebaseUser = result.user;

    // Step 2: Show loading AFTER user selects account
    setIsLoading(true);

    // Step 3: Get Firebase ID token
    const idToken = await firebaseUser.getIdToken(true);

    // Step 4: Try backend login
    let response = await fetch("http://localhost:5095/api/Account/firebase-login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(idToken)
    });

    // Step 5: If user not found, register
    if (response.status === 401) {
      console.log("User not found, registering...");
      try {
        response = await fetch(`http://localhost:5095/api/Account/firebase-register`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            firebaseIdToken: idToken,
            firstName: firebaseUser.displayName?.split(" ")[0] || "",
            lastName: firebaseUser.displayName?.split(" ")[1] || "",
            email: firebaseUser.email,
            universityId: null, // default university
            isSSO: true
          })
        });

        if (!response.ok) {
          const errText = await response.text();
          throw new Error("SSO registration failed: " + errText);
        }
        else{
          console.log("SSO REGISTRATION COMPLETE");
        }
      } 
      catch (sqlError) {
        console.error("SQL registration failed, deleting Firebase user...", sqlError);
        try {
          await firebaseUser.delete(); // Delete dangling Firebase user
          console.log("Firebase user deleted due to SQL failure");
        } catch (deleteError) {
          console.error("Failed to delete Firebase user:", deleteError);
        }
        throw sqlError; // propagate error
      }
    }

    // Step 6: Parse backend response
    const authResponse = await response.json();
    console.log("THE AUTHRESPONSE FROM SSO", authResponse);

    // Step 7: Merge Firebase + SQL data and store in session
    const combinedUser = {
      ...firebaseUser,
      firstName: authResponse.firstName,
      lastName: authResponse.lastName,
      sqlUserId: authResponse.userId,
      roles: authResponse.roles,
      tags: authResponse.tags,
      universityId: authResponse.universityId
    };
    console.log("HERE IS THE USER DATA AFTER LOGIN");
    console.log(combinedUser);
    login(combinedUser); // updates AuthContext + sessionStorage immediately
    router.replace("/");
  } 
  catch (error) {
    console.error("SSO error:", error);
    toast.error("Google SSO failed. Please try again");
    setError("Google SSO failed. Please try again.");
  } 
  finally {
    setIsLoading(false);
  }
};

useEffect(() => {
  if (isInitialized && !isLoading && user && user?.emailVerified && !isLoggingIn) {
    router.replace("/");
  }
}, [isInitialized, user, router, isLoggingIn, isLoading]);

// Modified loading condition - don't show loading for unverified users during login
if (!isInitialized || (isLoading && !isLoggingIn) || (user && !isLoggingIn)) {
  return (
    <div className="fixed inset-0 bg-white dark:bg-black z-50 flex items-center justify-center">
      <div className="text-center">
        <div className="w-20 h-20 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
        <p className="text-gray-600 dark:text-white text-lg font-medium">Loading...</p>
      </div>
    </div>
  );
}
  if (user?.emailVerified) {
    return null; // or just `return null`
  }
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white dark:from-zinc-950 dark:to-zinc-900 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full">
        <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-xl p-8 border border-blue-100 dark:border-blue-900">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">Welcome back</h1>
            <p className="text-gray-600 dark:text-gray-400">Sign in to your account</p>
          </div>
          
          {/* Google SSO Button */}
          <div className="mb-6">
            <Button
              onClick={handleGoogleLogin}
              variant="outline"
              className="w-full border-2 border-gray-200 dark:border-zinc-700 hover:bg-gray-50 dark:hover:bg-zinc-800 py-3 px-4 rounded-xl font-semibold text-gray-700 dark:text-gray-300 bg-white dark:bg-zinc-900 transition-colors flex items-center justify-center gap-3"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Sign in with Google (Recommended)
            </Button>
          </div>

          {/* Divider */}
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200 dark:border-zinc-800" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white dark:bg-zinc-900 text-gray-500 dark:text-gray-400 font-medium">OR</span>
            </div>
          </div>

          {/* Form */}
          {error && (
            <div className="mb-4 text-red-600 dark:text-red-400 text-sm">
              Invalid email or password. Please try again.
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div>
              <Label htmlFor="email" className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                Your Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="example@gmail.com"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 dark:border-zinc-700 rounded-xl focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none transition-colors bg-white dark:bg-zinc-800 text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400"
                required
              />
            </div>

            {/* Password */}
            <div>
              <Label htmlFor="password" className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                Your Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={(e) => handleInputChange("password", e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 dark:border-zinc-700 rounded-xl focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none transition-colors bg-white dark:bg-zinc-800 text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400"
                required
              />
            </div>

            {/* Forgot Password Link */}
            {/* <div className="text-right">
              <Link
                href="/forgot-password"
                className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-500 font-medium underline underline-offset-4"
              >
                Forgot Password?
              </Link>
            </div> */}

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full bg-blue-600 dark:bg-blue-700 hover:bg-blue-700 dark:hover:bg-blue-600 text-white py-3 px-4 rounded-xl font-semibold text-lg transition-colors flex items-center justify-center mb-5"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>

          {/* Sign Up Link */}
          <div className="mt-6 text-center">
            <p className="text-gray-600 dark:text-gray-400">
              Don't have an account?{" "}
              <Link
                href="/signup"
                className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-500 font-medium underline underline-offset-4"
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
