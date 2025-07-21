"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"
import { Users, Star, TrendingUp } from "lucide-react"
import { useAuth } from "./context/AuthContext"
import Image from 'next/image';

export default function HeroSection() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const { user } = useAuth();
  const popularSchools = [
    {
      school: "Texas Tech Univeristy",
      url: "https://www.texastech.edu/universities/ttu-campus-2022.jpg",
      reviews: 10
    },
    {
      school: "University of Texas at Dallas",
      url: "https://www.utdallas.edu/files/2024/04/campus-mall-drone-shot-spring-2023-f9da6375e486abef.jpg",
      reviews: 10
    },
    {
      school: "Massachusetts Institute of Technology ",
      url: "https://www.science.org/do/10.1126/science.aav7395/abs/MIT_16x9_0.jpg",
      reviews: 10
    },
    {
      school: "Stanford University",
      url: "https://money-assets.money.com/mcp/2025/243744.jpg",
      reviews: 10
    },
    {
      school: "University of Southern California - Los Angeles",
      url: "https://employees.usc.edu/wp-content/uploads/2024/05/USC-EG-GC-Campus-3@2x.jpg",
      reviews: 10
    }
  ];
  const popularClubs = [
    {
      club: "Tech Robotics Association",
      url: "https://www.texastech.edu/universities/ttu-campus-2022.jpg",
      reviews: 10
    },
    {
      club: "Tech Robotics Association",
      url: "https://www.texastech.edu/universities/ttu-campus-2022.jpg",
      reviews: 10
    },
    {
      club: "Tech Robotics Association",
      url: "https://www.texastech.edu/universities/ttu-campus-2022.jpg",
      reviews: 10
    },
    {
      club: "Tech Robotics Association",
      url: "https://www.texastech.edu/universities/ttu-campus-2022.jpg",
      reviews: 10
    },
    {
      club: "Tech Robotics Association",
      url: "https://www.texastech.edu/universities/ttu-campus-2022.jpg",
      reviews: 10
    },
  ];
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
  

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (searchQuery.trim() === "") {
        setSearchResults([]); // clear when query is empty
        return;
      }

      const fetchResults = async () => {
        const res = await fetch(`http://localhost:5095/api/University/search?query=${encodeURIComponent(searchQuery)}`);
        const data = await res.json();
        setSearchResults(data);
      };

      fetchResults();
    }, 300); // 300ms debounce

    return () => clearTimeout(delayDebounce);
  }, [searchQuery]);

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
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-blue-100">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Enter your school name to get started</h2>

          <form className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="text"
                placeholder="Your school..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 py-3 text-lg border-2 border-blue-200 focus:border-blue-500 rounded-xl"
              />
              {searchResults.length > 0 && (
                <ul className="absolute z-10 w-full bg-white border border-gray-200 rounded-xl shadow-lg mt-2 max-h-64 overflow-y-auto">
                  {searchResults.map((university) => (
                    <li
                      key={university.id}
                      onClick={() => window.location.href = `/school/${university.id}`}
                      className="px-4 py-3 hover:bg-blue-100 cursor-pointer transition-colors border-b border-gray-200 last:border-b-0"
                    >
                      <div className="flex items-center justify-start gap-2 md:gap-3">
                        <div className="text-sm md:text-md font-medium text-gray-800">{university.name}</div>
                        <div className="text-xs md:text-sm text-gray-500">{university.location}</div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            {/* <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg rounded-xl">
              Search
            </Button> */}
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
    <section className="container mx-auto px-4 mb-16 md:mb-24">
      <div className="mx-auto">
        <div className="mb-20">
          <p className="text-xl md:text-2xl text-gray-900 mb-6 max-w-2xl">Popular schools</p>
          <div className="flex items-center gap-4 overflow-x-auto pb-4 scrollbar-hide cursor-pointer">
            {popularSchools.map((school, index) => {
              return(
                <div key={index} className="bg-white rounded-xl shadow-lg border border-blue-100">
                  <div className="w-70 h-50 bg-blue-100 flex items-center justify-center mb-4 mx-auto">
                    <img src={school.url} className="w-full h-full text-blue-600 rounded-lg"/>
                  </div>
                  <div className="h-16 flex items-center justify-center mb-2">
                    <h3 className="text-xl text-center font-semibold text-gray-800 line-clamp-2 leading-tight">
                      {school.school}
                    </h3>
                  </div>
                  <p className="text-gray-600 text-center mb-2">{school.reviews} Reviews</p>
                </div>
              )
            })}
          </div>
        </div>
        <div>
          <p className="text-xl md:text-2xl text-gray-900 mb-6 max-w-2xl">Popular Clubs</p>
          <div className="flex items-center gap-4 overflow-x-auto pb-4 scrollbar-hide cursor-pointer">
            {popularClubs.map((club, index) => {
              return(
                <div key={index} className="bg-white rounded-xl shadow-lg border border-blue-100">
                  <div className="w-70 h-50 bg-blue-100 flex items-center justify-center mb-4 mx-auto">
                    <img src={club.url} className="w-full h-full text-blue-600 rounded-lg"/>
                  </div>
                  <div className="h-16 flex items-center justify-center mb-2">
                    <h3 className="text-xl text-center font-semibold text-gray-800 line-clamp-2 leading-tight">
                      {club.club}
                    </h3>
                  </div>
                  <p className="text-gray-600 text-center mb-2">{club.reviews} Reviews</p>
                </div>
              )
            })}
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
