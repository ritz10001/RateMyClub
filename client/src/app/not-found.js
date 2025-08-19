"use client"

import { Button } from "@/components/ui/button"
import { Home, Search, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center py-12 px-4 dark:from-zinc-950 dark:to-black">
      <div className="max-w-md w-full text-center">
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-blue-100 dark:bg-zinc-800 dark:border-zinc-700 dark:shadow-2xl">
          {/* 404 Icon */}
          <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6 dark:bg-blue-900">
            <span className="text-4xl font-bold text-blue-600 dark:text-blue-400">404</span>
          </div>

          {/* Title */}
          <h1 className="text-3xl font-bold text-gray-900 mb-4 dark:text-gray-100">Page Not Found</h1>

          {/* Description */}
          <p className="text-gray-600 mb-8 dark:text-gray-400">
            Oops! The page you're looking for doesn't exist. It might have been moved, deleted, or you entered the wrong
            URL.
          </p>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold dark:bg-blue-500 dark:hover:bg-blue-600" asChild>
              <Link href="/">
                <Home className="w-4 h-4 mr-2" />
                Go Home
              </Link>
            </Button>

            <Button
              variant="outline"
              className="w-full border-2 border-blue-200 text-blue-600 hover:bg-blue-50 py-3 rounded-xl font-semibold bg-transparent dark:border-blue-700 dark:text-blue-400 dark:hover:bg-blue-900 dark:hover:text-blue-300"
              asChild
            >
              <Link href="/all-schools">
                <Search className="w-4 h-4 mr-2" />
                Browse Schools
              </Link>
            </Button>

            <Button
              variant="ghost"
              className="w-full text-gray-600 hover:bg-gray-50 py-2 rounded-xl font-medium dark:text-gray-400 dark:hover:bg-zinc-700"
              onClick={() => window.history.back()}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Go Back
            </Button>
          </div>

          {/* Help Text */}
          <div className="mt-8 pt-6 border-t border-gray-200 dark:border-zinc-700">
            <p className="text-sm text-gray-500 mb-2 dark:text-gray-400">Need help?</p>
            <Link
              href="/help"
              className="text-blue-600 hover:text-blue-700 font-medium text-sm underline underline-offset-4 dark:text-blue-400 dark:hover:text-blue-500"
            >
              Contact Support
            </Link>
          </div>
        </div>

        {/* Fun Message */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">🎓 Lost? Don't worry, even the best students get lost sometimes!</p>
        </div>
      </div>
    </div>
  )
}