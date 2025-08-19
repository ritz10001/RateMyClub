"use client"

import { Button } from "@/components/ui/button"
import { Users, Target, Heart, Mail } from "lucide-react"
import Link from "next/link"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-blue-100">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Heart className="w-8 h-8 text-blue-600" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">About RateMyCollegeClub</h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Helping students find their perfect college community through honest reviews and ratings.
            </p>
          </div>

          {/* Mission Section */}
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <Target className="w-6 h-6 text-blue-600" />
              <h2 className="text-2xl font-bold text-gray-900">Our Mission</h2>
            </div>
            <p className="text-gray-700 text-lg leading-relaxed mb-6">
              We believe every student deserves to find their place on campus. RateMyCollegeClub connects students with
              clubs and organizations that match their interests, passions, and goals through authentic peer reviews.
            </p>
            <p className="text-gray-700 text-lg leading-relaxed">
              Whether you're looking for academic clubs, social organizations, or volunteer opportunities, we help you
              make informed decisions about where to invest your time and energy.
            </p>
          </div>

          {/* Values Section */}
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <Users className="w-6 h-6 text-blue-600" />
              <h2 className="text-2xl font-bold text-gray-900">What We Stand For</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-blue-50 rounded-xl p-6 border border-blue-100">
                <h3 className="font-semibold text-gray-900 mb-2">🎯 Authentic Reviews</h3>
                <p className="text-gray-700">Real experiences from real students, not promotional content.</p>
              </div>
              <div className="bg-blue-50 rounded-xl p-6 border border-blue-100">
                <h3 className="font-semibold text-gray-900 mb-2">🤝 Community First</h3>
                <p className="text-gray-700">Building connections and helping students find their tribe.</p>
              </div>
              <div className="bg-blue-50 rounded-xl p-6 border border-blue-100">
                <h3 className="font-semibold text-gray-900 mb-2">🔒 Privacy Focused</h3>
                <p className="text-gray-700">Your reviews can be anonymous, your data stays protected.</p>
              </div>
              <div className="bg-blue-50 rounded-xl p-6 border border-blue-100">
                <h3 className="font-semibold text-gray-900 mb-2">📈 Continuous Growth</h3>
                <p className="text-gray-700">Always improving based on student feedback and needs.</p>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Ready to Find Your Community?</h3>
            <p className="text-gray-600 mb-6">Join thousands of students sharing their club experiences.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold" asChild>
                <Link href="/signup">Get Started</Link>
              </Button>
              <Button
                variant="outline"
                className="border-2 border-blue-200 text-blue-600 hover:bg-blue-50 px-6 py-3 rounded-xl font-semibold bg-transparent"
                asChild
              >
                <Link href="/directory">Browse Clubs</Link>
              </Button>
            </div>
          </div>

          {/* Contact */}
          <div className="mt-12 pt-8 border-t border-gray-200 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Mail className="w-4 h-4 text-blue-600" />
              <span className="text-sm text-gray-600">Questions? Reach out to us</span>
            </div>
            <Link
              href="mailto:hello@ratemycollegeclub.com"
              className="text-blue-600 hover:text-blue-700 font-medium underline underline-offset-4"
            >
              hello@ratemycollegeclub.com
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
