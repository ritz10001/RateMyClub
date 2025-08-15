"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { getAuth, createUserWithEmailAndPassword, sendEmailVerification, updateProfile } from "firebase/auth";
import { app } from "../utils/firebase";
import axios from "axios";
import GuestRoute from "../components/GuestRoute";

export default function SignUpPage(){
  return (
    <GuestRoute>
      <SignUpContent />
    </GuestRoute>
  );
}

function SignUpContent() {
  const router = useRouter();
  const auth = getAuth(app);
  const { user, setUser } = useAuth();
  const [isLoadingTag, setIsLoadingTag] = useState(true);
  const [selectedTags, setSelectedTags] = useState([]);
  const [tags, setTags] = useState(null);
  const [schoolSearchTerm, setSchoolSearchTerm] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    universityId: null,
    tagIds: [],
    idToken: null
  })
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [universities, setUniversities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    console.log(formData);
  }, [formData]);
  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  useEffect(() => {
    const fetchUniversities = async () => {
      try {
        const response = await fetch("http://localhost:5095/api/University/all-colleges", {
          headers: {
            "Content-Type": "application/json"
          }
        });
        if(response.ok){
          const data = await response.json();
          setUniversities(data);
          console.log(data);
        }
        else{
          console.error("Error fetching univerisities");
        }
      }
      catch(err){
        console.error(err || "Error fetching universities");
      }
      finally {
        setIsLoading(false);
      }
    }
    fetchUniversities();
  }, []);

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const response = await fetch("http://localhost:5095/api/Tag");
        if(response.ok){
          const data = await response.json();
          setTags(data);
          setIsLoadingTag(false);
          console.log("HERE ARE THE TAGS", data);
        }
        else{
          console.error("Error fetching tags");
        }
      }
      catch(error){
        console.error("fetching tags failed");
      }
    }
    fetchTags();
  }, []);
  
  const handleTagClick = (tagId) => {
    console.log("SELECTED TAG", tagId);
    console.log(selectedTags);
    if(selectedTags.includes(tagId)){
      setSelectedTags(selectedTags.filter((id) => id !== tagId));
    }
    else{
      if (selectedTags.length < 5) {
        setSelectedTags([...selectedTags, tagId]);
      } 
      else {
        toast.error("You can select up to 5 tags only.");
      }
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(false);
    await new Promise(resolve => setTimeout(resolve, 200));
    // 1. Password match check
    if (formData.password !== formData.confirmPassword) {
      setError(true);
      setErrorMessage("Passwords do not match!");
      setIsSubmitting(false);  // Clear any previous specific message
      return;
    }
    let idToken;
    // 2. Register in Firebase
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      const fbUser = userCredential.user;
      // await updateProfile(user, { displayName: formData.firstName });
      // Get the Firebase ID token to send to backend
      idToken = await fbUser.getIdToken();
      // Send verification email before signing out
      // await sendEmailVerification(fbUser);
      // Sign out immediately to prevent auto-login
      await auth.signOut();
      setUser(null);
    } 
    catch (firebaseError) {
      console.error("Firebase registration error:", firebaseError);
      setError(true);
      switch (firebaseError.code) {
        case "auth/weak-password":
          setErrorMessage("Password must be at least 6 characters.");
          break;
        case "auth/email-already-in-use":
          setErrorMessage("This email is already registered.");
          break;
        case "auth/invalid-email":
          setErrorMessage("Invalid email address.");
          break;
        default:
          setErrorMessage("Firebase error: " + firebaseError.message);
      }
      setIsSubmitting(false);
      return;
    }
    // 3. Sync with backend (SQL)
    try {
      const response = await fetch("http://localhost:5095/api/Account/firebase-register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({
          firebaseIdToken: idToken,
          email: formData.email,
          firstName: formData.firstName,
          lastName: formData.lastName,
          universityId: formData.universityId,
          tagIds: selectedTags
        })
      });

      if (response.ok) {
        const { confirmationUrl, ...authResponse } = await response.json();
        console.log("Sign up successful:", authResponse);
        console.log("confirmationurl", confirmationUrl);

        const userData = {
          firstName: authResponse.firstName,
          lastName: authResponse.lastName,
          userId: authResponse.userId,
          email: authResponse.email,
          roles: authResponse.roles,
          tagIds: authResponse.tags,
          idToken: authResponse.firebaseIdToken
        };

        if (confirmationUrl) {
          router.push(`http://localhost:3000/email-confirmation?email=${encodeURIComponent(formData.email)}`);
        } 
        else {
          toast.error("No confirmation URL received. Staying on page.");
        }
      } 
      else if (response.status === 400) {
        const errorData = await response.json();
        console.log("Sign up failed: Invalid data");
        // Backend validation message handling
        if (errorData?.type) {
          setErrorMessage(errorData.errors?.Password?.[0] ?? "Invalid input.");
        } 
        else {
          setErrorMessage(
            Object.values(errorData)
              .map(arr => arr[0])
              .join("\n")
          );
        }
      } 
      else {
        throw new Error(`Unexpected backend response: ${response.status}`);
      }
    } 
    catch (networkError) {
      console.error("Network/backend error:", networkError);
      setError(true);
      setErrorMessage("A network error occurred. Please try again.");
    }
    finally {
      setIsSubmitting(false);
    }
  }

  const isEmailValid = (email) => /\S+@\S+\.\S+/.test(email);

  const isFormValid = () => {
    const { firstName, lastName, email, universityId, password, confirmPassword } = formData;
    return firstName.trim() && 
           lastName.trim() &&
           isEmailValid(email) &&
           universityId != null && 
           password.trim() != "" && 
           confirmPassword.trim() != "" &&
           password === confirmPassword
  };
  const handleGoogleLogin = async () => {
    try {
      // Sign in with firebase first
      const result = await signInWithPopup(auth, provider);
      const firebaseUser = result.user;
      
      // fetch the user token
      const idToken = await firebaseUser.getIdToken();
      let response = await fetch("http://localhost:5095/api/Account/firebase-login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(idToken)
      });
      if(response.status === 401) {
        console.log("User not found, registering...");
        response = await fetch(`http://localhost:5095/api/Account/firebase-register`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            firebaseIdToken: idToken,
            firstName: firebaseUser.displayName?.split(" ")[0] || "",
            fastName: firebaseUser.displayName?.split(" ")[1] || "",
            email: firebaseUser.email,
          })
        });
        if (!response.ok) {
          const errText = await response.text();
          throw new Error("SSO registration failed: " + errText);
        }
      }
      const authResponse = await response.json();
      const combinedUser = {
        ...firebaseUser,
        firstName: authResponse.firstName,
        lastName: authResponse.lastName,
        sqlUserId: authResponse.userId,
        roles: authResponse.roles,
        tags: authResponse.tags,
        universityId: authResponse.universityId,
      };
      login(combinedUser);
      if (!combinedUser.universityId || !combinedUser.tags?.length) {
        router.push("/user-profile");
      } 
      else {
        router.push("/"); // Existing user, go home
      }
    }
    catch(error){
      console.error("SSO error:", error);
      toast.error("Google SSO failed. Please try again");
      setError("Google SSO failed. Please try again.");
    }
    finally {
      setIsLoading(false);
    }
  }

  if (isLoading) {
    return <>
      <div className="col-span-full flex justify-center py-12 space-x-4">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        <p className="font-bold text-xl">Now Loading..</p>
      </div>
    </>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-blue-100">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-blue-600 mb-2">Sign Up</h1>
            <p className="text-gray-600">Create your account to get started</p>
          </div>

          {error && (
            <div className="mb-4 text-red-600 text-sm  whitespace-pre-line">
              {errorMessage || "Passwords do not match or data is invalid. Please check your inputs."}
            </div>
          )}
          {/* Google SSO Button */}
          <div className="mb-6">
            <Button
              onClick={handleGoogleLogin}
              variant="outline"
              className="w-full border-2 border-gray-200 hover:bg-gray-50 py-3 px-4 rounded-xl font-semibold text-gray-700 bg-white transition-colors flex items-center justify-center gap-3"
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
              Sign in with Google
            </Button>
          </div>

          {/* Divider */}
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-500 font-medium">OR</span>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* First Name */}
            <div>
              <Label htmlFor="firstName" className="text-sm font-medium text-gray-700 mb-2 block">
                First Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="firstName"
                type="text"
                value={formData.firstName}
                onChange={(e) => handleInputChange("firstName", e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
                required
              />
            </div>

            {/* Last Name */}
            <div>
              <Label htmlFor="lastName" className="text-sm font-medium text-gray-700 mb-2 block">
                Last Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="lastName"
                type="text"
                value={formData.lastName}
                onChange={(e) => handleInputChange("lastName", e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
                required
              />
            </div>

            {/* Email */}
            <div>
              <Label htmlFor="email" className="text-sm font-medium text-gray-700 mb-2 block">
                Email <span className="text-red-500">*</span>
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
                required
              />
            </div>

            {/* School Selection */}
            <div>
              <Label htmlFor="school" className="text-sm font-medium text-gray-700 mb-2 block">
                Select your school <span className="text-red-400">*</span>
              </Label>
              <Select onValueChange={(value) => handleInputChange("universityId", parseInt(value))}>
                <SelectTrigger className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500">
                  <SelectValue placeholder="Choose your school..." />
                </SelectTrigger>
                <SelectContent className="max-h-56 overflow-y-auto">
                  <div className="px-1 mb-1 sticky top-0 bg-white z-10">
                    <Input 
                      placeholder="Search schools..."
                      value={schoolSearchTerm}
                      onChange={(e) => {
                        e.stopPropagation()
                        setSchoolSearchTerm(e.target.value.toLowerCase())
                      }}
                      className="w-full"
                      onKeyDown={(e) => e.stopPropagation()}
                      onFocus={(e) => e.stopPropagation()}
                      autoFocus
                    />
                  </div>
                  {universities
                    .filter(university => 
                      !schoolSearchTerm || 
                      university.name.toLowerCase().includes(schoolSearchTerm)
                      // (university.location && university.location.toLowerCase().includes(schoolSearchTerm))
                    )
                    .map(university => (
                      <SelectItem key={university.id} value={university.id.toString()}>
                        {university.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
            {!isLoadingTag && 
                <div className="flex flex-wrap gap-2">
                  <Label htmlFor="shortDescription" className="text-sm font-medium text-gray-700 mb-2 block">
                    Select a few interests (tags) to help us recommend clubs you'll love!
                  </Label>
                  <div className="space-y-2 space-x-2">
                    {tags.map((tag) => (
                    <Button
                      key={tag.id}
                      type="button"
                      variant={selectedTags.includes(tag.id) ? "default" : "outline"}
                      onClick={() => handleTagClick(tag.id)}
                      className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                        selectedTags.includes(tag.id)
                          ? "bg-blue-600 text-white hover:bg-blue-700"
                          : "border-blue-200 text-blue-600 hover:bg-blue-50"
                      }`}
                    >
                      {tag.name.charAt(0).toUpperCase() + tag.name.slice(1)}
                    </Button>
                  ))}
                  </div>
                </div>
              }

            {/* Password */}
            <div>
              <Label htmlFor="password" className="text-sm font-medium text-gray-700 mb-2 block">
                Password <span className="text-red-500">*</span>
              </Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => handleInputChange("password", e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
                required
              />
            </div>

            {/* Confirm Password */}
            <div>
              <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700 mb-2 block">
                Re-type Password <span className="text-red-500">*</span>
              </Label>
              <Input
                id="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
                required
              />
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-xl font-semibold text-lg transition-colors flex items-center justify-center"
              disabled={isSubmitting || !isFormValid()}
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing in...
                </>
              ) : (
                "Sign Up"
              )}
            </Button>
          </form>

          {/* Login Link */}
          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Already have an account?{" "}
              <Link
                href="/login"
                className="text-blue-600 hover:text-blue-700 font-medium underline underline-offset-4"
              >
                Log in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
