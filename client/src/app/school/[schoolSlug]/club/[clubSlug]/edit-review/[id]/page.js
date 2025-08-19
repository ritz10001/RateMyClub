"use client"

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Star, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useAuth } from "@/app/context/AuthContext";
import { useClub } from "@/app/context/ClubContext";
import { forbidden, useParams, useRouter } from "next/navigation";
import { toast } from 'sonner';
import { getAuth } from "firebase/auth";
import { app } from "@/app/utils/firebase";
import AuthRoute from "@/app/components/AuthRoute";

export default function EditReviewPage({ params }){
  const { schoolSlug, clubSlug, id } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const redirectPath = `/school/${schoolSlug}/club/${clubSlug}`;
  return(
    <AuthRoute redirectTo={redirectPath}>
      <EditReviewContent schoolSlug={schoolSlug} clubSlug={clubSlug} id={id} />
    </AuthRoute>
  );
}

function EditReviewContent({ schoolSlug, clubSlug, id }) {
  const [isLoading, setIsLoading] = useState(true);
  const [forbidden, setForbidden] = useState(false);
  const { user, isInitialized } = useAuth();
  const { clubData } = useClub();
  const router = useRouter();
  const [reviewData, setReviewData] = useState({
    leadershipRating: 0,
    inclusivityRating: 0,
    networkingRating: 0,
    skillsDevelopmentRating: 0,
    comment: "",
    recommendation: "",
  })
  const [error, setError] = useState(false);
  const auth = getAuth(app);
  console.log("THIS IS REVIEW ID", id);
  useEffect(() => {
    const fetchReviewData = async () => {
      console.log("ENTERING");
      try {
        const currentUser = auth.currentUser;
        const idToken = await currentUser.getIdToken();
        console.log("tried");
        const response = await fetch(`http://localhost:5095/api/Review/${id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${idToken}`
          }
        });
        if (response.status === 403) {
          setForbidden(true);
          return;
        }
        const data = await response.json();
        console.log("fetching complete");
        console.log(data);
        setReviewData(data);
      } 
      catch (error) {
        console.error('Error fetching review:', error);
      } 
      finally {
        setIsLoading(false);
      }
    }
    if(isInitialized){
      fetchReviewData();
    }
  }, [id, user]);

  const isFormValid = () => {
    const { comment, leadershipRating, inclusivityRating, networkingRating, skillsDevelopmentRating, recommendation } = reviewData;
    return comment.trim().length >= 20 && 
            recommendation !== "" &&
            leadershipRating > 0 && 
            inclusivityRating > 0 && 
            networkingRating > 0 && 
            skillsDevelopmentRating > 0;
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
    if (!isFormValid()) {
      alert("Form is invalid. Please complete all required fields.");
      return; // stop submission!
    }
    try{
      console.log("TRYING NOW");
      console.log(reviewData);
      const currentUser = auth.currentUser;
      const idToken = await currentUser.getIdToken();
      const response = await fetch(`http://localhost:5095/api/Review/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${idToken}`
        },
        body: JSON.stringify({
          leadershipRating: reviewData.leadershipRating,
          inclusivityRating: reviewData.inclusivityRating,
          networkingRating: reviewData.networkingRating,
          skillsDevelopmentRating: reviewData.skillsDevelopmentRating,
          comment: reviewData.comment,
          recommendation: reviewData.recommendation,
        })
      })
      if(response.ok){
        toast.success("Review edited successfully!", {
          duration: 5000, // 5 seconds
        });
        router.replace(`/school/${schoolSlug}/club/${clubSlug}`);
      }
      else{
        const errorData = await response.json(); // Get error details
        console.error('Backend error:', errorData);
        console.log("failed");
        setError(true);
        toast.error(errorData.message || "Submission failed. Please try again.");
        throw new Error(errorData.message || 'Update failed');
      }
    }
    catch(error){
      console.error('Login error:', error);
      toast.error("Network error. Please try again.");
      alert('Network error. Please try again.');
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
    { key: "leadershipRating", label: "Leadership", description: "How well does the club develop leadership skills?" },
    { key: "inclusivityRating", label: "Inclusivity", description: "How welcoming and inclusive is the club environment?" },
    { key: "networkingRating", label: "Networking", description: "How good are the networking opportunities?" },
    {
      key: "skillsDevelopmentRating",
      label: "Skills Development",
      description: "How much did you learn and develop new skills?",
    },
  ]

  useEffect(() => {
    if (forbidden) {
      return router.replace("/"); 
    }
  }, [forbidden, router]);

  if(isLoading || forbidden){
    return(
      <div className="fixed inset-0 bg-white dark:bg-black z-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
          <p className="text-gray-600 dark:text-white text-lg font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white dark:from-zinc-950 dark:to-zinc-900 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <Link
            href={`/school/${schoolSlug}/club/${clubSlug}`}
            className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-500 font-medium mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Club
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100">Edit a Review</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Share your experience with Tech Robotics Association</p>
        </div>

        {/* Review Form */}
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Rating Categories */}
          <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-lg p-8 border border-blue-100 dark:border-blue-900">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">Rate Your Experience</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {ratingCategories.map((category) => (
                <div key={category.key} className="space-y-3">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{category.label + " "}<span className="text-red-500">*</span></h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{category.description}</p>
                  </div>
                  {renderStarRating(category.key, reviewData[category.key])}
                  {reviewData[category.key] > 0 && (
                    <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">{reviewData[category.key]} out of 5 stars</p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Review Details */}
          <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-lg p-8 border border-blue-100 dark:border-blue-900">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">Tell Us More</h2>
            <div className="space-y-6">

              {/* Main Review */}
              <div>
                <Label htmlFor="comment" className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                  Your Review (Min: 20 characters, Max: 1000 characters) <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="comment"
                  placeholder="Share your detailed experience with this club. What did you like? What could be improved?"
                  value={reviewData.comment}
                  onChange={(e) => handleInputChange("comment", e.target.value)}
                  className="min-h-32 border-2 border-gray-200 dark:border-zinc-700 rounded-xl focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none transition-colors dark:bg-zinc-800 dark:text-gray-100 dark:placeholder:text-gray-400"
                  required
                />
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 block">
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
                      checked={reviewData.recommendation === "yes"}
                      onChange={(e) => handleInputChange("recommendation", e.target.value)}
                      className="
                        mr-2 w-5 h-5 border border-gray-300 dark:border-zinc-600 rounded 
                        checked:bg-blue-500 dark:checked:bg-blue-600 checked:border-blue-500 dark:checked:border-blue-600
                        focus:outline-none focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800
                        transition-colors duration-200
                        relative
                      "
                    />
                    <label htmlFor="recommend-yes" className="cursor-pointer text-gray-900 dark:text-gray-100">Yes</label>
                  </div>
                  <div className="flex items-center mb-2">
                    <input
                      type="radio"
                      id="recommend-no"
                      name="recommendation"
                      value="no"
                      checked={reviewData.recommendation === "no"}
                      required
                      onChange={(e) => handleInputChange("recommendation", e.target.value)}
                      className="
                        mr-2 w-5 h-5 border border-gray-300 dark:border-zinc-600 rounded 
                        checked:bg-red-500 dark:checked:bg-red-600 checked:border-red-500 dark:checked:border-red-600
                        focus:outline-none focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800
                        transition-colors duration-200
                        relative
                      "
                    />
                    <label htmlFor="recommend-no" className="cursor-pointer text-gray-900 dark:text-gray-100">No</label>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Submit Section */}
          <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-lg p-8 border border-blue-100 dark:border-blue-900">
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
              <div className="text-sm text-gray-600 dark:text-gray-400">
                <p>Your review will be posted publicly and help other students make informed decisions.</p>
                <p className="mt-1">Please be honest and constructive in your feedback.</p>
              </div>
              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  className="border-2 border-gray-200 dark:border-zinc-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-zinc-800 px-6 py-3 rounded-xl font-semibold bg-transparent"
                  onClick={() => router.replace(`/school/${schoolSlug}/club/${clubSlug}`)}
                >
                  {/* <Link href={`/school/${schoolSlug}/club/${clubSlug}`}>Cancel</Link> */}Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-blue-600 dark:bg-blue-700 hover:bg-blue-700 dark:hover:bg-blue-600 text-white px-8 py-3 rounded-xl font-semibold"
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
  );
}
