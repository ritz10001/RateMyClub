"use client"

import { Button } from "@/components/ui/button"
import { Mail, Clock, HelpCircle } from "lucide-react"
import Link from "next/link"

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 border border-blue-100">
          {/* Header */}
          <div className="text-center mb-8 sm:mb-12">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
              <Mail className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">Contact Us</h1>
            <p className="text-base sm:text-lg lg:text-xl text-gray-600 leading-relaxed">
              Have a question, suggestion, or need help? We'd love to hear from you.
            </p>
          </div>

          {/* Contact Info */}
          <div className="space-y-4 sm:space-y-6">
            <div className="bg-blue-50 rounded-xl p-6 sm:p-8 border border-blue-100 text-center">
              <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3 mb-4">
                <Mail className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900">Get in Touch</h3>
              </div>
              <p className="text-gray-700 text-sm sm:text-base lg:text-lg mb-4 sm:mb-6 leading-relaxed">
                For all inquiries, support, feedback, and questions, please email us at:
              </p>
              <div className="mb-4 sm:mb-6">
                <a
                  href="mailto:ratemycollegeclubs@gmail.com"
                  className="inline-block text-md md:text-lg lg:text-xl font-semibold text-blue-600 hover:text-blue-700 underline underline-offset-4 break-all"
                >
                  ratemycollegeclubs@gmail.com
                </a>
              </div>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 text-gray-600">
                <Clock className="w-4 h-4" />
                <span className="text-xs sm:text-sm text-center">We typically respond within 24-48 hours</span>
              </div>
            </div>

            <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-4 sm:p-6 text-white text-center">
              <div className="flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 mb-3">
                <HelpCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                <h3 className="font-bold text-base sm:text-lg">Need Quick Help?</h3>
              </div>
              <p className="text-blue-100 text-sm sm:text-base mb-4 leading-relaxed">
                Check out our FAQ section for instant answers to common questions.
              </p>
              <Button
                variant="outline"
                className="border-2 border-white text-white hover:bg-white hover:text-blue-600 rounded-xl font-semibold bg-transparent w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3"
                asChild
              >
                <Link href="/help">Visit Help Center</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
