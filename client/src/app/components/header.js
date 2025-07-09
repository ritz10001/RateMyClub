"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Menu, X } from "lucide-react"
import { useState } from "react"
import { useAuth } from "../context/AuthContext"
import { useRouter } from 'next/navigation'
import { useEffect } from "react"
// import { useAuth } from "../context/AuthContext"

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, setUser, isInitialized } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("token");
    router.push("/");
  }

  if (!isInitialized) {
    return (
      <header className="border-b border-blue-100 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="px-4 py-4">
          {/* Empty header while loading */}
        </div>
      </header>
    );
  }

  return (
    <header className="border-b border-blue-100 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-lg">RC</span>
            </div>
            <span className="font-bold text-xl text-gray-800">RateMyCollegeClub</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/directory" className="text-gray-600 hover:text-blue-600 transition-colors">
              Directory
            </Link>
            <Link href="/about" className="text-gray-600 hover:text-blue-600 transition-colors">
              About
            </Link>
            <Link href="/help" className="text-gray-600 hover:text-blue-600 transition-colors">
              Help
            </Link>
          </nav>

          {/* Desktop Auth Buttons */}
          {user ? (
           <div className="hidden md:flex items-center space-x-3">
              <span>Hello, {user.firstName}</span>
            <Button onClick={handleLogout} className="bg-blue-600 hover:bg-blue-700 text-white" asChild>
              <Link href="/">Log Out</Link>
            </Button>
          </div>
          ): (
          <div className="hidden md:flex items-center space-x-3">
            <Button variant="ghost" className="text-blue-600 hover:text-blue-700 hover:bg-blue-50" asChild>
              <Link href="/login">Log In</Link>
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white" asChild>
              <Link href="/signup">Sign Up</Link>
            </Button>
          </div>
        )}
          

          {/* Mobile Menu Button */}
          <button className="md:hidden p-2" onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label="Toggle menu">
            {isMenuOpen ? <X className="w-6 h-6 text-gray-600" /> : <Menu className="w-6 h-6 text-gray-600" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-blue-100">
            <nav className="flex flex-col space-y-4 mt-4">
              {user ? <span className="text-gray-800 text-center">Hello, {user.firstName}</span> : null}
              <Link
                href="/directory"
                className="text-gray-600 hover:text-blue-600 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Directory
              </Link>
              <Link
                href="/about"
                className="text-gray-600 hover:text-blue-600 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </Link>
              <Link
                href="/help"
                className="text-gray-600 hover:text-blue-600 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Help
              </Link>
              <div className="flex flex-col space-y-2 pt-4 border-t border-blue-100">
                {user ? (
                  <>
                    <Button 
                      onClick={() => {
                        handleLogout();
                        setIsMenuOpen(false);
                      }}
                      className="bg-blue-600 hover:bg-blue-700 text-white justify-start"
                    >
                      Log Out
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      variant="ghost"
                      className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 justify-start"
                      asChild
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <Link href="/login">Log In</Link>
                    </Button>
                    <Button 
                      className="bg-blue-600 hover:bg-blue-700 text-white justify-start"
                      asChild
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <Link href="/signup">Sign Up</Link>
                    </Button>
                  </>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
