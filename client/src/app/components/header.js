"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Menu, X } from "lucide-react"
import { useState } from "react"
import { useAuth } from "../context/AuthContext"
import { useRouter } from 'next/navigation'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { User, LogOut, ListChecks, Star, ChevronDown, Info, HelpCircle, School, Heart, ChartColumn, NotebookPen } from "lucide-react";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, isInitialized, logout } = useAuth();
  console.log("user info from the header file", user);
  const router = useRouter();

  // Fixed logout handler
  const handleLogout = async () => {
    try {
      await logout(); // Use the logout from AuthContext
      router.push("/");
      setIsMenuOpen(false);
    } catch (error) {
      console.error("Logout error:", error);
    }
  }

  // Debug logging
  console.log("Header render - isInitialized:", isInitialized, "user:", user);

  if (!isInitialized) {
    return (
      <header className="border-b border-blue-100 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" onClick={() => setIsMenuOpen(false)} className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-lg">RC</span>
              </div>
              <span className="font-bold text-xl text-gray-800">RateMyCollegeClub</span>
            </Link>
            <div className="text-gray-500">Loading...</div>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="border-b border-blue-100 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" onClick={() => setIsMenuOpen(false)} className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-lg">RC</span>
            </div>
            <span className="font-bold text-xl text-gray-800">RateMyCollegeClub</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <nav className="flex space-x-6 items-center text-black">
              <Link href="/all-schools" className=" hover:text-blue-600 transition-colors">
                Schools
              </Link>
              <Link href="/about" className=" hover:text-blue-600 transition-colors">
                About
              </Link>
              <Link href="/help" className=" hover:text-blue-600 transition-colors">
                Help
              </Link>
            

            {/* Desktop Auth Buttons */}
            {user && user.firstName ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="hidden md:flex items-center">
                    {user.photoURL ?(
                <img
                  src={user.photoURL || "/placeholder.svg?height=120&width=120&text=Profile"}
                  alt="Profile"
                  className="w-8 h-8 rounded-full object-cover"
                />
                ) 
                :(<User className="w-4 h-4 stroke-current" />)}
                    <span>Hello, {user.firstName}</span>
                    <ChevronDown />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuLabel className="px-4 text-gray-700 font-semibold">
                    Account
                  </DropdownMenuLabel>
                  <DropdownMenuItem asChild>
                    <Link href="/my-requests" className="flex items-center space-x-2">
                      <ListChecks className="w-4 h-4 stroke-green-500" />
                      <span>My Requests</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/my-reviews" className="flex items-center space-x-2">
                      <Star className="w-4 h-4 stroke-amber-500" />
                      <span>My Reviews</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/saved-clubs" className="flex items-center space-x-2">
                      <Heart className="w-4 h-4 stroke-red-500" />
                      <span>My Saved Clubs</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="flex items-center space-x-2 text-red-600"
                  >
                    <LogOut className="w-4 h-4 stroke-red-500" />
                    <span>Sign Out</span>
                  </DropdownMenuItem>
                  {user && user.roles.includes("Administrator") &&
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuLabel className="px-4 text-gray-700 font-semibold">
                        Admin
                      </DropdownMenuLabel>
                      <DropdownMenuItem asChild>
                        <Link href="/admin/dashboard" className="flex items-center space-x-2">
                          <ChartColumn className="w-4 h-4 stroke-blue-500" />
                          <span>Dashboard</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/admin/school/new" className="flex items-center space-x-2">
                          <NotebookPen className="w-4 h-4 stroke-blue-500" />
                          <span>Add School</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/admin/club/new" className="flex items-center space-x-2">
                          <NotebookPen className="w-4 h-4 stroke-blue-500" />
                          <span>Add Club</span>
                        </Link>
                      </DropdownMenuItem>
                    </>
                  }
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="hidden md:flex items-center space-x-3">
                <Button variant="ghost" className="text-blue-600 hover:text-blue-700 hover:bg-blue-50" asChild>
                  <Link href="/login">Log In</Link>
                </Button>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white" asChild>
                  <Link href="/signup">Sign Up</Link>
                </Button>
              </div>
            )}
            </nav>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden p-2" 
            onClick={() => setIsMenuOpen(!isMenuOpen)} 
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="w-6 h-6 text-gray-600" /> : <Menu className="w-6 h-6 text-gray-600" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-2 pt-2 border-t border-blue-100">
            <nav className="flex flex-col mt-3">
              {user ?
               (
               <div className="flex items-center justify-center space-x-2 px-4 py-2">
                {user.photoURL && 
                  <img
                    src={user.photoURL || "/placeholder.svg?height=120&width=120&text=Profile"}
                    alt="Profile"
                    className="w-8 h-8 rounded-full object-cover"
                  />
                }
                <span className="text-black font-semibold text-center">Hello, {user.firstName}</span>
               </div>
                ) 
              : null}
              <span className="block mb-2 px-4 text-gray-700 font-semibold">Information</span>
              <Link
                href="/all-schools"
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
              >
                <School className="w-5 h-5 stroke-blue-600" />
                <span>Schools</span>
              </Link>
              <Link
                href="/about"
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
              >
                <Info className="w-5 h-5 stroke-amber-500" />
                <span>About</span>
              </Link>
              <Link
                href="/help"
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
              >
                <HelpCircle className="w-5 h-5 stroke-blue-600" />
                <span>Help</span>
              </Link>

              {/* Add account section here */}
              {user && (
                <>
                  <div className="mt-2 pt-4 border-t border-blue-100">
                    <span className="block mb-2 px-4 text-gray-700 font-semibold">Account</span>
                    <Link
                      href="/my-requests"
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                    >
                      <ListChecks className="w-5 h-5 stroke-green-500" />
                      <span>My Requests</span>
                    </Link>
                    <Link
                      href="/my-reviews"
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                    >
                      <Star className="w-5 h-5 stroke-amber-500" />
                      <span>My Reviews</span>
                    </Link>
                    <Link
                      href="/saved-clubs"
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                    >
                      <Heart className="w-5 h-5 stroke-red-500" />
                      <span>My Saved Clubs</span>
                    </Link>
                    <button
                      onClick={() => {
                        handleLogout();
                        setIsMenuOpen(false);
                      }}
                      className="flex items-center space-x-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded transition-colors w-full"
                    >
                      <LogOut className="w-5 h-5" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                  {user && user.roles.includes("Administrator") && 
                    <div className="mt-2 pt-4 border-t border-blue-100">
                      <span className="block mb-2 px-4 text-gray-700 font-semibold">Admin</span>
                      <Link
                        href="/admin/dashboard"
                        onClick={() => setIsMenuOpen(false)}
                        className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                      >
                        <ChartColumn className="w-5 h-5 stroke-red-500" />
                        <span>Dashboard</span>
                      </Link>
                      <Link
                        href="/admin/school/new"
                        onClick={() => setIsMenuOpen(false)}
                        className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                      >
                        <NotebookPen className="w-5 h-5 stroke-blue-500" />
                        <span>Add School</span>
                      </Link>
                      <Link
                        href="/admin/club/new"
                        onClick={() => setIsMenuOpen(false)}
                        className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                      >
                        <NotebookPen className="w-5 h-5 stroke-blue-500" />
                        <span>Add Club</span>
                      </Link>
                    </div>
                  }
                </>
              )}

              {!user && (
                <div className="flex flex-col pt-4 border-t border-blue-100">
                  <span className="block mb-2 px-4 text-gray-700 font-semibold">Account</span>
                  <Link
                    href="/login"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                  >
                    <ListChecks className="w-5 h-5 stroke-green-500" />
                    <span>Log In</span>
                  </Link>
                  <Link
                    href="/signup"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center space-x-2 px-4 pt-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                  >
                    <ListChecks className="w-5 h-5 stroke-green-500" />
                    <span>Sign Up</span>
                  </Link>
                </div>
              )}
            </nav>
          </div>
        )}

      </div>
    </header>
  )
}