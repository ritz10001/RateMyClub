"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Star, Heart, Users, Calendar, MapPin, Plus } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

// Mock data for club details

const mockClub = {
  id: 1,
  name: "Tech Robotics Association",
  school: "Texas Tech University",
  category: "Engineering",
  description:
    "Building the future through innovative robotics projects and competitions. Join us for weekly meetings, workshops, and exciting competitions!",
  memberCount: 156,
  establishedYear: 2015,
  meetingTime: "Wednesdays 7:00 PM",
  location: "Engineering Building Room 201",
  overallRating: 4.2,
  totalReviews: 47,
  tags: ["STEM", "Competition", "Innovation", "Hands-on"],
  ratingDistribution: {
    5: 18,
    4: 15,
    3: 8,
    2: 4,
    1: 2,
  },
  categoryRatings: {
    leadership: 4.1,
    inclusivity: 4.3,
    networking: 3.9,
    skillsDevelopment: 4.5,
  },
}

// Mock reviews data
const mockReviews = [
  {
    id: 1,
    reviewerName: "Sarah M.",
    rating: 5,
    date: "2 weeks ago",
    reviewText:
      "Amazing club! The projects are challenging and the community is very supportive. I've learned so much about robotics and programming. Highly recommend for anyone interested in STEM!",
    thumbsup: 12,
    thumbsdown: 1,
  },
  {
    id: 2,
    reviewerName: "Mike R.",
    rating: 4,
    date: "1 month ago",
    reviewText:
      "Great club with lots of hands-on experience. The weekly meetings are well-organized and the competitions are exciting. Only downside is that it can get quite busy during competition season.",
    thumbsup: 8,
    thumbsdown: 1,
  },
  {
    id: 3,
    reviewerName: "Jessica L.",
    rating: 5,
    date: "1 month ago",
    reviewText:
      "Best decision I made in college! The mentorship from senior members is incredible and the projects we work on are cutting-edge. Perfect for building your resume and networking.",
    thumbsup: 15,
    thumbsdown: 1,
  },
  {
    id: 4,
    reviewerName: "David K.",
    rating: 3,
    date: "2 months ago",
    reviewText:
      "Decent club but requires a lot of time commitment. The projects are interesting but can be overwhelming for beginners. Would recommend having some programming background first.",
    thumbsup: 5,
    thumbsdown: 1,
  },
]

