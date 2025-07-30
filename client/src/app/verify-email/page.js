"use client"

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { CheckCircle, XCircle, Mail, Loader2, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function VerifyEmailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email");
  const token = searchParams.get("token");

  const [verificationStatus, setVerificationStatus] = useState("loading"); // loading, success, error
  const [isVerifying, setIsVerifying] = useState(false);

  useEffect(() => {
    if (!email || !token) {
      setVerificationStatus("error");
      return;
    }

    async function verifyEmail() {
      setIsVerifying(true);
      try {
        const response = await fetch("http://localhost:5095/api/Account/verify-email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, token }),
        })

        if (response.ok) {
          setVerificationStatus("success")
          toast.success("Email verified successfully!", {
            duration: 5000,
          })
          // Redirect after 3 seconds
          setTimeout(() => {
            router.push("/login");
          }, 3000)
        } else {
          setVerificationStatus("error");
          toast.error("Email verification unsuccessful!");
        }
      } 
      catch (error) {
        setVerificationStatus("error");
        toast.error("Something went wrong. Please try again.");
      } 
      finally {
        setIsVerifying(false);
      }
    }

    verifyEmail();
  }, [email, token, router]);

  const renderContent = () => {
    switch (verificationStatus) {
      case "loading":
        return (
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Verifying Your Email</h1>
            <p className="text-gray-600 text-lg mb-6">Please wait while we verify your email address...</p>
            <div className="flex items-center justify-center gap-2 text-blue-600">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span className="text-sm">This may take a few seconds</span>
            </div>
          </div>
        );

      case "success":
        return (
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Email Verified Successfully!</h1>
            <p className="text-gray-600 text-lg mb-6">
              Your email address <span className="font-semibold text-blue-600">{email}</span> has been verified.
            </p>
            <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6">
              <p className="text-green-800 text-sm">✅ Your account is now active and ready to use!</p>
            </div>
            <div className="space-y-3">
              <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold" asChild>
                <Link href="/login">Continue to Login</Link>
              </Button>
              <p className="text-sm text-gray-500">Redirecting automatically in 3 seconds...</p>
            </div>
          </div>
        );

      case "error":
        return (
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <XCircle className="w-8 h-8 text-red-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Verification Failed</h1>
            <p className="text-gray-600 text-lg mb-6">We couldn't verify your email address. This could be due to:</p>
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 text-left">
              <ul className="text-red-800 text-sm space-y-1">
                <li>• The verification link has expired</li>
                <li>• The link has already been used</li>
                <li>• Invalid verification token</li>
                <li>• Network connection issues</li>
              </ul>
            </div>
            <div className="space-y-3">
              <Button
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold"
                onClick={() => window.location.reload()}
              >
                Try Again
              </Button>
              <Button
                variant="outline"
                className="w-full border-2 border-gray-200 text-gray-600 hover:bg-gray-50 py-3 rounded-xl font-semibold bg-transparent"
                asChild
              >
                <Link href="/signup">Request New Verification Email</Link>
              </Button>
            </div>
          </div>
        );

      default:
        return null
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
          {/* Email Icon Header */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail className="w-10 h-10 text-blue-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-700">Email Verification</h2>
          </div>

          {/* Dynamic Content */}
          {renderContent()}

          {/* Help Section */}
          <div className="mt-8 pt-6 border-t border-gray-200 text-center">
            <p className="text-sm text-gray-500 mb-2">Need help?</p>
            <Link
              href="/help"
              className="text-blue-600 hover:text-blue-700 font-medium text-sm underline underline-offset-4"
            >
              Contact Support
            </Link>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            Didn't receive the verification email?{" "}
            <Link href="/resend-verification" className="text-blue-600 hover:text-blue-700 underline">
              Resend it
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
