"use client"

import { Button } from "@/components/ui/button"
import { X, User, ArrowRight } from "lucide-react"
import { useRouter } from "next/navigation"

export default function ProfileCompletionToast({ show, onClose }) {
  const router = useRouter()

  const handleCompleteProfile = () => {
    onClose()
    router.push("/profile")
  }

  if (!show) return null

  return (
    <div className="fixed inset-0 z-50 pointer-events-none">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" />

      {/* Toast */}
      <div className="flex items-start justify-center pt-20 px-4 h-full pointer-events-none">
        <div className="bg-white rounded-2xl shadow-2xl border border-blue-100 max-w-md w-full pointer-events-auto">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1 rounded-full hover:bg-gray-100 transition-colors"
          >
            <X className="w-4 h-4 text-gray-500" />
          </button>

          {/* Content */}
          <div className="p-6">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="w-6 h-6 text-green-600" />
            </div>

            <h3 className="text-xl font-bold text-gray-900 text-center mb-2">Registration Complete! 🎉</h3>

            <p className="text-gray-600 text-center mb-6">
              Welcome! Complete your profile to get personalized club recommendations.
            </p>

            <div className="space-y-3">
              <Button
                onClick={handleCompleteProfile}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2"
              >
                Complete Profile Here
                <ArrowRight className="w-4 h-4" />
              </Button>

              <Button
                onClick={onClose}
                variant="ghost"
                className="w-full text-gray-600 hover:bg-gray-50 py-2 rounded-xl font-medium"
              >
                Maybe Later
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
