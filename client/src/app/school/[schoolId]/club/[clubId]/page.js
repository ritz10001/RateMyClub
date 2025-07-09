"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Star, Heart, Users, Calendar, MapPin, Plus, Pencil, Trash2 } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"
import { use } from "react"; 
import LoginModal from "@/app/components/login-modal"
import { useAuth } from "@/app/context/AuthContext"
import { useRouter } from "next/navigation"
import { useClub } from "@/app/context/ClubContext"

// Mock data for club details

const monthNumbers = {
  1: "January",
  2: "February",
  3: "March",
  4: "April",
  5: "May",
  6: "June",
  7: "July",
  8: "August",
  9: "September",
  10: "October",
  11: "November",
  12: "December",
}

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
  const { user } = useAuth();
  const { setClubData } = useClub();
  const router = useRouter();
  const [isUserReview, setIsUserReview] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [club, setClub] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [showReviewForm, setShowReviewForm] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [advice, setAdvice] = useState("");
  const [newReview, setNewReview] = useState({
    rating: 5,
    reviewText: "",
  })
  const [userVote, setUserVote] = useState(null);
  
  const { schoolId, clubId } = use(params);

  useEffect(() => {
    const fetchClubDetails = async () => {
      try{
        const response = await fetch(`http://localhost:5095/api/club/${clubId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          }
        })
        if(response.ok){
          const data = await response.json();
          console.log("Club details fetched successfully:", data);
          setClub(data);
          setReviews(data.reviews || []);
        }
        else{
          console.error("Failed to fetch club details:");
        }
      }
      catch(error) {
        console.error("Error fetching club information:", error);
      }
      finally {
        setIsLoading(false);
      }
    }
    fetchClubDetails();
  }, [clubId])
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

  if (isLoading) {
    return <>
      <div className="col-span-full flex justify-center py-12 space-x-4">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        <p className="font-bold text-xl">Now Loading..</p>
      </div>
    </>;
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
                  <h1 className="text-3xl font-bold text-gray-900 mb-2 md:text-4xl">{club.name}</h1>
                  <Link
                    href={`/school/${schoolId}`}
                    className="text-blue-600 hover:text-blue-700 font-medium text-lg underline underline-offset-4"
                  >
                    {club.universityName}
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
                <Badge className="bg-blue-100 text-blue-800">{club.categoryName}</Badge>
                {club.tags.map((tag, index) => (
                  <Badge key={index} variant="outline" className="border-blue-200 text-blue-600">
                    {tag}
                  </Badge>
                ))}
              </div>

              <p className="text-gray-700 mb-6 text-lg leading-relaxed">{mockClub.description}</p>

                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  <span>{club.clubLocation}</span>
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
              <div className="text-5xl font-bold text-gray-900 mb-2">{club.averageRating}</div>
              <div className="flex justify-center gap-1 mb-2">
                {renderStars(Math.round(club.averageRating), "w-6 h-6")}
              </div>
              <p className="text-gray-600">Based on {reviews.length} reviews</p>
            </div>

            {/* Rating Distribution */}
            <div className="mb-6">
              <h3 className="font-semibold text-gray-900 mb-4">Rating Breakdown</h3>
              {[5, 4, 3, 2, 1].map((star) =>
                renderRatingBar(star, club.ratingDistribution[star], reviews.length),
              )}
            </div>

            {/* Add Review Button */}
            <Link href={`/school/${schoolId}/club/${clubId}/add-review`} className="w-full">
              <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold flex items-center justify-center">
                <Plus className="w-4 h-4" />
                Add A Review
              </Button>
            </Link>
          </div>

          {/* Category Breakdown */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-blue-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Rating Breakdown</h2>
            <div className="space-y-1">
              {renderCategoryRating("leadership", (reviews.reduce((acc, review) => acc + review.leadershipRating, 0) / reviews.length).toFixed(1))}
              {renderCategoryRating("inclusivity", (reviews.reduce((acc, review) => acc + review.inclusivityRating, 0) / reviews.length).toFixed(1))}
              {renderCategoryRating("networking", (reviews.reduce((acc, review) => acc + review.networkingRating, 0) / reviews.length).toFixed(1))}
              {renderCategoryRating("skillsDevelopment", (reviews.reduce((acc, review) => acc + review.skillsDevelopmentRating, 0) / reviews.length).toFixed(1))}
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-blue-100">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Reviews ({reviews.length})</h2>


          {/* Reviews List */}
          <div className="space-y-6">
            {reviews.map((review) => (
              <div key={review.id} className="border-b border-gray-200 pb-6 last:border-b-0">
                {review.userId === user.userId && <p className="font-bold">(MY REVIEW)</p>}
                <div className="flex justify-between mb-3">
                  <div>
                    <div className="flex items-center justify-center gap-2 mt-1 w-full">
                      <div className="flex items-center gap-2">
                        <div className="flex">{renderStars(((review.inclusivityRating + review.leadershipRating + review.networkingRating + review.skillsDevelopmentRating) / 4).toFixed(1))}</div>
                        <div className="flex font-bold">{((review.inclusivityRating + review.leadershipRating + review.networkingRating + review.skillsDevelopmentRating) / 4).toFixed(1)}</div>
                      </div>
                      {review.userId === user.userId && <div className="flex items-center gap-2">
                        <button 
                          className="p-2 border-2 border-blue-200 text-blue-600 hover:bg-blue-50 hover:border-blue-300 rounded-lg transition-all duration-200 hover:scale-105"
                          title="Edit Review"
                          onClick = {() => {
                            setClubData(review);
                            router.push(`/school/${schoolId}/club/${clubId}/edit-review/${review.id}`);
                          }}
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button 
                          className="p-2 border-2 border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 rounded-lg transition-all duration-200 hover:scale-105"
                          title="Delete Review"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>           
                      </div>}
                    </div>
                    <div className="text-sm mt-1 text-gray-500">{monthNumbers[parseInt(review.createdAt.slice(5,7))] + " " + parseInt(review.createdAt.slice(8,10)) + ", " + review.createdAt.slice(0,4)}</div>
                  </div>
                </div>
                <p className="text-gray-700 leading-relaxed mb-3">{review.comment}</p>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <button className="hover:text-green-500 transition-colors" onClick={() => {
                      if(!user){
                        setIsModalOpen(true);
                        return;
                      }
                    }}>
                    👍{review.thumbsup}
                  </button>
                  <button className="hover:text-red-500 transition-colors" onClick={() => {
                      if(!user){
                        setIsModalOpen(true)
                        return;
                      }
                    }}>
                    👎{review.thumbsdown}
                  </button>
                  <LoginModal 
                    isOpen={isModalOpen} 
                    onClose={() => setIsModalOpen(false)} 
                  />
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
