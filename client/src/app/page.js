"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"
import { Users, Star, TrendingUp, Building } from "lucide-react"
import { useAuth } from "./context/AuthContext"
import Image from 'next/image';
import TestModalButton from "./components/test-modal-button"
import { getAuth } from "firebase/auth"
import { app } from "./utils/firebase"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

export default function HeroSection() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [popularSchools, setPopularSchools] = useState([]);
  const [popularClubs, setPopularClubs] = useState([]);
  const [recommendedClubs, setRecommendedClubs] = useState([]);
  const { user, isInitialized } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const auth = getAuth(app);
  console.log("user information", user);
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
    const fetchPopularSchools = async () => {
      try {
        const response = await fetch("http://localhost:5095/api/University/popular-schools", {
          method: "GET",
        });
        if(response.ok){
          console.log("ok repsonse");
          const data = await response.json();
          console.log("popular schools", data);
          setPopularSchools(data);
        }
      }
      catch(error){
        console.error('Login error:', error);
      }
    }
    const fetchPopularClubs = async () => {
      try {
        const response = await fetch("http://localhost:5095/api/Club/popular-clubs", {
          method: "GET",
        });
        if(response.ok){
          console.log("ok repsonse");
          const data = await response.json();
          console.log("popular clubs", data);
          setPopularClubs(data);
        }
      }
      catch(error){
        console.error('Login error:', error);
      }
    }
    const fetchRecommendedClubs = async () => {
      try {
        const currentUser = auth.currentUser;
        const idToken = await currentUser.getIdToken();
        console.log(idToken);
        const response = await fetch("http://localhost:5095/api/Club/recommended", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${idToken}`
          }
        });
        if(response.ok){
          const data = await response.json();
          console.log("recommended clubs", data);
          setRecommendedClubs(data);
        }
      }
      catch(error){
        console.error('Login error:', error);
      }
    }
    fetchPopularSchools();
    fetchPopularClubs();
    // if(user && isInitialized) {
    //   fetchRecommendedClubs();
    // }
    // setIsLoading(false);
  }, [user, isInitialized]);

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
  
  if (!isInitialized && isLoading) { 
    return (
      <div className="h-[calc(100vh-4rem)] bg-gradient-to-br from-blue-50 to-white flex items-center justify-center">
        <div className="flex items-center space-x-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          <p className="font-bold text-xl">Now Loading..</p>
        </div>
      </div>
    ); 
  }

  const renderStars = (rating, size = "w-2 h-2") => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star key={i} className={`${size} ${i < rating ? "text-yellow-500 fill-current" : "text-gray-300"}`} />
    ))
  }

  return (
    <>
    <section className="container mx-auto px-4 py-16 md:py-24">
      <div className="max-w-4xl mx-auto text-center">
        {/* Main Heading */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-gray-100 mb-6">
          Rate My <span className="text-blue-600 dark:text-blue-400">College Club</span>
        </h1>

        {/* Subheading */}
        <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 mb-12 max-w-2xl mx-auto">
          Find your community. Rate your experience.
        </p>

        {/* Search Section */}
        <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-xl p-8 border border-blue-100 dark:border-blue-900">
          <h2 className="text-xl md:text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-6">Enter your school name to get started</h2>
          <form className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-600 w-5 h-5" />
              <Input
                type="text"
                placeholder="Your school..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 py-3 text-sm md:text-md xl:text-lg border-2 border-blue-200 dark:border-blue-800 focus:border-blue-500 rounded-xl bg-white dark:bg-zinc-800 text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400"
              />
              {searchResults.length > 0 && (
                <ul className="absolute z-10 w-full bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-xl shadow-lg mt-2 max-h-64 overflow-y-auto">
                  {searchResults.map((university) => (
                    <li
                      key={university.id}
                      onClick={() => window.location.href = `/school/${university.id}`}
                      className="px-4 py-3 hover:bg-blue-100 dark:hover:bg-zinc-700 cursor-pointer transition-colors border-b border-gray-200 dark:border-zinc-700 last:border-b-0"
                    >
                      <div className="flex items-center justify-start gap-2 md:gap-3">
                        <div className="text-sm md:text-md font-medium text-gray-800 dark:text-gray-200">{university.name}</div>
                        <div className="text-xs md:text-sm text-gray-500 dark:text-gray-400">{university.location}</div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </form>
          <div className="mt-6">
            <Link
              href="/all-schools"
              className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-500 font-medium underline underline-offset-4"
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
          <p className="text-xl md:text-2xl text-gray-900 dark:text-gray-100 mb-6 max-w-2xl">Popular Schools</p>
          <div className="flex items-start gap-4 overflow-x-auto pb-4 scrollbar-hide cursor-pointer">
            {popularSchools.map((school, index) => {
              return (
                <div key={index} className="bg-white dark:bg-zinc-900 rounded-xl shadow-lg border border-blue-100 dark:border-blue-900 flex-shrink-0 w-80" onClick={() => router.push(`/school/${school.id}`)}>
                  <div className="w-full h-50 bg-blue-100 dark:bg-blue-950 flex items-center justify-center mb-4 mx-auto">
                    <img
                      // src="https://www.texastech.edu/universities/ttu-campus-2022.jpg"
                      src={"/generic.jpeg"}
                      className="w-full h-full text-blue-600 rounded-lg"
                    />
                  </div>
                  <div className="h-10 flex items-center justify-center px-4">
                    <h3 className="text-lg text-center font-semibold text-gray-800 dark:text-gray-200 line-clamp-1 leading-tight max-w-full">
                      {school.name}
                    </h3>
                  </div>
                  <div className="flex items-center justify-center gap-1 text-gray-600 dark:text-gray-400 pb-2">
                    <Building className="w-4 h-4" />
                    <span>{school.clubsCount} Clubs</span>
                  </div>
                  <div className="flex items-center justify-center gap-1 text-gray-600 dark:text-gray-400 mb-4 pb-2">
                    <Users className="w-4 h-4" />
                    <span>{school.reviewCount} Reviews</span>
                  </div>
                  {/* <p className="text-gray-600 text-center mb-4 pb-2">{school.reviewCount} Reviews</p> */}
                </div>
              )
            })}
          </div>
        </div>
        <div className="mb-20">
          <p className="text-xl md:text-2xl text-gray-900 dark:text-gray-100 mb-6 max-w-2xl">Popular Clubs</p>
          <div className="flex items-start gap-4 overflow-x-auto pb-4 scrollbar-hide cursor-pointer">
            {popularClubs.map((club, index) => {
              return (
                <div key={index} className="bg-white dark:bg-zinc-900 rounded-xl shadow-lg border border-blue-100 dark:border-blue-900 flex-shrink-0 w-80">
                  <div className="w-full h-50 bg-blue-100 dark:bg-blue-950 flex items-center justify-center mb-4 mx-auto">
                    <img
                      // src="https://www.texastech.edu/universities/ttu-campus-2022.jpg"
                      src={"/genericclub.jpeg"}
                      className="w-full h-full text-blue-600 rounded-lg"
                    />
                  </div>
                  <div className="h-15 flex flex-col items-center justify-center mb-2 px-4">
                    <h3 className="text-lg text-center font-semibold text-gray-800 dark:text-gray-200 line-clamp-2 leading-tight max-w-full">
                      {club.name}
                    </h3>
                    <p className="text-md text-center text-gray-600 dark:text-gray-400 mt-1">
                      {club.universityName}
                    </p>
                  </div>
                  <div className="flex justify-center gap-1 mb-2">
                    {renderStars(Math.round(club.averageRating), "w-4 h-4")}
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 text-center mb-4 pb-2">{club.reviewCount}{club.reviewCount === 1 ? " Review" : " Reviews"}</p>
                </div>
              )
            })}
          </div>
        </div>
        {user && recommendedClubs.length > 0 &&
          <div>
            <p className="text-xl md:text-2xl text-gray-900 dark:text-gray-100 mb-6 max-w-2xl">Recommended for you</p>
            <div className="flex items-start gap-4 overflow-x-auto pb-4 scrollbar-hide cursor-pointer">
              {recommendedClubs.map((club, index) => {
                return (
                  <div key={index} className="bg-white dark:bg-zinc-900 rounded-xl shadow-lg border border-blue-100 dark:border-blue-900 flex-shrink-0 w-80">
                    <div className="w-full h-50 bg-blue-100 dark:bg-blue-950 flex items-center justify-center mb-4 mx-auto">
                      <img
                        // src="https://www.texastech.edu/universities/ttu-campus-2022.jpg"
                        src={"/genericclub.jpeg"}
                        className="w-full h-full text-blue-600 rounded-lg"
                      />
                    </div>
                    <div className="h-15 flex flex-col items-center justify-center mb-2 px-4">
                      <h3 className="text-lg text-center font-semibold text-gray-800 dark:text-gray-200 line-clamp-2 leading-tight max-w-full">
                        {club.name}
                      </h3>
                      <p className="text-md text-center text-gray-600 dark:text-gray-400 mt-1">
                        {club.universityName}
                      </p>
                      </div>
                      <div className="flex justify-center gap-1 mb-2">
                        {renderStars(Math.round(club.averageRating), "w-4 h-4")}
                      </div>
                      <p className="text-gray-600 dark:text-gray-400 text-center mb-4 pb-2">{club.reviewCount} Reviews</p>
                    </div>
                  )
                })}
              </div>
          </div>
        }
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
                className="bg-white dark:bg-zinc-900 rounded-xl p-6 shadow-lg border border-blue-100 dark:border-blue-900 hover:shadow-xl transition-shadow"
              >
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-950 rounded-lg flex items-center justify-center mb-4 mx-auto">
                  <IconComponent className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-lg md:text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-400">{feature.description}</p>
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
            <h2 className="text-3xl font-semibold mb-4">Ready to get started?</h2>
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
