// "use client"
// export const dynamic = 'force-dynamic'

// import { Suspense } from 'react'
// import { useEffect, useState } from "react";
// import { useRouter, useSearchParams } from "next/navigation";
// import { toast } from "sonner";
// import { CheckCircle, XCircle, Mail, Loader2, ArrowLeft } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import Link from "next/link";

// function VerifyEmailPage() {
//   const router = useRouter();
//   const searchParams = useSearchParams();
//   const email = searchParams.get("email");
//   const token = searchParams.get("token");

//   const [verificationStatus, setVerificationStatus] = useState("loading"); // loading, success, error
//   const [isVerifying, setIsVerifying] = useState(false);

//   useEffect(() => {
//     if (!email || !token) {
//       setVerificationStatus("error");
//       return;
//     }

//     async function verifyEmail() {
//       setIsVerifying(true);
//       try {
//         const response = await fetch("http://localhost:5095/api/Account/verify-email", {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ email, token }),
//         })

//         if (response.ok) {
//           setVerificationStatus("success")
//           toast.success("Email verified successfully!", {
//             duration: 5000,
//           })
//           // Redirect after 3 seconds
//           setTimeout(() => {
//             router.push("/login");
//           }, 3000)
//         } else {
//           setVerificationStatus("error");
//           toast.error("Email verification unsuccessful!");
//         }
//       } 
//       catch (error) {
//         setVerificationStatus("error");
//         toast.error("Something went wrong. Please try again.");
//       } 
//       finally {
//         setIsVerifying(false);
//       }
//     }

//     verifyEmail();
//   }, [email, token, router]);

//   const renderContent = () => {
//   switch (verificationStatus) {
//     case "loading":
//       return (
//         <div className="text-center">
//           <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-6">
//             <Loader2 className="w-8 h-8 text-blue-600 dark:text-blue-400 animate-spin" />
//           </div>
//           <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">Verifying Your Email</h1>
//           <p className="text-gray-600 dark:text-gray-400 text-lg mb-6">Please wait while we verify your email address...</p>
//           <div className="flex items-center justify-center gap-2 text-blue-600 dark:text-blue-400">
//             <Loader2 className="w-4 h-4 animate-spin" />
//             <span className="text-sm">This may take a few seconds</span>
//           </div>
//         </div>
//       );

//     case "success":
//       return (
//         <div className="text-center">
//           <div className="w-16 h-16 bg-green-100 dark:bg-greena-900 rounded-full flex items-center justify-center mx-auto mb-6">
//             <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
//           </div>
//           <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">Email Verified Successfully!</h1>
//           <p className="text-gray-600 dark:text-gray-400 text-lg mb-6">
//             Your email address <span className="font-semibold text-blue-600 dark:text-blue-400">{email}</span> has been verified.
//           </p>
//           <div className="bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-900 rounded-xl p-4 mb-6">
//             <p className="text-green-800 dark:text-green-200 text-sm">✅ Your account is now active and ready to use!</p>
//           </div>
//           <div className="space-y-3">
//             <Button className="w-full bg-blue-600 dark:bg-blue-700 hover:bg-blue-700 dark:hover:bg-blue-600 text-white py-3 rounded-xl font-semibold" asChild>
//               <Link href="/login">Continue to Login</Link>
//             </Button>
//             <p className="text-sm text-gray-500 dark:text-gray-400">Redirecting automatically in 3 seconds...</p>
//           </div>
//         </div>
//       );

//     case "error":
//       return (
//         <div className="text-center">
//           <div className="w-16 h-16 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center mx-auto mb-6">
//             <XCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
//           </div>
//           <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">Verification Failed</h1>
//           <p className="text-gray-600 dark:text-gray-400 text-lg mb-6">We couldn&apos;t verify your email address. This could be due to:</p>
//           <div className="bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-900 rounded-xl p-4 mb-6 text-left">
//             <ul className="text-red-800 dark:text-red-200 text-sm space-y-1">
//               <li>• The verification link has expired</li>
//               <li>• The link has already been used</li>
//               <li>• Invalid verification token</li>
//               <li>• Network connection issues</li>
//             </ul>
//           </div>
//         </div>
//       );

//     default:
//       return null
//   }
// }

// return(
//   <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white dark:from-zinc-950 dark:to-zinc-900 py-8">
//     <div className="max-w-2xl mx-auto px-4">
//       {/* Back Link */}
//       <div className="mb-8">
//         <Link
//           href="/"
//           className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-500 font-medium transition-colors"
//         >
//           <ArrowLeft className="w-4 h-4" />
//           Back to Home
//         </Link>
//       </div>

//       {/* Main Content */}
//       <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-xl p-8 border border-blue-100 dark:border-blue-900">
//         {/* Email Icon Header */}
//         <div className="text-center mb-8">
//           <div className="w-20 h-20 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
//             <Mail className="w-10 h-10 text-blue-600 dark:text-blue-400" />
//           </div>
//           <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300">Email Verification</h2>
//         </div>

//         {/* Dynamic Content */}
//         {renderContent()}

//         {/* Help Section */}
//         <div className="mt-8 pt-6 border-t border-gray-200 dark:border-zinc-800 text-center">
//           <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Need help?</p>
//           <Link
//             href="/help"
//             className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-500 font-medium text-sm underline underline-offset-4"
//           >
//             Contact Support
//           </Link>
//         </div>
//       </div>

//       {/* Additional Info */}
//       <div className="mt-6 text-center">
//         <p className="text-sm text-gray-500 dark:text-gray-400">
//           Didn&apos;t receive the verification email?{" "}
//           <Link href="/resend-verification" className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-500 underline">
//             Resend it
//           </Link>
//         </p>
//       </div>
//     </div>
//   </div>
//   );
// }

// export default function VerifyEmailPage() {
//   return (
//     <Suspense fallback={<div>Loading verification...</div>}>
//       <VerifyEmailContent />
//     </Suspense>
//   );
// }


