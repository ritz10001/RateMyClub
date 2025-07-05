"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Plus, Users, Building } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

// Mock data for schools
const mockSchools = [
  {
    id: 1,
    name: "Texas Tech University",
    logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRoImEBJpYSEzalfibFb51kyqGCgYJa5wPinQ&s",
    reviewCount: 245,
    clubCount: 89,
    location: "Lubbock, TX",
  },
  {
    id: 2,
    name: "Massachusetts Institute of Technology",
    logo: "https://upload.wikimedia.org/wikipedia/commons/0/0c/MIT_logo.svg",
    reviewCount: 412,
    clubCount: 156,
    location: "Cambridge, MA",
  },
  {
    id: 3,
    name: "Stanford University",
    logo: "/placeholder.svg?height=80&width=80",
    reviewCount: 389,
    clubCount: 134,
    location: "Stanford, CA",
  },
  {
    id: 4,
    name: "University of California, Berkeley",
    logo: "/placeholder.svg?height=80&width=80",
    reviewCount: 298,
    clubCount: 112,
    location: "Berkeley, CA",
  },
  {
    id: 5,
    name: "Harvard University",
    logo: "/placeholder.svg?height=80&width=80",
    reviewCount: 356,
    clubCount: 98,
    location: "Cambridge, MA",
  },
  {
    id: 6,
    name: "University of Michigan",
    logo: "/placeholder.svg?height=80&width=80",
    reviewCount: 267,
    clubCount: 145,
    location: "Ann Arbor, MI",
  },
]

export default function DirectoryPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState("name")
  const [filteredSchools, setFilteredSchools] = useState(mockSchools)

  const handleSearch = (query) => {
    setSearchQuery(query)
    const filtered = mockSchools.filter(
      (school) =>
        school.name.toLowerCase().includes(query.toLowerCase()) ||
        school.location.toLowerCase().includes(query.toLowerCase()),
    )
    setFilteredSchools(filtered)
  }

  const handleSort = (value) => {
    setSortBy(value)
    const sorted = [...filteredSchools].sort((a, b) => {
      switch (value) {
        case "name":
          return a.name.localeCompare(b.name)
        case "reviews":
          return b.reviewCount - a.reviewCount
        case "clubs":
          return b.clubCount - a.clubCount
        default:
          return 0
      }
    })
    setFilteredSchools(sorted)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl text-center font-bold text-blue-600 mb-2">School Directory</h1>
          <p className="text-xl text-center text-gray-600">Discover colleges and universities</p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-blue-100">
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            {/* Search Bar */}
            <div className="relative flex-1 w-full lg:w-auto">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="text"
                placeholder="Search schools by name or location..."
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
                  <SelectItem value="name">School Name</SelectItem>
                  <SelectItem value="reviews">Most Reviews</SelectItem>
                  <SelectItem value="clubs">Most Clubs</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Add School Button */}
            <Button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold whitespace-nowrap w-full lg:w-auto">
              <Link href="/request/school" className="flex items-center justify-center">
              <Plus className="w-4 h-4 mr-2" />
              Add School
              </Link>
            </Button>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            Showing {filteredSchools.length} of {mockSchools.length} schools
          </p>
        </div>

        {/* School Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {filteredSchools.map((school) => (
            <Link key={school.id} href={`/school/${school.id}`} className="group">
              <div className="bg-white rounded-2xl shadow-lg border border-blue-100 p-6 hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                {/* School Logo */}
                <div className="flex justify-center mb-4">
                  <img
                    src={school.logo || "/placeholder.svg"}
                    alt={`${school.name} logo`}
                    className="h-auto w-20"
                  />
                </div>

                {/* School Info */}
                <div className="text-center">
                  <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                    {school.name}
                  </h3>
                  <p className="text-gray-600 mb-4">{school.location}</p>

                  {/* Stats */}
                  <div className="flex justify-center gap-6 text-sm">
                    <div className="flex items-center gap-1 text-gray-600">
                      <Users className="w-4 h-4" />
                      <span>{school.reviewCount} reviews</span>
                    </div>
                    <div className="flex items-center gap-1 text-gray-600">
                      <Building className="w-4 h-4" />
                      <span>{school.clubCount} clubs</span>
                    </div>
                  </div>
                </div>

                {/* Club Count Badge */}
                <div className="mt-4 text-center">
                  <span className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">
                    {school.clubCount} Active Clubs
                  </span>
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
            Load More Schools
          </Button>
        </div>
      </div>
    </div>
  )
}
