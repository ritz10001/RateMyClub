"use client"

import { useSearchParams } from "next/navigation"
import { useState, useEffect } from "react"
import { Mail, CheckCircle, RefreshCw, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import Link from "next/link"
import {user} from "../context/AuthContext"

export default function EmailConfirmationPage() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "your email";
  const [isResending, setIsResending] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  console.log("user informatioon", user);

  useEffect(() => {
    if (cooldown === 0) return;

    const timerId = setInterval(() => {
      setCooldown(prev => {
        if (prev <= 1) {
          clearInterval(timerId);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerId);
  }, [cooldown]);

  const handleResendEmail = async () => {
    if(cooldown > 0) return;
    setIsResending(true);
    try {
      const response = await fetch("http://localhost:5095/api/Account/resend-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        setEmailSent(true);
        toast.success("Verification email sent successfully!");
        setCooldown(60);
      } 
      else {
        toast.error("Please wait before requesting another verification email!");
      }
    } 
    catch (error) {
      toast.error("Something went wrong. Please try again.");
    } 
    finally {
      setIsResending(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white py-8">
      <div className="max-w-2xl mx-auto px-4">
        {/* Back Link */}
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-blue-100">
          {/* Success Icon */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Check Your Email!</h1>
            <p className="text-gray-600 text-lg">
              Thanks for signing up! We're excited to have you join our community.
            </p>
          </div>

          {/* Email Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-8">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Mail className="w-6 h-6 text-blue-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-2">Verification Email Sent</h3>
                <p className="text-gray-700 mb-3">We've sent a confirmation email to:</p>
                <div className="bg-white border border-blue-200 rounded-lg p-3 mb-3">
                  <p className="font-semibold text-blue-600 break-all">{email}</p>
                </div>
                <p className="text-sm text-gray-600">
                  Click the verification link in the email to activate your account.
                </p>
              </div>
            </div>
          </div>

          {/* Instructions */}
          <div className="mb-8">
            <h3 className="font-semibold text-gray-900 mb-4">What's next?</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-blue-600 text-sm font-bold">1</span>
                </div>
                <p className="text-gray-700">Check your email inbox (and spam folder)</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-blue-600 text-sm font-bold">2</span>
                </div>
                <p className="text-gray-700">Click the "Verify Email" button in the email</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-blue-600 text-sm font-bold">3</span>
                </div>
                <p className="text-gray-700">Start exploring clubs and sharing your experiences!</p>
              </div>
            </div>
          </div>

          {/* Resend Section */}
          <div className="border-t border-gray-200 pt-6">
            <div className="text-center">
              <p className="text-gray-600 mb-4">Didn't receive the email?</p>
              <div className="space-y-3">
                <Button
                  onClick={handleResendEmail}
                  disabled={isResending || cooldown > 0}
                  variant="outline"
                  className="border-2 border-blue-200 text-blue-600 hover:bg-blue-50 px-6 py-3 rounded-xl font-semibold bg-transparent"
                >
                  {isResending ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Resend Verification Email
                    </>
                  )}
                </Button>

                {emailSent && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                    <p className="text-green-800 text-sm">✅ Email sent! Please check your inbox.</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Help Section */}
          <div className="mt-8 pt-6 border-t border-gray-200 text-center">
            <p className="text-sm text-gray-500 mb-2">Still having trouble?</p>
            <div className="flex flex-col sm:flex-row gap-2 justify-center">
              <Link
                href="/help"
                className="text-blue-600 hover:text-blue-700 font-medium text-sm underline underline-offset-4"
              >
                Contact Support
              </Link>
              <span className="hidden sm:inline text-gray-400">•</span>
              <Link
                href="/signup"
                className="text-blue-600 hover:text-blue-700 font-medium text-sm underline underline-offset-4"
              >
                Try Signing Up Again
              </Link>
            </div>
          </div>
        </div>

        {/* Additional Tips */}
        <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-xl p-4">
          <h4 className="font-semibold text-yellow-800 mb-2">💡 Email Tips</h4>
          <ul className="text-sm text-yellow-700 space-y-1">
            <li>• Check your spam/junk folder</li>
            <li>• Add noreply@ratemycollegeclub.com to your contacts</li>
            <li>• The verification link expires in 24 hours</li>
            <li>• Make sure your email address was entered correctly</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
