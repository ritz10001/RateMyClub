"use client"

import { Button } from "@/components/ui/button"
import { SquarePen, Star, UserRound, X } from "lucide-react"
import Link from "next/link"
import { useEffect } from "react"

export default function LoginModal({ isOpen, onClose }) {
  const features = [
    {
      icon: SquarePen,
      title: "Write Reviews",
      description: "Create and manage your club reviews",
    },
    {
      icon: Star,
      title: "Rate & Vote",
      description: "Rate clubs and vote on other reviews",
    },
    {
      icon: UserRound,
      title: "Stay Anonymous",
      description: "Your identity remains private and secure",
    },
  ]

  // Handle escape key press
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener("keydown", handleEscape)
      document.body.style.overflow = "hidden" // Prevent background scrolling
    }

    return () => {
      document.removeEventListener("keydown", handleEscape)
      document.body.style.overflow = "unset"
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-grey-500/50 backdrop-blur-sm" onClick={onClose} />

      {/* Modal Content */}
      <div className="relative bg-white rounded-2xl shadow-2xl border border-blue-100 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition-colors z-10"
          aria-label="Close modal"
        >
          <X className="w-5 h-5 text-gray-500" />
        </button>

        {/* Modal Header */}
        <div className="text-center pt-8 pb-6 px-6">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <UserRound className="w-8 h-8 text-blue-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Create an Account</h2>
          <p className="text-gray-600 text-lg">
            You need an account to access this feature. Join thousands of students sharing their experiences!
          </p>
        </div>

        {/* Features Section */}
        <div className="px-6 pb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {features.map((feature, index) => {
              const IconComponent = feature.icon
              return (
                <div key={index} className="bg-blue-50 rounded-xl p-4 border border-blue-100 text-center">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mb-3 mx-auto">
                    <IconComponent className="w-5 h-5 text-blue-600" />
                  </div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-1">{feature.title}</h3>
                  <p className="text-xs text-gray-600">{feature.description}</p>
                </div>
              )
            })}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="px-6 pb-6">
          <div className="space-y-3">
            <Button
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold text-lg"
              asChild
            >
              <Link href="/signup" onClick={onClose}>
                Create Account
              </Link>
            </Button>

            <div className="text-center">
              <span className="text-gray-600">Already have an account? </span>
              <Link
                href="/login"
                onClick={onClose}
                className="text-blue-600 hover:text-blue-700 font-medium underline underline-offset-4"
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
