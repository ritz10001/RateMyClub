"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"
import { useState } from "react"
import { useAuth } from "../context/AuthContext"
import { useRouter } from "next/navigation"

export default function SignUpPage() {
  const router = useRouter();
  const { user, setUser } = useAuth();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    school: "",
  })
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (formData.password !== formData.confirmPassword) {
      setError(true);
      setErrorMessage(""); // Clear any previous specific message
      return;
    }
    try{
      const response = await fetch("http://localhost:5095/api/Account/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          password: formData.password,
          schoolName: formData.school || null,
        })
      })
      if(response.ok){
        const authResponse = await response.json();
        console.log('Sign up successful:', authResponse);
        const userData = {
          firstName: authResponse.firstName,
          lastName: authResponse.lastName,
          userId: authResponse.userId,
          token: authResponse.token,
          refreshToken: authResponse.refreshToken
        };
        setUser(userData);
        localStorage.setItem("token", authResponse.token);
        setTimeout(() => {
          console.log("handleSubmit: Navigating to /");
          router.push("/");
        }, 100);
      }
      else if(response.status === 400){
        const errorData = await response.json();
        
        console.log('Sign up failed: Invalid data');
        if("type" in errorData){
          setErrorMessage(errorData.errors["Password"][0])
        }
        else{
          setErrorMessage(Object.values(errorData).map(arr => arr[0]).join('\n'));
        }
        setError(true);
      }
    }
    catch(error){
      setError(true);
      console.error('Sign up error:', error);
      setErrorMessage("Network error. Please try again.");
    }
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
                Select your school <span className="text-gray-400"></span>
              </Label>
              <Select onValueChange={(value) => handleInputChange("school", value)}>
                <SelectTrigger className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500">
                  <SelectValue placeholder="Choose your school..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Texas Tech University">Texas Tech University</SelectItem>
                  <SelectItem value="Massachusetts Institute of Technology">Massachusetts Institute of Technology</SelectItem>
                  <SelectItem value="Stanford University">Stanford University</SelectItem>
                  <SelectItem value="UC Berkeley">UC Berkeley</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

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
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-xl font-semibold text-lg transition-colors"
            >
              Sign Up
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
