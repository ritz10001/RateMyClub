"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Menu, X, Bell } from "lucide-react";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useRouter } from 'next/navigation';
import { useTheme } from "next-themes";
import { Switch } from "@/components/ui/switch";
import { Sun, Moon } from "lucide-react";
import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { User, LogOut, ListChecks, Star, ChevronDown, Info, HelpCircle, School, Heart, ChartColumn, NotebookPen } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, isInitialized, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const handleToggle = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };
  const router = useRouter();

  // Fixed logout handler
  const handleLogout = async () => {
    try {
      await logout(); // Use the logout from AuthContext
      router.replace("/");
      setIsMenuOpen(false);
    } 
    catch (error) {
      console.error("Logout error:", error);
    }
  }

  if (!isInitialized) {
    return (
      <header className="border-b border-blue-100 dark:border-blue-900 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" onClick={() => setIsMenuOpen(false)} className="flex items-center space-x-2">
              <div className="w-10 h-10 rounded-full flex items-center justify-center">
                <Image 
                  src="/ratemycollegeclub.png" 
                  alt="Rate My College Club Logo" 
                  width={40} 
                  height={40} 
                  priority 
                />
              </div>
              <span className="font-bold text-xl text-gray-800 dark:text-gray-200">RateMyCollegeClub</span>
            </Link>
            <div className="text-gray-500 dark:text-gray-400">Loading...</div>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="border-b border-blue-100 dark:border-blue-900 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" onClick={() => setIsMenuOpen(false)} className="flex items-center space-x-2">
            <div className="w-10 h-10 rounded-full flex items-center justify-center">
              <Image 
                src="/ratemycollegeclub.png" 
                alt="Rate My College Club Logo" 
                width={40} 
                height={40} 
                priority 
              />
            </div>
            <span className="font-bold text-xl text-gray-800 dark:text-gray-200">RateMyCollegeClub</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <nav className="flex space-x-6 items-center text-black dark:text-gray-200">
              <Link href="/all-schools" className=" hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                Schools
              </Link>
              <Link href="/about" className=" hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                About
              </Link>
              <Link href="/help-center" className=" hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                Help
              </Link>
              {!user &&
              <div className="flex items-center space-x-3">
                <Moon className="h-5 w-5" />
                <Switch className="data-[state=checked]:bg-blue-500 data-[state=unchecked]:bg-gray-200" checked={theme === "dark"} onCheckedChange={handleToggle} />
              </div>}
              {user && 
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button className="relative hover:text-blue-600 dark:hover:text-blue-400 rounded-full transition-colors">
                        <Bell className="w-5 h-5 text-center" />
                        <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                      </button>
                    </TooltipTrigger>
                    <TooltipContent className="bg-white dark:bg-zinc-800 text-black dark:text-white border border-gray-200 dark:border-zinc-700">
                      <p>Notifications Coming soon!</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              }

              {/* Desktop Auth Buttons */}
              {user && user.firstName ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="hidden md:flex items-center text-black dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-zinc-800">
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
                  <DropdownMenuContent align="end" className="w-48 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 text-gray-700 dark:text-gray-200">
                    <DropdownMenuLabel className="px-4 font-semibold">
                      Account
                    </DropdownMenuLabel>
                    <DropdownMenuItem asChild>
                      <Link href="/my-requests" className="flex items-center space-x-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-zinc-800">
                        <ListChecks className="w-4 h-4 stroke-green-500" />
                        <span>My Requests</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/my-reviews" className="flex items-center space-x-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-zinc-800">
                        <Star className="w-4 h-4 stroke-amber-500" />
                        <span>My Reviews</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/saved-clubs" className="flex items-center space-x-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-zinc-800">
                        <Heart className="w-4 h-4 stroke-red-500" />
                        <span>My Saved Clubs</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/user-profile" className="flex items-center space-x-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-zinc-800">
                        <User className="w-4 h-4 stroke-blue-500" />
                        <span>My Profile</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={handleLogout}
                      className="flex items-center space-x-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-950 dark:hover:text-red-400"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-gray-200 dark:bg-zinc-700" />
                    <DropdownMenuLabel className="px-4 font-semibold">
                      Preferences
                    </DropdownMenuLabel>
                    <DropdownMenuItem 
                    className="flex items-center justify-between text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-zinc-800"
                    onSelect={(e) => e.preventDefault()}
                    >
                      <div className="flex items-center space-x-2">
                        <Moon className="h-4 w-4" />
                        <span>Dark Mode</span>
                      </div>
                      <Switch className="data-[state=checked]:bg-blue-500 data-[state=unchecked]:bg-gray-200" checked={theme === "dark"} onCheckedChange={handleToggle} />
                    </DropdownMenuItem>
                    {user && user.roles.includes("Administrator") &&
                      <>
                        <DropdownMenuSeparator className="bg-gray-200 dark:bg-zinc-700" />
                        <DropdownMenuLabel className="px-4 font-semibold">
                          Admin
                        </DropdownMenuLabel>
                        <DropdownMenuItem asChild>
                          <Link href="/admin/dashboard" className="flex items-center space-x-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-zinc-800">
                            <ChartColumn className="w-4 h-4 stroke-blue-500" />
                            <span>Dashboard</span>
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href="/admin/school/new" className="flex items-center space-x-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-zinc-800">
                            <NotebookPen className="w-4 h-4 stroke-blue-500" />
                            <span>Add School</span>
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href="/admin/club/new" className="flex items-center space-x-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-zinc-800">
                            <NotebookPen className="w-4 h-4 stroke-blue-500" />
                            <span>Add Club</span>
                          </Link>
                        </DropdownMenuItem>
                      </>
                    }
                  </DropdownMenuContent>
                </DropdownMenu>
              ) 
              : 
              (
                <div className="hidden md:flex items-center space-x-3">
                  <Button variant="ghost" className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950" asChild>
                    <Link href="/login">Log In</Link>
                  </Button>
                  <Button className="bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600 text-white" asChild>
                    <Link href="/signup">Sign Up</Link>
                  </Button>
                </div>
              )}
            </nav>
          </div>
          <div className="md:hidden flex items-center space-x-3">
            {user && 
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button className="relative hover:text-blue-600 dark:hover:text-blue-400 rounded-full transition-colors">
                      <Bell className="w-5 h-5 text-center" />
                      {/* Optional notification badge */}
                      <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Notifications Coming soon!</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            }
          </div>
          {/* Mobile Menu Button */}
          <button 
            className="md:hidden p-2" 
            onClick={() => setIsMenuOpen(!isMenuOpen)} 
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="w-6 h-6 text-gray-600 dark:text-gray-400" /> : <Menu className="w-6 h-6 text-gray-600 dark:text-gray-400" />}
          </button>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden border-blue-100 dark:border-blue-900 bg-white dark:bg-zinc-950 max-h-[calc(100vh-88px)] overflow-y-auto">
          <nav className="flex flex-col pb-4 mt-3">
            {user ?
             (
            <div className="flex items-center justify-center space-x-2 px-4 mb-2">
              {user.photoURL && 
                <img
                  src={user.photoURL || "/placeholder.svg?height=120&width=120&text=Profile"}
                  alt="Profile"
                  className="w-8 h-8 rounded-full object-cover"
                />
              }
              <span className="text-black dark:text-white font-semibold text-center">Hello, {user.firstName}</span>
            </div>
             ) 
            : null}
            <span className="block mb-2 px-4 text-gray-700 dark:text-gray-400 font-semibold">Information</span>
            <Link
              href="/all-schools"
              onClick={() => setIsMenuOpen(false)}
              className="flex items-center space-x-2 px-4 py-2 text-gray-600 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-zinc-800 rounded transition-colors"
            >
              <School className="w-5 h-5 stroke-blue-600 dark:stroke-blue-400" />
              <span>Schools</span>
            </Link>
            <Link
              href="/about"
              onClick={() => setIsMenuOpen(false)}
              className="flex items-center space-x-2 px-4 py-2 text-gray-600 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-zinc-800 rounded transition-colors"
            >
              <Info className="w-5 h-5 stroke-amber-500 dark:stroke-amber-400" />
              <span>About</span>
            </Link>
            <Link
              href="/help-center"
              onClick={() => setIsMenuOpen(false)}
              className="flex items-center space-x-2 px-4 py-2 text-gray-600 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-zinc-800 rounded transition-colors"
            >
              <HelpCircle className="w-5 h-5 stroke-blue-600 dark:stroke-blue-400" />
              <span>Help</span>
            </Link>
            <div className="mt-2 pt-4 border-blue-100 dark:border-blue-900">
              <span className="block mb-2 px-4 text-gray-700 dark:text-gray-400 font-semibold">Preferences</span>
              <div className="flex items-center mb-2 space-x-2 px-4 py-2 text-gray-600 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-zinc-800 rounded transition-colors">
                <Moon className="h-5 w-5" />
                <span>Dark Mode</span>
                <Switch className="data-[state=checked]:bg-blue-500 data-[state=unchecked]:bg-gray-200" checked={theme === "dark"} onCheckedChange={handleToggle} />
              </div>
            </div>

            {/* Add account section here */}
            {user && (
              <>
                <div className="mt-2 pt-4 border-blue-100 dark:border-blue-900">
                  <span className="block mb-2 px-4 text-gray-700 dark:text-gray-400 font-semibold">Account</span>
                  <Link
                    href="/my-requests"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center space-x-2 px-4 py-2 text-gray-600 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-zinc-800 rounded transition-colors"
                  >
                    <ListChecks className="w-5 h-5 stroke-green-500 dark:stroke-green-400" />
                    <span>My Requests</span>
                  </Link>
                  <Link
                    href="/my-reviews"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center space-x-2 px-4 py-2 text-gray-600 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-zinc-800 rounded transition-colors"
                  >
                    <Star className="w-5 h-5 stroke-amber-500 dark:stroke-amber-400" />
                    <span>My Reviews</span>
                  </Link>
                  <Link
                    href="/saved-clubs"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center space-x-2 px-4 py-2 text-gray-600 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-zinc-800 rounded transition-colors"
                  >
                    <Heart className="w-5 h-5 stroke-red-500 dark:stroke-red-400" />
                    <span>My Saved Clubs</span>
                  </Link>
                  <Link 
                    href="/user-profile" 
                    className="flex items-center space-x-2 px-4 py-2 text-gray-600 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-zinc-800 rounded transition-colors"
                    onClick={() => setIsMenuOpen(false)}>
                    <User className="w-5 h-5 stroke-blue-500 dark:stroke-blue-400" />
                    <span>My Profile</span>
                  </Link>
                
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                    className="flex items-center space-x-2 px-4 py-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950 rounded transition-colors w-full"
                  >
                    <LogOut className="w-5 h-5" />
                    <span>Sign Out</span>
                  </button>
                </div>
                {user && user.roles.includes("Administrator") && 
                  <div className="mt-2 pt-4 border-blue-100 dark:border-blue-900">
                    <span className="block mb-2 px-4 text-gray-700 dark:text-gray-400 font-semibold">Admin</span>
                    <Link
                      href="/admin/dashboard"
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center space-x-2 px-4 py-2 text-gray-600 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-zinc-800 rounded transition-colors"
                    >
                      <ChartColumn className="w-5 h-5 stroke-red-500 dark:stroke-red-400" />
                      <span>Dashboard</span>
                    </Link>
                    <Link
                      href="/admin/school/new"
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center space-x-2 px-4 py-2 text-gray-600 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-zinc-800 rounded transition-colors"
                    >
                      <NotebookPen className="w-5 h-5 stroke-blue-500 dark:stroke-blue-400" />
                      <span>Add School</span>
                    </Link>
                    <Link
                      href="/admin/club/new"
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center space-x-2 px-4 py-2 text-gray-600 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-zinc-800 rounded transition-colors"
                    >
                      <NotebookPen className="w-5 h-5 stroke-blue-500 dark:stroke-blue-400" />
                      <span>Add Club</span>
                    </Link>
                  </div>
                }
              </>
            )}

            {!user && (
              <div className="flex flex-col pt-4 border-blue-100 dark:border-blue-900">
                <span className="block mb-2 px-4 text-gray-700 dark:text-gray-400 font-semibold">Account</span>
                <Link
                  href="/login"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center space-x-2 px-4 py-2 text-gray-600 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-zinc-800 rounded transition-colors"
                >
                  <ListChecks className="w-5 h-5 stroke-green-500 dark:stroke-green-400" />
                  <span>Log In</span>
                </Link>
                <Link
                  href="/signup"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center space-x-2 px-4 pt-2 text-gray-600 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-zinc-800 rounded transition-colors"
                >
                  <ListChecks className="w-5 h-5 stroke-green-500 dark:stroke-green-400" />
                  <span>Sign Up</span>
                </Link>
              </div>
            )}
          </nav>
        </div>
      )}
  </header>
  )
}