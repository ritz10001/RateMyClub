"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Search, Plus, Users, Star, MapPin, Calendar, Heart } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

// Mock data for school details
const mockSchool = {
  id: 1,
  name: "Texas Tech University",
  logo: "/placeholder.svg?height=120&width=120",
  location: "Lubbock, TX",
  totalReviews: 245,
  totalClubs: 89,
  established: 1923,
  description:
    "A major public research university in Texas with a vibrant campus life and diverse student organizations.",
}

// Mock data for clubs
const mockClubs = [
  {
    id: 1,
    name: "Tech Robotics Association",
    category: "Engineering",
    rating: 4.8,
    reviewCount: 24,
    memberCount: 156,
    description: "Building the future through innovative robotics projects and competitions.",
    tags: ["STEM", "Competition", "Innovation"],
  },
  {
    id: 2,
    name: "Student Government Association",
    category: "Leadership",
    rating: 4.2,
    reviewCount: 18,
    memberCount: 45,
    description: "Representing student interests and organizing campus-wide events.",
    tags: ["Leadership", "Politics", "Service"],
  },
  {
    id: 3,
    name: "Photography Club",
    category: "Arts",
    rating: 4.6,
    reviewCount: 31,
    memberCount: 78,
    description: "Capturing moments and developing photography skills through workshops and photo walks.",
    tags: ["Creative", "Visual Arts", "Community"],
  },
  {
    id: 4,
    name: "Business Society",
    category: "Professional",
    rating: 4.4,
    reviewCount: 27,
    memberCount: 134,
    description: "Networking and professional development for future business leaders.",
    tags: ["Networking", "Career", "Business"],
  },
  {
    id: 5,
    name: "Environmental Action Group",
    category: "Service",
    rating: 4.7,
    reviewCount: 19,
    memberCount: 92,
    description: "Promoting sustainability and environmental awareness on campus.",
    tags: ["Environment", "Sustainability", "Activism"],
  },
  {
    id: 6,
    name: "International Students Association",
    category: "Cultural",
    rating: 4.5,
    reviewCount: 33,
    memberCount: 167,
    description: "Supporting international students and celebrating cultural diversity.",
    tags: ["Cultural", "International", "Support"],
  },
]

