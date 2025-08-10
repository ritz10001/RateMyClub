"use client"

import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Star, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"
import { toast } from 'sonner';
import { use } from "react"; 
import { useRouter } from 'next/navigation'
import { useAuth } from "@/app/context/AuthContext"
import { getAuth } from "firebase/auth"
import { app } from "@/app/utils/firebase"

export default function WriteReviewPage({ params }) {
  const router = useRouter();
  const { user, isInitialized } = useAuth();
  const [reviewData, setReviewData] = useState({
    leadership: 0,
    inclusivity: 0,
    networking: 0,
    skillsDevelopment: 0,
    comment: "",
    recommendation: "",
  })
  const [error, setError] = useState(false);
  const { schoolId, clubId } = use(params);
  const auth = getAuth(app);
  console.log("THIS IS CLUB ID", clubId);
  useEffect(() => {
    console.log("HERE IS LATEST REVIEW DATA", reviewData)
  }, [reviewData]);

  useEffect(() => {
    if (error) {
      toast.error('Please make sure to fill all the required details!');
    }
  }, [error]);

  const isFormValid = () => {
    const { comment, leadership, inclusivity, networking, skillsDevelopment, recommendation } = reviewData;

    return comment.trim().length > 20 && 
            recommendation !== "" &&
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try{
      console.log("TRYING NOW");
      console.log(reviewData);
      const currentUser = auth.currentUser;
      const idToken = await currentUser.getIdToken();
      const response = await fetch("http://localhost:5095/api/Review", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${idToken}`
        },
        body: JSON.stringify({
          leadershipRating: reviewData.leadership,
          inclusivityRating: reviewData.inclusivity,
          networkingRating: reviewData.networking,
          skillsDevelopmentRating: reviewData.skillsDevelopment,
          comment: reviewData.comment,
          recommendation: reviewData.recommendation,
          clubId: clubId
        })
      })
      if(response.ok){
        const authResponse = await response.json();
        toast.success("Review submitted successfully!", {
            duration: 5000, // 5 seconds
        });
        router.push(`/school/${schoolId}/club/${clubId}`);
        
      }
      else{
        console.log("failed");
        setError(true);
        toast.error(error.message || "Submission failed. Please try again.");
      }
    }
    catch(error){
      console.error('Login error:', error);
      toast.error(error.message || "Submission failed. Please try again.");
    }
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
            href={`/school/${schoolId}/club/${clubId}`}
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
                    <h3 className="text-lg font-semibold text-gray-900">{category.label + " "}<span className="text-red-500">*</span></h3>
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

              {/* Main Review */}
              <div>
                <Label htmlFor="comment" className="text-sm font-medium text-gray-700 mb-2 block">
                  Your Review (Min: 20 characters, Max: 1000 characters) <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="comment"
                  placeholder="Share your detailed experience with this club. What did you like? What could be improved?"
                  value={reviewData.comment}
                  onChange={(e) => handleInputChange("comment", e.target.value)}
                  className="min-h-32 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
                  required
                />
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-700 mb-3 block">
                  Would you recommend others to join this club? <span className="text-red-500">*</span>
                </Label>
                <div className="flex flex-col items-start">
                  <div className="flex items-center mb-2">
                    <input
                      type="radio"
                      id="recommend-yes"
                      name="recommendation"
                      value="yes"
                      required
                      // checked={reviewData.recommendation === "yes"}
                      onChange={(e) => handleInputChange("recommendation", e.target.value)}
                      className="
                        mr-2 w-5 h-5 border border-gray-300 rounded 
                        checked:bg-blue-500 checked:border-blue-500
                        focus:outline-none focus:ring-2 focus:ring-blue-200
                        transition-colors duration-200
                        relative
                      "
                    />
                    <label htmlFor="recommend-yes" className="cursor-pointer">Yes</label>
                  </div>
                  <div className="flex items-center mb-2">
                    <input
                      type="radio"
                      id="recommend-no"
                      name="recommendation"
                      value="no"
                      // checked={reviewData.recommendation === "no"}
                      required
                      onChange={(e) => handleInputChange("recommendation", e.target.value)}
                      className="
                        mr-2 w-5 h-5 border border-gray-300 rounded 
                        checked:bg-red-500 checked:border-red-500
                        focus:outline-none focus:ring-2 focus:ring-blue-200
                        transition-colors duration-200
                        relative
                      "
                    />
                    <label htmlFor="recommend-no" className="cursor-pointer">No</label>
                  </div>
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
