"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Star, ArrowLeft, HeartCrack, Users } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

// Mock data for saved clubs
const mockSavedClubs = [
  {
    id: 1,
    name: "Tech Robotics Association",
    school: "Texas Tech University",
    schoolId: 1,
    category: "Engineering",
    rating: 4.8,
    reviewCount: 24,
    memberCount: 156,
    description: "Building the future through innovative robotics projects and competitions.",
    tags: ["STEM", "Competition", "Innovation"],
    savedDate: "2024-01-15",
  },
  {
    id: 2,
    name: "Photography Club",
    school: "Texas Tech University",
    schoolId: 1,
    category: "Arts",
    rating: 4.6,
    reviewCount: 31,
    memberCount: 78,
    description: "Capturing moments and developing photography skills through workshops and photo walks.",
    tags: ["Creative", "Visual Arts", "Community"],
    savedDate: "2024-01-10",
  },
  {
    id: 3,
    name: "Business Society",
    school: "Stanford University",
    schoolId: 3,
    category: "Professional",
    rating: 4.4,
    reviewCount: 27,
    memberCount: 134,
    description: "Networking and professional development for future business leaders.",
    tags: ["Networking", "Career", "Business"],
    savedDate: "2024-01-08",
  },
  {
    id: 4,
    name: "Environmental Action Group",
    school: "MIT",
    schoolId: 2,
    category: "Service",
    rating: 4.7,
    reviewCount: 19,
    memberCount: 92,
    description: "Promoting sustainability and environmental awareness on campus.",
    tags: ["Environment", "Sustainability", "Activism"],
    savedDate: "2024-01-05",
  },
]

export default function SavedClubsPage() {
  const [savedClubs, setSavedClubs] = useState(mockSavedClubs)
  const [sortBy, setSortBy] = useState("recent")

  const handleRemoveClub = (clubId) => {
    setSavedClubs((prev) => prev.filter((club) => club.id !== clubId))
    // TODO: Implement actual removal from saved clubs
    console.log(`Removed club ${clubId} from saved clubs`)
  }

  const handleSort = (value) => {
    setSortBy(value)
    const sorted = [...savedClubs].sort((a, b) => {
      switch (value) {
        case "recent":
          return new Date(b.savedDate) - new Date(a.savedDate)
        case "name":
          return a.name.localeCompare(b.name)
        case "rating":
          return b.rating - a.rating
        case "school":
          return a.school.localeCompare(b.school)
        default:
          return 0
      }
    })
    setSavedClubs(sorted)
  }

  const renderStars = (rating, size = "w-4 h-4") => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star key={i} className={`${size} ${i < rating ? "text-yellow-500 fill-current" : "text-gray-300"}`} />
    ))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">Saved Clubs</h1>
              <p className="text-gray-600">Your bookmarked clubs ({savedClubs.length})</p>
            </div>

            {/* Sort Options */}
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700 whitespace-nowrap">Sort by:</span>
              <Select value={sortBy} onValueChange={handleSort}>
                <SelectTrigger className="w-48 border-2 border-gray-200 rounded-xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recent">Recently Saved</SelectItem>
                  <SelectItem value="name">Club Name</SelectItem>
                  <SelectItem value="rating">Highest Rated</SelectItem>
                  <SelectItem value="school">School Name</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Empty State */}
        {savedClubs.length === 0 && (
          <div className="bg-white rounded-2xl shadow-lg p-12 border border-blue-100 text-center">
            <div className="text-gray-400 mb-4">
              <HeartCrack className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No Saved Clubs</h3>
            <p className="text-gray-600 mb-6">
              You haven't saved any clubs yet. Start exploring and bookmark clubs you're interested in!
            </p>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold" asChild>
              <Link href="/directory">Explore Clubs</Link>
            </Button>
          </div>
        )}

        {/* Saved Clubs Grid */}
        {savedClubs.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {savedClubs.map((club) => (
              <div
                key={club.id}
                className="bg-white rounded-2xl shadow-lg border border-blue-100 p-6 hover:shadow-xl transition-all duration-300"
              >
                {/* Club Header */}
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge className="bg-blue-100 text-blue-800 text-xs">{club.category}</Badge>
                      <div className="flex items-center gap-1 text-yellow-500">
                        <Star className="w-4 h-4 fill-current" />
                        <span className="text-sm font-medium text-gray-700">{club.rating}</span>
                      </div>
                    </div>
                    <Link href={`/club/${club.id}`} className="group">
                      <h3 className="text-xl font-bold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
                        {club.name}
                      </h3>
                    </Link>
                    <Link
                      href={`/school/${club.schoolId}`}
                      className="text-blue-600 hover:text-blue-700 font-medium text-sm underline underline-offset-4"
                    >
                      {club.school}
                    </Link>
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => handleRemoveClub(club.id)}
                    className="p-2 rounded-full hover:bg-red-50 transition-colors group/remove"
                    title="Remove from saved clubs"
                  >
                    <HeartCrack className="w-5 h-5 text-red-500 hover:scale-110 transition-all group-hover/remove:text-red-600" />
                  </button>
                </div>

                {/* Club Description */}
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{club.description}</p>

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
                <div className="flex flex-wrap gap-1 mb-4">
                  {club.tags.slice(0, 3).map((tag, index) => (
                    <Badge key={index} variant="outline" className="text-xs border-blue-200 text-blue-600">
                      {tag}
                    </Badge>
                  ))}
                </div>

                {/* Saved Date */}
                <div className="text-xs text-gray-500 border-t border-gray-100 pt-3">
                  Saved on{" "}
                  {new Date(club.savedDate).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Action Buttons */}
        {savedClubs.length > 0 && (
          <div className="mt-8 text-center">
            <Button
              variant="outline"
              className="border-2 border-blue-200 text-blue-600 hover:bg-blue-50 px-6 py-3 rounded-xl font-semibold bg-transparent mr-4"
              asChild
            >
              <Link href="/directory">Explore More Clubs</Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