export default function ClubPage({ params }) {
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [showReviewForm, setShowReviewForm] = useState(false)
  const [newReview, setNewReview] = useState({
    rating: 5,
    reviewText: "",
  })
  const [userVote, setUserVote] = useState(null);
  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked)
    // TODO: Implement bookmark functionality
  }

  const handleSubmitReview = (e) => {
    e.preventDefault()
    // TODO: Implement review submission
    console.log("New review:", newReview)
    setShowReviewForm(false)
    setNewReview({ rating: 5, reviewText: "" })
  }

  const renderStars = (rating, size = "w-4 h-4") => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star key={i} className={`${size} ${i < rating ? "text-yellow-500 fill-current" : "text-gray-300"}`} />
    ))
  }

  const renderRatingBar = (starCount, count, total) => {
    const percentage = total > 0 ? (count / total) * 100 : 0
    return (
      <div className="flex items-center gap-2 mb-2">
        <span className="text-sm font-medium w-6">{starCount}</span>
        <Star className="w-4 h-4 text-yellow-500 fill-current" />
        <div className="flex-1 bg-gray-200 rounded-full h-2">
          <div
            className="bg-yellow-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${percentage}%` }}
          />
        </div>
        <span className="text-sm text-gray-600 w-8">{count}</span>
      </div>
    )
  }

  const renderCategoryRating = (category, rating) => {
    return (
      <div className="flex justify-between items-center py-3 border-b border-gray-100 last:border-b-0">
        <span className="text-gray-700 font-medium capitalize">{category.replace(/([A-Z])/g, " $1").trim()}</span>
        <div className="flex items-center gap-2">
          <div className="flex">{renderStars(Math.round(rating))}</div>
          <span className="text-sm font-semibold text-gray-900 w-8">{rating}</span>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Club Header */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 border border-blue-100">
          <div className="flex flex-col lg:flex-row justify-between items-start gap-6">
            <div className="flex-1">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-4xl font-bold text-gray-900 mb-2">{mockClub.name}</h1>
                  <Link
                    href={`/school/1`}
                    className="text-blue-600 hover:text-blue-700 font-medium text-lg underline underline-offset-4"
                  >
                    {mockClub.school}
                  </Link>
                </div>
                <button onClick={handleBookmark} className="p-2 rounded-full hover:bg-red-50 transition-colors group">
                  <Heart
                    className={`w-6 h-6 transition-all ${
                      isBookmarked ? "text-red-500 fill-current" : "text-red-500 hover:fill-current hover:scale-110"
                    }`}
                  />
                </button>
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                <Badge className="bg-blue-100 text-blue-800">{mockClub.category}</Badge>
                {mockClub.tags.map((tag, index) => (
                  <Badge key={index} variant="outline" className="border-blue-200 text-blue-600">
                    {tag}
                  </Badge>
                ))}
              </div>

              <p className="text-gray-700 mb-6 text-lg leading-relaxed">{mockClub.description}</p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  <span>{mockClub.memberCount} members</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>{mockClub.meetingTime}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  <span>{mockClub.location}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Rating Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Overall Rating */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-blue-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Overall Rating</h2>

            {/* Overall Rating Display */}
            <div className="text-center mb-6">
              <div className="text-5xl font-bold text-gray-900 mb-2">{mockClub.overallRating}</div>
              <div className="flex justify-center gap-1 mb-2">
                {renderStars(Math.round(mockClub.overallRating), "w-6 h-6")}
              </div>
              <p className="text-gray-600">Based on {mockClub.totalReviews} reviews</p>
            </div>

            {/* Rating Distribution */}
            <div className="mb-6">
              <h3 className="font-semibold text-gray-900 mb-4">Rating Breakdown</h3>
              {[5, 4, 3, 2, 1].map((star) =>
                renderRatingBar(star, mockClub.ratingDistribution[star], mockClub.totalReviews),
              )}
            </div>

            {/* Add Review Button */}
            <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold">
              <Link href={`/school/1/club/1/add-review`} className="flex items-center">
                <Plus className="w-4 h-4 mr-2" />
                Add A Review
              </Link>
            </Button>
          </div>

          {/* Category Breakdown */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-blue-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Rating Breakdown</h2>
            <div className="space-y-1">
              {renderCategoryRating("leadership", mockClub.categoryRatings.leadership)}
              {renderCategoryRating("inclusivity", mockClub.categoryRatings.inclusivity)}
              {renderCategoryRating("networking", mockClub.categoryRatings.networking)}
              {renderCategoryRating("skillsDevelopment", mockClub.categoryRatings.skillsDevelopment)}
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-blue-100">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Reviews ({mockClub.totalReviews})</h2>

          {/* Add Review Form */}
          {showReviewForm && (
            <div className="bg-blue-50 rounded-xl p-6 mb-6 border border-blue-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Write a Review</h3>
              <form onSubmit={handleSubmitReview} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Your Rating</label>
                  <Select
                    value={newReview.rating.toString()}
                    onValueChange={(value) => setNewReview({ ...newReview, rating: Number.parseInt(value) })}
                  >
                    <SelectTrigger className="w-full border-2 border-blue-200 rounded-xl">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[5, 4, 3, 2, 1].map((rating) => (
                        <SelectItem key={rating} value={rating.toString()}>
                          <div className="flex items-center gap-2">
                            <span>{rating}</span>
                            <div className="flex">{renderStars(rating)}</div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Your Review</label>
                  <Textarea
                    value={newReview.reviewText}
                    onChange={(e) => setNewReview({ ...newReview, reviewText: e.target.value })}
                    placeholder="Share your experience with this club..."
                    className="min-h-32 border-2 border-blue-200 rounded-xl focus:border-blue-500"
                    required
                  />
                </div>
                <div className="flex gap-3">
                  <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl">
                    Submit Review
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowReviewForm(false)}
                    className="border-blue-200 text-blue-600 hover:bg-blue-50 rounded-xl"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </div>
          )}

          {/* Reviews List */}
          <div className="space-y-6">
            {mockReviews.map((review) => (
              <div key={review.id} className="border-b border-gray-200 pb-6 last:border-b-0">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="font-semibold text-gray-900">{review.reviewerName}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex">{renderStars(review.rating)}</div>
                      <span className="text-sm text-gray-500">{review.date}</span>
                    </div>
                  </div>
                </div>
                <p className="text-gray-700 leading-relaxed mb-3">{review.reviewText}</p>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <button className="hover:text-green-500 transition-colors">
                    👍{review.thumbsup}
                  </button>
                  <button className="hover:text-red-500 transition-colors">
                    👎{review.thumbsdown}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Load More Reviews */}
          <div className="text-center mt-8">
            <Button
              variant="outline"
              className="border-2 border-blue-200 text-blue-600 hover:bg-blue-50 px-8 py-3 rounded-xl font-semibold bg-transparent"
            >
              Load More Reviews
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
