"use client"

import { Button } from "@/components/ui/button"
import { Shield, Mail, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function PrivacyPage() {
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
                <Shield className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600 dark:text-blue-400" />
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 sm:mb-4 dark:text-gray-100">Privacy Policy</h1>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
                Last updated: {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
            </p>
            </div>

            {/* Content */}
            <div className="prose prose-gray max-w-none dark:prose-invert">
            {/* Introduction */}
            <section className="mb-8">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 dark:text-gray-100">1. Information We Collect</h2>
                <p className="text-gray-700 leading-relaxed mb-4 dark:text-gray-300">
                We collect information you provide directly to us when you create an account, write reviews, or contact
                us.
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4 dark:text-gray-300">
                <li>Account information (name, email address, university)</li>
                <li>Profile information (interests, tags, profile photo)</li>
                <li>Content you create (reviews, ratings, comments)</li>
                <li>Communications with us (support emails, feedback)</li>
                <li>Technical information (IP address, browser type, device information)</li>
                </ul>
            </section>

            {/* How We Use Information */}
            <section className="mb-8">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 dark:text-gray-100">2. How We Use Your Information</h2>
                <p className="text-gray-700 leading-relaxed mb-4 dark:text-gray-300">
                We use the information we collect to provide, maintain, and improve our services.
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4 dark:text-gray-300">
                <li>To create and manage your account</li>
                <li>To display your reviews and ratings</li>
                <li>To personalize your experience and recommendations</li>
                <li>To communicate with you about our services</li>
                <li>To respond to your comments, questions, and requests</li>
                <li>To monitor and analyze trends and usage</li>
                <li>To detect, investigate, and prevent fraudulent transactions</li>
                </ul>
            </section>

            {/* Information Sharing */}
            <section className="mb-8">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 dark:text-gray-100">
                3. Information Sharing and Disclosure
                </h2>
                <p className="text-gray-700 leading-relaxed mb-4 dark:text-gray-300">
                We do not sell, trade, or otherwise transfer your personal information to third parties.
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4 dark:text-gray-300">
                <li>Your reviews and ratings are publicly visible but anonymous</li>
                <li>We may share aggregated, non-personally identifiable information</li>
                <li>We may disclose information if required by law or to protect our rights</li>
                <li>We may share information with service providers who assist us</li>
                <li>In case of merger or acquisition, user information may be transferred</li>
                </ul>
            </section>

            {/* Data Security */}
            <section className="mb-8">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 dark:text-gray-100">4. Data Security</h2>
                <p className="text-gray-700 leading-relaxed mb-4 dark:text-gray-300">
                We implement appropriate security measures to protect your personal information.
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4 dark:text-gray-300">
                <li>We use encryption to protect sensitive information</li>
                <li>Access to personal information is restricted to authorized personnel</li>
                <li>We regularly review our security practices</li>
                <li>However, no method of transmission over the internet is 100% secure</li>
                <li>You are responsible for keeping your account credentials secure</li>
                </ul>
            </section>

            {/* Your Rights */}
            <section className="mb-8">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 dark:text-gray-100">5. Your Rights and Choices</h2>
                <p className="text-gray-700 leading-relaxed mb-4 dark:text-gray-300">
                You have certain rights regarding your personal information.
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4 dark:text-gray-300">
                <li>You can update your account information at any time</li>
                <li>You can delete your reviews and content</li>
                <li>You can request deletion of your account</li>
                <li>You can request a copy of your personal information</li>
                <li>You can opt out of certain communications</li>
                <li>You can contact us to exercise these rights</li>
                </ul>
            </section>

            {/* Cookies */}
            <section className="mb-8">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 dark:text-gray-100">6. Cookies and Tracking</h2>
                <p className="text-gray-700 leading-relaxed mb-4 dark:text-gray-300">
                We use cookies and similar technologies to enhance your experience.
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4 dark:text-gray-300">
                <li>Essential cookies for basic website functionality</li>
                <li>Analytics cookies to understand how you use our service</li>
                <li>Preference cookies to remember your settings</li>
                <li>You can control cookies through your browser settings</li>
                <li>Disabling cookies may affect website functionality</li>
                </ul>
            </section>

            {/* Children's Privacy */}
            <section className="mb-8">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 dark:text-gray-100">7. Children&apos;s Privacy</h2>
                <p className="text-gray-700 leading-relaxed mb-4 dark:text-gray-300">
                Our service is not intended for children under 13 years of age.
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4 dark:text-gray-300">
                <li>We do not knowingly collect personal information from children under 13</li>
                <li>If we learn we have collected such information, we will delete it</li>
                <li>Parents can contact us if they believe their child has provided information</li>
                </ul>
            </section>

            {/* Changes to Policy */}
            <section className="mb-8">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 dark:text-gray-100">8. Changes to This Privacy Policy</h2>
                <p className="text-gray-700 leading-relaxed mb-4 dark:text-gray-300">We may update this privacy policy from time to time.</p>
                <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4 dark:text-gray-300">
                <li>We will notify you of any changes by posting the new policy</li>
                <li>Changes are effective when posted on this page</li>
                <li>We encourage you to review this policy periodically</li>
                </ul>
            </section>

            {/* Contact */}
            <section className="mb-8">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 dark:text-gray-100">9. Contact Us</h2>
                <p className="text-gray-700 leading-relaxed mb-4 dark:text-gray-300">
                If you have any questions about this Privacy Policy, please contact us:
                </p>
                <div className="bg-blue-50 rounded-xl p-4 border border-blue-100 dark:bg-blue-950 dark:border-blue-900">
                <div className="flex items-center gap-2 mb-2">
                    <Mail className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    <span className="font-medium text-gray-900 dark:text-gray-100">Email:</span>
                </div>
                <a
                    href="mailto:ratemycollegeclub@gmail.com"
                    className="text-blue-600 hover:text-blue-700 underline underline-offset-4 dark:text-blue-400 dark:hover:text-blue-500"
                >
                    ratemycollegeclub@gmail.com
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
                <Link href="/terms-and-conditions">Terms and Conditions</Link>
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
