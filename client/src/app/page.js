"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { Users, Star, TrendingUp } from "lucide-react"
import { useAuth } from "./context/AuthContext"

export default function HeroSection() {
  const [searchQuery, setSearchQuery] = useState("")
  const { user } = useAuth();
  const features = [
    {
      icon: Users,
      title: "Find Communities",
      description: "Discover clubs and organizations that match your interests and passions.",
    },
    {
      icon: Star,
      title: "Share Reviews",
      description: "Rate your experience and help other students make informed decisions.",
    },
    {
      icon: TrendingUp,
      title: "Make Impact",
      description: "Help clubs improve and grow by providing valuable feedback.",
    },
  ]

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      // TODO: Implement search functionality
      console.log("Searching for:", searchQuery)
    }
  }

  return (
    <>
    
    <section className="container mx-auto px-4 py-16 md:py-24">
      <div className="max-w-4xl mx-auto text-center">
        {/* Main Heading */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
          Rate My <span className="text-blue-600">College Club</span>
        </h1>

        {/* Subheading */}
        <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-2xl mx-auto">
          Find your community. Rate your experience.
        </p>

        {/* Search Section */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-16 border border-blue-100">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Enter your school name to get started</h2>

          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="text"
                placeholder="Your school..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 py-3 text-lg border-2 border-blue-200 focus:border-blue-500 rounded-xl"
              />
            </div>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg rounded-xl">
              Search
            </Button>
          </form>

          <div className="mt-6">
            <Link
              href="/all-schools"
              className="text-blue-600 hover:text-blue-700 font-medium underline underline-offset-4"
            >
              All schools (Directory)
            </Link>
          </div>
        </div>
      </div>
    </section>
    <section className="container mx-auto px-4 mb-16">
      <div className="max-w-4xl mx-auto">
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const IconComponent = feature.icon
            return (
              <div
                key={index}
                className="bg-white rounded-xl p-6 shadow-lg border border-blue-100 hover:shadow-xl transition-shadow"
              >
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
                  <IconComponent className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
    {!user && (
      <section className="container mx-auto px-4 mb-16">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-8 text-white text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to get started?</h2>
            <p className="text-xl mb-6 text-blue-100">Join thousands of students sharing their club experiences.</p>
            <Button
              className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 text-lg font-semibold rounded-xl"
              asChild
            >
              <Link href="/signup">Sign Up Now</Link>
            </Button>
          </div>
        </div>
      </section>
    )}
    </>
  )
}
