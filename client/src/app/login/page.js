"use client"

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useState, useEffect, useCallback } from "react"; // Added useCallback
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import { getAuth, signInWithEmailAndPassword, signInWithRedirect, getRedirectResult, GoogleAuthProvider } from "firebase/auth"; // getRedirectResult import
import { app } from "../utils/firebase";
import { toast } from "sonner";

export default function LoginContent() {
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
  const auth = getAuth(app);
  const provider = new GoogleAuthProvider();
  const router = useRouter();
  const { user, setUser, isInitialized, login, logout } = useAuth(); // Assuming logout handles setUser(null) and auth.signOut()

  const [isLoading, setIsLoading] = useState(false); // General loading state for all async operations
  const [isLoggingIn, setIsLoggingIn] = useState(false); // Specific for login actions
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState(""); // Changed to empty string for initial state

  // Memoize handleInputChange to prevent unnecessary re-renders (good practice)
  const handleInputChange = useCallback((field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  }, []);

  // --- Regular Email/Password Login ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setIsLoading(true);
    setError(""); // Clear previous errors
    try {
      const userCredential = await signInWithEmailAndPassword(auth, formData.email, formData.password);
      const firebaseUser = userCredential.user;
      console.log("✅ Firebase login successful:", firebaseUser);

      const idToken = await firebaseUser.getIdToken(true);

      const response = await fetch(`${backendUrl}/api/Account/firebase-login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify(idToken)
      });

      if (!response.ok) {
        const errorText = await response.text(); // Get specific error from backend
        if (response.status === 401) {
          setError("Email not verified or user not registered.");
        } else {
          setError(`Backend login failed: ${errorText || 'Unknown error'}. Please try again.`);
        }
        await auth.signOut(); // Sign out Firebase user if backend login fails
        return;
      }

      const authResponse = await response.json();
      console.log("THIS IS THE AUTHRESPONSE", authResponse);

      const combinedUser = {
        ...firebaseUser,
        firstName: authResponse.firstName,
        lastName: authResponse.lastName,
        sqlUserId: authResponse.userId,
        roles: authResponse.roles,
        tags: authResponse.tags,
        universityId: authResponse.universityId
      };

      if (login) {
        login(combinedUser); // updates AuthContext + sessionStorage
      }
      router.replace("/"); // Redirect to home on successful login
    } catch (err) {
      console.error("❌ Firebase login error:", err);
      if (err.code === "auth/wrong-password" || err.code === "auth/user-not-found" || err.code === "auth/invalid-credential") {
        setError("Invalid email or password.");
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setIsLoading(false);
      setIsLoggingIn(false);
    }
  };

  // --- Google SSO Login (Initiation) ---
  const handleGoogleLogin = async () => {
    setIsLoggingIn(true); // Indicate a login process has started
    setIsLoading(true); // Show loading spinner
    setError(""); // Clear previous errors
    try {
      await signInWithRedirect(auth, provider);
      // This line will typically not be reached as the page redirects.
      // If it is, it means the redirect itself failed client-side.
    } catch (error) {
      console.error("Error initiating Google redirect:", error);
      toast.error("Failed to initiate Google login. Please try again.");
      setIsLoading(false);
      setIsLoggingIn(false);
      setError("Failed to initiate Google login."); // Set error for display
    }
  };

  // --- Google SSO Login (Result Handling after Redirect) ---
  useEffect(() => {
    // Only proceed if Firebase Auth is initialized and no user is currently authenticated
    // and we're not already actively trying to log in (to avoid race conditions)
    if (isInitialized && !user && !isLoggingIn) { // Add !user and !isLoggingIn to prevent unnecessary re-runs
      const processRedirectResult = async () => {
        setIsLoading(true); // Show loading spinner immediately on component mount after redirect
        setIsLoggingIn(true); // Keep login state active during processing
        setError(""); // Clear any previous errors

        try {
          const result = await getRedirectResult(auth);

          if (result) {
            const firebaseUser = result.user;
            console.log("Redirect result user:", firebaseUser);

            const idToken = await firebaseUser.getIdToken(true);

            let response = await fetch(`${backendUrl}/api/Account/firebase-login`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(idToken)
            });

            if (response.status === 401) {
              console.log("User not found, registering...");
              try {
                response = await fetch(`${backendUrl}/api/Account/firebase-register`, {
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
                } else {
                  console.log("SSO REGISTRATION COMPLETE");
                }
              } catch (sqlError) {
                console.error("SQL registration failed, deleting Firebase user...", sqlError);
                try {
                  await firebaseUser.delete(); // Delete dangling Firebase user
                  console.log("Firebase user deleted due to SQL failure");
                } catch (deleteError) {
                  console.error("Failed to delete Firebase user:", deleteError);
                }
                throw sqlError; // Re-throw to propagate to the main catch block
              }
            }

            if (!response.ok) {
              const errorData = await response.text();
              throw new Error(`Backend login/register failed: ${response.status} - ${errorData}`);
            }

            const authResponse = await response.json();
            console.log("THE AUTHRESPONSE FROM SSO", authResponse);

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
            router.replace("/"); // Redirect to home on successful login
          } else {
            // No redirect result. This happens on initial load when no redirect occurred.
            // Ensure loading states are off if no processing happened.
            setIsLoading(false);
            setIsLoggingIn(false);
          }
        } catch (error) {
          console.error("SSO redirect processing error:", error); // Keep this detailed log
          
          if (error.code === "auth/popup-closed-by-user" || error.code === "auth/cancelled-popup-request" || error.code === "auth/redirect-cancelled-by-user") {
            toast.info("Google login interrupted or cancelled.");
            setError("Google login interrupted."); // Set error for display
            await logout(); // Clear any partial Firebase session
          } else if (error.message && error.message.includes("Backend login/register failed")) {
            toast.error("Google signup/login failed due to backend issue. Please try again.");
            setError(error.message); // Display specific backend error
            await logout(); // Clear any partial Firebase session
          } else {
            toast.error("An unexpected error occurred during Google login. Please try again.");
            setError("An unexpected error occurred during Google login."); // Generic error for display
            await logout(); // Clear any partial Firebase session
          }
        } finally {
          setIsLoading(false);
          setIsLoggingIn(false);
        }
      };

      processRedirectResult();
    }
  }, [auth, backendUrl, isInitialized, isLoggingIn, login, logout, router, user]); // Added isInitialized, isLoggingIn, logout as dependencies

  // --- Existing Redirection Logic ---
  useEffect(() => {
    // This effect should only trigger if the user object *is* already valid and verified,
    // and we're not currently in the middle of an active login process.
    if (isInitialized && user && user?.emailVerified && !isLoading && !isLoggingIn) {
      router.replace("/");
    }
  }, [isInitialized, user, router, isLoading, isLoggingIn]); // Removed isProcessingRedirect

  // --- Loading Screen Logic ---
  // Show loading if Firebase is not initialized, OR a login process (any type) is active,
  // OR the user is valid but hasn't had their email verified yet (implies in a pending state
  // after registration, where they might be waiting for email verification).
  if (!isInitialized || isLoggingIn || (user && !user?.emailVerified)) {
    return (
      <div className="fixed inset-0 bg-white dark:bg-black z-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
          <p className="text-gray-600 dark:text-white text-lg font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  // If we reach here, and user is already email verified, component should not render login form.
  // This typically means they are logged in and verified, and should have been redirected by the above useEffect.
  // This return null acts as a failsafe if the redirection is somehow delayed or missed.
  if (user?.emailVerified) {
    return null;
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
              disabled={isLoading || isLoggingIn} // Disable button if any login process is active
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
              {error}
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
                disabled={isLoading || isLoggingIn}
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
                disabled={isLoading || isLoggingIn}
              />
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full bg-blue-600 dark:bg-blue-700 hover:bg-blue-700 dark:hover:bg-blue-600 text-white py-3 px-4 rounded-xl font-semibold text-lg transition-colors flex items-center justify-center mb-5"
              disabled={isLoading || isLoggingIn}
            >
              {isLoading || isLoggingIn ? (
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
              Don&apos;t have an account?{" "}
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