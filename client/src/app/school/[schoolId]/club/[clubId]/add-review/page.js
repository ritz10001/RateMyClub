"use client"

import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Star, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

export default function WriteReviewPage({ params }) {
  const [reviewData, setReviewData] = useState({
    leadership: 0,
    inclusivity: 0,
    networking: 0,
    skillsDevelopment: 0,
    reviewTitle: "",
    reviewText: "",
    pros: "",
    cons: "",
    advice: "",
    isAnonymous: false,
  })

  const isFormValid = () => {
    const { reviewText, leadership, inclusivity, networking, skillsDevelopment } = reviewData;

    return reviewText.trim() !== "" && 
            leadership > 0 && 
            inclusivity > 0 && 
            networking > 0 && 
            skillsDevelopment > 0;
    };

  const handleRatingChange = (category, rating) => {
    setReviewData((prev) => ({
      ...prev,
      [category]: rating,
    }))
  }

  const handleInputChange = (field, value) => {
    setReviewData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // TODO: Implement review submission
    console.log("Review submitted:", reviewData)
  }

  const renderStarRating = (category, currentRating) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => handleRatingChange(category, star)}
            className="transition-colors hover:scale-110"
          >
            <Star
              className={`w-8 h-8 ${
                star <= currentRating ? "text-yellow-500 fill-current" : "text-gray-300 hover:text-yellow-400"
              }`}
            />
          </button>
        ))}
      </div>
    )
  }

  const ratingCategories = [
    { key: "leadership", label: "Leadership", description: "How well does the club develop leadership skills?" },
    { key: "inclusivity", label: "Inclusivity", description: "How welcoming and inclusive is the club environment?" },
    { key: "networking", label: "Networking", description: "How good are the networking opportunities?" },
    {
      key: "skillsDevelopment",
      label: "Skills Development",
      description: "How much did you learn and develop new skills?",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <Link
            href={"/school/1/club/1"}
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Club
          </Link>
          <h1 className="text-4xl font-bold text-gray-900">Write a Review</h1>
          <p className="text-gray-600 mt-2">Share your experience with Tech Robotics Association</p>
        </div>

        {/* Review Form */}
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Rating Categories */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-blue-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Rate Your Experience</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {ratingCategories.map((category) => (
                <div key={category.key} className="space-y-3">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{category.label}</h3>
                    <p className="text-sm text-gray-600">{category.description}</p>
                  </div>
                  {renderStarRating(category.key, reviewData[category.key])}
                  {reviewData[category.key] > 0 && (
                    <p className="text-sm text-blue-600 font-medium">{reviewData[category.key]} out of 5 stars</p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Review Details */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-blue-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Tell Us More</h2>
            <div className="space-y-6">
              {/* Review Title */}
              <div>
                <Label htmlFor="reviewTitle" className="text-sm font-medium text-gray-700 mb-2 block">
                  Review Title
                </Label>
                <Input
                  id="reviewTitle"
                  type="text"
                  placeholder="Summarize your experience in a few words..."
                  value={reviewData.reviewTitle}
                  onChange={(e) => handleInputChange("reviewTitle", e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
                  required
                />
              </div>

              {/* Main Review */}
              <div>
                <Label htmlFor="reviewText" className="text-sm font-medium text-gray-700 mb-2 block">
                  Your Review <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="reviewText"
                  placeholder="Share your detailed experience with this club. What did you like? What could be improved?"
                  value={reviewData.reviewText}
                  onChange={(e) => handleInputChange("reviewText", e.target.value)}
                  className="min-h-32 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
                  required
                />
              </div>

              {/* Advice */}
              <div>
                <Label htmlFor="advice" className="text-sm font-medium text-gray-700 mb-2 block">
                  Advice for Future Members (optional)
                </Label>
                <Textarea
                  id="advice"
                  placeholder="What advice would you give to students considering joining this club?"
                  value={reviewData.advice}
                  onChange={(e) => handleInputChange("advice", e.target.value)}
                  className="min-h-24 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
                />
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-700 mb-3 block">
                  Would you like to remain Anonymous?
                </Label>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="anonymous"
                    checked={reviewData.isAnonymous}
                    onChange={(e) => handleInputChange("isAnonymous", e.target.checked)}
                    className="
                      appearance-none w-5 h-5 border border-gray-300 rounded 
                      checked:bg-green-500 checked:border-green-500
                      focus:outline-none focus:ring-2 focus:ring-blue-200
                      transition-colors duration-200
                    "
                  />
                  <label htmlFor="anonymous" className="text-sm text-gray-700">
                    Yes, post this review anonymously (If checked, your name will not be displayed with this review)
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Submit Section */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-blue-100">
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
              <div className="text-sm text-gray-600">
                <p>Your review will be posted publicly and help other students make informed decisions.</p>
                <p className="mt-1">Please be honest and constructive in your feedback.</p>
              </div>
              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  className="border-2 border-gray-200 text-gray-600 hover:bg-gray-50 px-6 py-3 rounded-xl font-semibold bg-transparent"
                  asChild
                >
                  <Link href={`/club/${params.id}`}>Cancel</Link>
                </Button>
                <Button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-semibold"
                  disabled={!isFormValid()}
                >
                  Submit Review
                </Button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
