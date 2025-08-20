"use client"

import { Button } from "@/components/ui/button"
import { FileText, Mail, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white py-8 px-4 dark:from-zinc-950 dark:to-black">
        <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 border border-blue-100 dark:bg-zinc-800 dark:border-zinc-700 dark:shadow-2xl">
            {/* Back Link */}
            <div className="mb-6">
            <Link
                href="/"
                className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium transition-colors dark:text-blue-400 dark:hover:text-blue-500"
            >
                <ArrowLeft className="w-4 h-4" />
                Back to Home
            </Link>
            </div>

            {/* Header */}
            <div className="text-center mb-8 sm:mb-12">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 dark:bg-blue-900">
                <FileText className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600 dark:text-blue-400" />
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 sm:mb-4 dark:text-gray-100">Terms and Conditions</h1>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
                Last updated: {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
            </p>
            </div>

            {/* Content */}
            <div className="prose prose-gray max-w-none dark:prose-invert">
            {/* Introduction */}
            <section className="mb-8">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 dark:text-gray-100">1. Acceptance of Terms</h2>
                <p className="text-gray-700 leading-relaxed mb-4 dark:text-gray-300">
                By accessing and using RateMyCollegeClub ("the Service"), you accept and agree to be bound by the terms
                and provision of this agreement.
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4 dark:text-gray-300">
                <li>You must be at least 13 years old to use this service</li>
                <li>You agree to use the service in compliance with all applicable laws</li>
                <li>You understand that we may modify these terms at any time</li>
                </ul>
            </section>

            {/* User Accounts */}
            <section className="mb-8">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 dark:text-gray-100">2. User Accounts</h2>
                <p className="text-gray-700 leading-relaxed mb-4 dark:text-gray-300">
                When you create an account with us, you must provide information that is accurate, complete, and current
                at all times.
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4 dark:text-gray-300">
                <li>You are responsible for safeguarding your account password</li>
                <li>You must not share your account with others</li>
                <li>You must notify us immediately of any unauthorized use of your account</li>
                <li>We reserve the right to refuse service or terminate accounts</li>
                </ul>
            </section>

            {/* User Content */}
            <section className="mb-8">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 dark:text-gray-100">3. User Content and Reviews</h2>
                <p className="text-gray-700 leading-relaxed mb-4 dark:text-gray-300">
                Our service allows you to post, link, store, share and otherwise make available certain information,
                text, graphics, or other material ("Content").
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4 dark:text-gray-300">
                <li>You retain rights to any content you submit, post or display</li>
                <li>By posting content, you grant us a license to use, modify, and display such content</li>
                <li>You are solely responsible for your content and the consequences of posting it</li>
                <li>We do not endorse any content posted by users</li>
                <li>We reserve the right to remove content that violates our guidelines</li>
                </ul>
            </section>

            {/* Prohibited Uses */}
            <section className="mb-8">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 dark:text-gray-100">4. Prohibited Uses</h2>
                <p className="text-gray-700 leading-relaxed mb-4 dark:text-gray-300">You may not use our service:</p>
                <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4 dark:text-gray-300">
                <li>For any unlawful purpose or to solicit others to perform unlawful acts</li>
                <li>
                    To violate any international, federal, provincial, or state regulations, rules, laws, or local
                    ordinances
                </li>
                <li>
                    To infringe upon or violate our intellectual property rights or the intellectual property rights of
                    others
                </li>
                <li>To harass, abuse, insult, harm, defame, slander, disparage, intimidate, or discriminate</li>
                <li>To submit false or misleading information</li>
                <li>To upload or transmit viruses or any other type of malicious code</li>
                <li>To spam, phish, pharm, pretext, spider, crawl, or scrape</li>
                </ul>
            </section>

            {/* Privacy */}
            <section className="mb-8">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 dark:text-gray-100">5. Privacy Policy</h2>
                <p className="text-gray-700 leading-relaxed mb-4 dark:text-gray-300">
                Your privacy is important to us. Please review our Privacy Policy, which also governs your use of the
                Service.
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4 dark:text-gray-300">
                <li>We collect information you provide directly to us</li>
                <li>We use this information to provide and improve our services</li>
                <li>We do not sell your personal information to third parties</li>
                <li>
                    For more details, see our{" "}
                    <Link href="/privacy" className="text-blue-600 hover:text-blue-700 underline underline-offset-4 dark:text-blue-400 dark:hover:text-blue-500">
                    Privacy Policy
                    </Link>
                </li>
                </ul>
            </section>

            {/* Termination */}
            <section className="mb-8">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 dark:text-gray-100">6. Termination</h2>
                <p className="text-gray-700 leading-relaxed mb-4 dark:text-gray-300">
                We may terminate or suspend your account and bar access to the service immediately, without prior notice
                or liability.
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4 dark:text-gray-300">
                <li>You may terminate your account at any time</li>
                <li>Upon termination, your right to use the service will cease immediately</li>
                <li>We reserve the right to refuse service to anyone for any reason</li>
                </ul>
            </section>

            {/* Disclaimer */}
            <section className="mb-8">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 dark:text-gray-100">7. Disclaimer</h2>
                <p className="text-gray-700 leading-relaxed mb-4 dark:text-gray-300">
                The information on this service is provided on an "as is" basis.
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4 dark:text-gray-300">
                <li>We make no representations or warranties of any kind, express or implied</li>
                <li>We do not warrant that the service will be uninterrupted or error-free</li>
                <li>Your use of the service is at your own risk</li>
                </ul>
            </section>

            {/* Contact */}
            <section className="mb-8">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 dark:text-gray-100">8. Contact Information</h2>
                <p className="text-gray-700 leading-relaxed mb-4 dark:text-gray-300">
                If you have any questions about these Terms of Service, please contact us:
                </p>
                <div className="bg-blue-50 rounded-xl p-4 border border-blue-100 dark:bg-blue-950 dark:border-blue-900">
                <div className="flex items-center gap-2 mb-2">
                    <Mail className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    <span className="font-medium text-gray-900 dark:text-gray-100">Email:</span>
                </div>
                <a
                    href="mailto:ratemycollegeclubs@gmail.com"
                    className="text-blue-600 hover:text-blue-700 underline underline-offset-4 dark:text-blue-400 dark:hover:text-blue-500"
                >
                    ratemycollegeclubs@gmail.com
                </a>
                </div>
            </section>
            </div>

            {/* Footer Actions */}
            <div className="mt-8 pt-6 border-t border-gray-200 text-center dark:border-zinc-700">
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                variant="outline"
                className="border-2 border-blue-200 text-blue-600 hover:bg-blue-50 px-6 py-3 rounded-xl font-semibold bg-transparent dark:border-blue-700 dark:text-blue-400 dark:hover:bg-blue-900 dark:hover:text-blue-300"
                asChild
                >
                <Link href="/privacy-policy">Privacy Policy</Link>
                </Button>
                <Button
                variant="outline"
                className="border-2 border-blue-200 text-blue-600 hover:bg-blue-50 px-6 py-3 rounded-xl font-semibold bg-transparent dark:border-blue-700 dark:text-blue-400 dark:hover:bg-blue-900 dark:hover:text-blue-300"
                asChild
                >
                <Link href="/community-guidelines">Community Guidelines</Link>
                </Button>
            </div>
            </div>
        </div>
        </div>
    </div>
    );
}
