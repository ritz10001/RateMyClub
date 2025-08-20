"use client"

import { Button } from "@/components/ui/button"
import { Users, Mail, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function GuidelinesPage() {
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
              <Users className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600 dark:text-blue-400" />
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 sm:mb-4 dark:text-gray-100">
              Community Guidelines
            </h1>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
              Help us maintain a respectful and helpful community for all students
            </p>
          </div>

          {/* Content */}
          <div className="prose prose-gray max-w-none dark:prose-invert">
            {/* Introduction */}
            <section className="mb-8">
              <div className="bg-blue-50 rounded-xl p-6 border border-blue-100 mb-6 dark:bg-blue-950 dark:border-blue-900">
                <h2 className="text-xl font-bold text-gray-900 mb-3 dark:text-gray-100">Our Community Values</h2>
                <p className="text-gray-700 leading-relaxed dark:text-gray-300">
                  RateMyCollegeClub is built on trust, respect, and helping fellow students make informed decisions.
                  These guidelines help ensure our platform remains a safe and valuable resource for everyone.
                </p>
              </div>
            </section>

            {/* Writing Reviews */}
            <section className="mb-8">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 dark:text-gray-100">1. Writing Honest Reviews</h2>
              <p className="text-gray-700 leading-relaxed mb-4 dark:text-gray-300">
                Your reviews help other students make important decisions about their college experience.
              </p>
              <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-4 dark:bg-green-950 dark:border-green-800">
                <h3 className="font-semibold text-green-800 mb-2 dark:text-green-300">✅ Do:</h3>
                <ul className="list-disc list-inside text-green-700 space-y-1 ml-4 dark:text-green-200">
                  <li>Write about your genuine experience with the club</li>
                  <li>Be specific about what you liked or didn't like</li>
                  <li>Provide constructive feedback that could help the club improve</li>
                  <li>Focus on the club's activities, leadership, and community</li>
                  <li>Be respectful even when sharing negative experiences</li>
                </ul>
              </div>
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 dark:bg-red-950 dark:border-red-800">
                <h3 className="font-semibold text-red-800 mb-2 dark:text-red-300">❌ Don't:</h3>
                <ul className="list-disc list-inside text-red-700 space-y-1 ml-4 dark:text-red-200">
                  <li>Write fake reviews or reviews for clubs you haven't joined</li>
                  <li>Include personal attacks or harassment of individuals</li>
                  <li>Share private or confidential information</li>
                  <li>Use offensive language or discriminatory remarks</li>
                  <li>Post the same review multiple times</li>
                </ul>
              </div>
            </section>

            {/* Respectful Communication */}
            <section className="mb-8">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 dark:text-gray-100">2. Respectful Communication</h2>
              <p className="text-gray-700 leading-relaxed mb-4 dark:text-gray-300">
                We're all here to help each other succeed in college.
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4 dark:text-gray-300">
                <li>Treat all community members with respect and kindness</li>
                <li>Avoid personal attacks, harassment, or bullying</li>
                <li>Respect different opinions and experiences</li>
                <li>Use appropriate language suitable for all audiences</li>
                <li>Remember that real people are behind every club and review</li>
              </ul>
            </section>

            {/* Privacy and Safety */}
            <section className="mb-8">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 dark:text-gray-100">3. Privacy and Safety</h2>
              <p className="text-gray-700 leading-relaxed mb-4 dark:text-gray-300">
                Protect your privacy and respect others' privacy too.
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4 dark:text-gray-300">
                <li>Don't share personal contact information in reviews</li>
                <li>Don't post photos of people without their permission</li>
                <li>Report any content that makes you feel unsafe</li>
                <li>Don't attempt to identify anonymous reviewers</li>
                <li>Keep club meeting details general, not specific locations/times</li>
              </ul>
            </section>

            {/* Prohibited Content */}
            <section className="mb-8">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 dark:text-gray-100">4. Prohibited Content</h2>
              <p className="text-gray-700 leading-relaxed mb-4 dark:text-gray-300">
                The following types of content are not allowed on our platform:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4 dark:text-gray-300">
                <li>Hate speech, discrimination, or harassment based on race, gender, religion, etc.</li>
                <li>Threats, violence, or content that promotes harm</li>
                <li>Spam, advertising, or promotional content</li>
                <li>Copyright infringement or plagiarism</li>
                <li>Illegal activities or content</li>
                <li>Adult content or inappropriate material</li>
                <li>False information or impersonation</li>
              </ul>
            </section>

            {/* Account Responsibility */}
            <section className="mb-8">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 dark:text-gray-100">5. Account Responsibility</h2>
              <p className="text-gray-700 leading-relaxed mb-4 dark:text-gray-300">
                You are responsible for all activity on your account.
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4 dark:text-gray-300">
                <li>Keep your account information accurate and up-to-date</li>
                <li>Don't share your account with others</li>
                <li>Don't create multiple accounts to manipulate ratings</li>
                <li>Report any unauthorized use of your account</li>
                <li>You're responsible for all content posted from your account</li>
              </ul>
            </section>

            {/* Reporting and Enforcement */}
            <section className="mb-8">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 dark:text-gray-100">6. Reporting and Enforcement</h2>
              <p className="text-gray-700 leading-relaxed mb-4 dark:text-gray-300">
                Help us maintain a positive community by reporting violations.
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4 dark:text-gray-300">
                <li>Report content that violates these guidelines</li>
                <li>We review all reports and take appropriate action</li>
                <li>Violations may result in content removal or account suspension</li>
                <li>Serious violations may result in permanent account termination</li>
                <li>We may also report illegal activities to authorities</li>
              </ul>
            </section>

            {/* Getting Help */}
            <section className="mb-8">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 dark:text-gray-100">7. Getting Help</h2>
              <p className="text-gray-700 leading-relaxed mb-4 dark:text-gray-300">
                If you have questions about these guidelines or need to report something:
              </p>
              <div className="bg-blue-50 rounded-xl p-4 border border-blue-100 dark:bg-blue-950 dark:border-blue-900">
                <div className="flex items-center gap-2 mb-2">
                  <Mail className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <span className="font-medium text-gray-900 dark:text-gray-100">Contact us:</span>
                </div>
                <a
                  href="mailto:ratemycollegeclubs@gmail.com"
                  className="text-blue-600 hover:text-blue-700 underline underline-offset-4 dark:text-blue-400 dark:hover:text-blue-500"
                >
                  ratemycollegeclubs@gmail.com
                </a>
              </div>
            </section>

            {/* Thank You */}
            <section className="mb-8">
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-6 text-white text-center dark:from-blue-800 dark:to-blue-900">
                <h3 className="text-xl font-bold mb-3">Thank You! 🎓</h3>
                <p className="text-blue-100 leading-relaxed dark:text-blue-200">
                  By following these guidelines, you're helping create a supportive community where students can
                  discover amazing clubs and organizations. Together, we're making college experiences better for
                  everyone!
                </p>
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
                <Link href="/privacy-policy">Privacy Policy</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