export default function SchoolPage({ params }) {
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState("name")
  const [filterBy, setFilterBy] = useState("all")
  const [filteredClubs, setFilteredClubs] = useState(mockClubs)

  const handleSearch = (query) => {
    setSearchQuery(query)
    filterClubs(query, filterBy, sortBy)
  }

  const handleFilter = (category) => {
    setFilterBy(category)
    filterClubs(searchQuery, category, sortBy)
  }

  const handleSort = (value) => {
    setSortBy(value)
    filterClubs(searchQuery, filterBy, value)
  }

  const filterClubs = (search, category, sort) => {
    let filtered = mockClubs

    // Filter by search
    if (search) {
      filtered = filtered.filter(
        (club) =>
          club.name.toLowerCase().includes(search.toLowerCase()) ||
          club.description.toLowerCase().includes(search.toLowerCase()) ||
          club.tags.some((tag) => tag.toLowerCase().includes(search.toLowerCase())),
      )
    }

    // Filter by category
    if (category !== "all") {
      filtered = filtered.filter((club) => club.category.toLowerCase() === category.toLowerCase())
    }

    // Sort
    filtered = [...filtered].sort((a, b) => {
      switch (sort) {
        case "name":
          return a.name.localeCompare(b.name)
        case "rating":
          return b.rating - a.rating
        case "members":
          return b.memberCount - a.memberCount
        case "reviews":
          return b.reviewCount - a.reviewCount
        default:
          return 0
      }
    })

    setFilteredClubs(filtered)
  }

  const categories = ["all", "engineering", "leadership", "arts", "professional", "service", "cultural"]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* School Header */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 border border-blue-100">
          <div className="flex flex-col lg:flex-row items-center lg:items-start gap-6">
            {/* School Logo */}
            <img
              src={mockSchool.logo || "/placeholder.svg"}
              alt={`${mockSchool.name} logo`}
              className="w-32 h-32 rounded-full border-4 border-blue-100"
            />

            {/* School Info */}
            <div className="flex-1 text-center lg:text-left">
              <h1 className="text-4xl font-bold text-gray-900 mb-2">{mockSchool.name}</h1>
              <div className="flex flex-wrap justify-center lg:justify-start gap-4 text-gray-600 mb-4">
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  <span>{mockSchool.location}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>Est. {mockSchool.established}</span>
                </div>
              </div>
              <p className="text-gray-700 mb-6 max-w-2xl">{mockSchool.description}</p>

              {/* Stats */}
              <div className="flex flex-wrap justify-center lg:justify-start gap-6 mb-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{mockSchool.totalClubs}</div>
                  <div className="text-sm text-gray-600">Active Clubs</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{mockSchool.totalReviews}</div>
                  <div className="text-sm text-gray-600">Total Reviews</div>
                </div>
              </div>
            </div>

            {/* Action Button */}
            <div className="flex flex-col gap-3">
              <Button
                variant="outline"
                className="border-2 border-blue-200 text-blue-600 hover:bg-blue-50 px-6 py-3 rounded-xl font-semibold bg-transparent"
              >
                Get & Add Your Club
              </Button>
            </div>
          </div>
        </div>

        {/* Can't Find Your Club Section */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-6 mb-8 text-white text-center">
          <h2 className="text-2xl font-bold mb-2">Can't find your club?</h2>
          <p className="text-blue-100 mb-4">Add yours today and help other students discover your community!</p>
          <Button className="bg-white text-blue-600 hover:bg-gray-100 px-6 py-3 rounded-xl font-semibold">
            <Link href="/request/club" className="flex items-center justify-center">
            <Plus className="w-4 h-4 mr-2" />
            Add Your Club
            </Link>   
          </Button>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-blue-100">
          <div className="flex flex-col lg:flex-row gap-4 items-center mb-4">
            {/* Search Bar */}
            <div className="relative flex-1 w-full lg:w-auto">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="text"
                placeholder="Search clubs by name, description, or tags..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-10 py-3 text-lg border-2 border-gray-200 focus:border-blue-500 rounded-xl w-full"
              />
            </div>

            {/* Sort By */}
            <div className="flex items-center gap-2 w-full lg:w-auto">
              <span className="text-sm font-medium text-gray-700 whitespace-nowrap">Sort by:</span>
              <Select value={sortBy} onValueChange={handleSort}>
                <SelectTrigger className="w-full lg:w-48 border-2 border-gray-200 rounded-xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">Club Name</SelectItem>
                  <SelectItem value="rating">Highest Rated</SelectItem>
                  <SelectItem value="members">Most Members</SelectItem>
                  <SelectItem value="reviews">Most Reviews</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Category Filters */}
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button
                key={category}
                variant={filterBy === category ? "default" : "outline"}
                onClick={() => handleFilter(category)}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                  filterBy === category
                    ? "bg-blue-600 text-white hover:bg-blue-700"
                    : "border-blue-200 text-blue-600 hover:bg-blue-50"
                }`}
              >
                {category === "all" ? "All Categories" : category.charAt(0).toUpperCase() + category.slice(1)}
              </Button>
            ))}
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            Showing {filteredClubs.length} of {mockClubs.length} clubs
          </p>
        </div>

        {/* Clubs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {filteredClubs.map((club) => (
            <Link key={club.id} href={`/school/1/club/${club.id}`} className="group">
              <div className="bg-white rounded-2xl shadow-lg border border-blue-100 p-6 hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                {/* Club Header */}
                <div className="mb-4">
                  <div className="flex justify-between items-start mb-2">
                    <Badge variant="secondary" className="bg-blue-100 text-blue-800 text-xs">
                      {club.category}
                    </Badge>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1 text-yellow-500">
                        <Star className="w-4 h-4 fill-current" />
                        <span className="text-sm font-medium text-gray-700">{club.rating}</span>
                      </div>
                      <button
                        className="p-1 rounded-full hover:bg-red-50 transition-colors group/heart"
                        onClick={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                          // TODO: Implement bookmark functionality
                          console.log(`Bookmarked ${club.name}`)
                        }}
                      >
                        <Heart className="w-5 h-5 text-red-500 p-0.5 hover:fill-current transition-all group-hover/heart:scale-110" />
                      </button>
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                    {club.name}
                  </h3>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">{club.description}</p>
                </div>

                {/* Club Stats */}
                <div className="flex justify-between items-center mb-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    <span>{club.memberCount} members</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4" />
                    <span>{club.reviewCount} reviews</span>
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1">
                  {club.tags.slice(0, 3).map((tag, index) => (
                    <Badge key={index} variant="outline" className="text-xs border-blue-200 text-blue-600">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Load More Button */}
        <div className="text-center">
          <Button
            variant="outline"
            className="border-2 border-blue-200 text-blue-600 hover:bg-blue-50 px-8 py-3 rounded-xl font-semibold bg-transparent"
          >
            Load More Clubs
          </Button>
        </div>
      </div>
    </div>
  )
}
