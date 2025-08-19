"use client"

import { Button } from "@/components/ui/button"
import { ChevronDown, ChevronUp, HelpCircle, Mail, MessageCircle } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

const faqs = [
  {
    question: "How do I create an account?",
    answer:
      "Click the 'Sign Up' button in the top right corner or use the 'Continue with Google' option for quick registration. You'll need to verify your email address to get started.",
  },
  {
    question: "Can I write anonymous reviews?",
    answer:
      "Yes! Your reviews are anonymous by default. Other users will only see your review content, not your personal information. Only you can see which reviews you've written.",
  },
  {
    question: "How do I add my club to the platform?",
    answer:
      "Go to your school's page and click 'Add Your Club' or use the 'Request Club' button. Fill out the club information form and our team will review and approve it within 2-3 business days.",
  },
  {
    question: "Can I edit or delete my reviews?",
    answer:
      "Yes, you can edit or delete your reviews anytime. Go to your profile, find the review you want to modify, and use the edit or delete options.",
  },
  {
    question: "How do I find clubs at my school?",
    answer:
      "Use the search bar on the homepage to find your school, then browse all the clubs listed for that institution. You can filter by category, rating, or search for specific interests.",
  },
  {
    question: "What if my school isn't listed?",
    answer:
      "You can request to add your school by clicking 'Add School' in the directory. Provide the school information and we'll add it to our database within 3-5 business days.",
  },
  {
    question: "How are club ratings calculated?",
    answer:
      "Club ratings are calculated from multiple factors including leadership quality, inclusivity, networking opportunities, and skills development, all based on student reviews.",
  },
  {
    question: "Can club officers respond to reviews?",
    answer:
      "Currently, reviews are one-way feedback from students. However, we're working on features that will allow clubs to engage constructively with feedback in the future.",
  },
]

export default function HelpPage() {
  const [openFaq, setOpenFaq] = useState(null)

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-blue-100">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <HelpCircle className="w-8 h-8 text-blue-600" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Help Center</h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Find answers to common questions and get the help you need.
            </p>
          </div>

          {/* Quick Actions */}
          <div className="grid md:grid-cols-3 gap-4 mb-12">
            <Button
              variant="outline"
              className="border-2 border-blue-200 text-blue-600 hover:bg-blue-50 p-6 rounded-xl font-semibold bg-transparent h-auto flex-col"
              asChild
            >
              <Link href="/signup">
                <MessageCircle className="w-6 h-6 mb-2" />
                Getting Started
              </Link>
            </Button>
            <Button
              variant="outline"
              className="border-2 border-blue-200 text-blue-600 hover:bg-blue-50 p-6 rounded-xl font-semibold bg-transparent h-auto flex-col"
              asChild
            >
              <Link href="/directory">
                <HelpCircle className="w-6 h-6 mb-2" />
                Browse Clubs
              </Link>
            </Button>
            <Button
              variant="outline"
              className="border-2 border-blue-200 text-blue-600 hover:bg-blue-50 p-6 rounded-xl font-semibold bg-transparent h-auto flex-col"
              asChild
            >
              <Link href="mailto:support@ratemycollegeclub.com">
                <Mail className="w-6 h-6 mb-2" />
                Contact Support
              </Link>
            </Button>
          </div>

          {/* FAQ Section */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Frequently Asked Questions</h2>
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div key={index} className="border border-gray-200 rounded-xl overflow-hidden">
                  <button
                    onClick={() => toggleFaq(index)}
                    className="w-full px-6 py-4 text-left bg-gray-50 hover:bg-gray-100 transition-colors flex justify-between items-center"
                  >
                    <span className="font-semibold text-gray-900">{faq.question}</span>
                    {openFaq === index ? (
                      <ChevronUp className="w-5 h-5 text-gray-500" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-500" />
                    )}
                  </button>
                  {openFaq === index && (
                    <div className="px-6 py-4 bg-white">
                      <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Contact Section */}
          <div className="bg-blue-50 rounded-xl p-8 border border-blue-100 text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Still Need Help?</h3>
            <p className="text-gray-600 mb-6">
              Can't find what you're looking for? Our support team is here to help you out.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold" asChild>
                <Link href="mailto:support@ratemycollegeclub.com">Email Support</Link>
              </Button>
              <Button
                variant="outline"
                className="border-2 border-blue-200 text-blue-600 hover:bg-blue-50 px-6 py-3 rounded-xl font-semibold bg-transparent"
                asChild
              >
                <Link href="/">Back to Home</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
