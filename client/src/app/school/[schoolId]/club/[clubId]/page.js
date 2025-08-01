"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Star, Heart, Users, Calendar, MapPin, Plus, Pencil, Trash2, ArrowBigUp, ArrowBigDown, Flag, NotebookPen } from "lucide-react"
import Link from "next/link"
import { useEffect, useState, useRef } from "react"
import { use } from "react"; 
import LoginModal from "@/app/components/login-modal"
import { useAuth } from "@/app/context/AuthContext"
import { useRouter } from "next/navigation"
import { useClub } from "@/app/context/ClubContext"
import DeleteModal from "@/app/components/delete-modal"
import { toast } from 'sonner';
import { Elsie_Swash_Caps } from "next/font/google"
import { api } from "@/app/utils/axios"

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

export default function ClubPage({ params }) {
  const { user } = useAuth();
  const { setClubData } = useClub();
  const router = useRouter();
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [reviewToDelete, setReviewToDelete] = useState(null);
  const [clubToDelete, setClubToDelete] = useState(null);
  const [isUserReview, setIsUserReview] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [club, setClub] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [advice, setAdvice] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [votesLoading, setVotesLoading] = useState(true);
  const toastId = useRef(null);
  const [newReview, setNewReview] = useState({
    rating: 5,
    reviewText: "",
  })
  const [userVotes, setUserVotes] = useState({});
  const [isVoting, setIsVoting] = useState(false);
  const [deleteMode, setDeleteMode] = useState(null);
  const [totalReviewCount, setTotalReviewCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const { schoolId, clubId } = use(params);
  console.log("Club ID:", clubId);
  console.log("bookmark status", isBookmarked);
  const getStoredUser = () => {
  if (typeof window === 'undefined') {
    console.log("getStoredUser: Running on server, returning null");
    return null;
  }
  const userStr = localStorage.getItem("user");
  return userStr ? JSON.parse(userStr) : null;
};

  useEffect(() => {}, [reviewToDelete])
  
  const fetchClubDetails = async () => {
    try{
      if (!user && !isLoading) {
        const initialVotes = {};
        reviews.forEach(review => {
          initialVotes[review.id] = 0;
        });
        setUserVotes(initialVotes);
        return;
      }
      // const storedUser = getStoredUser();
      const response = await api.get(`/Club/${clubId}`);
      const data = response.data;
      console.log("FIRST CLUB DETAILS:", data);
      setClub(data);
      setIsBookmarked(data.isBookmarked || false);
    }
    catch(error) {
      console.error("Error fetching club information:", error);
    }
    finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
  // Create an async function to fetch all initial data
  const fetchInitialData = async () => {
    try {
      setIsLoading(true);
      await fetchClubDetails();
      await fetchReviewsPage();
    } 
    catch (error) {
      console.error("Error fetching initial data:", error);
    } 
    finally {
      setIsLoading(false);
    }
  };

  fetchInitialData();
}, [clubId, user?.token, user?.userId]); // Include all dependencies here

  // useEffect(() => {
  //   fetchClubDetails();
  //   fetchReviewsPage(1); // initial load
  // }, [clubId]);

  const fetchReviewsPage = async (page = 1, pageSize = 1) => {
    try {
      // const headers = {
      //   "Content-Type": "application/json",
      //   ...(user?.token && { Authorization: `Bearer ${user.token}` })
      // };
      // const storedUser = getStoredUser();
      const response = await api.get(`/club/${clubId}/reviews`, {
        params: { page, pageSize },
      });
      console.log("here is response", response.data);

      
      const data = response.data;
      console.log("Fetched reviews (page ${page}):", data);

      // Replace reviews if it's the first page, append otherwise
      setReviews(prev => page === 1 ? data.items : [...prev, ...data.items]);
      setTotalReviewCount(data.totalCount);
      setPageSize(data.pageSize);
      setCurrentPage(data.page);

      // Initialize or update user votes for these reviews
      const updatedVotes = { ...userVotes };
      data.items.forEach(review => {
        updatedVotes[review.id] = review.currentUserVote !== null 
          ? review.currentUserVote 
          : 0;
      });
      setUserVotes(updatedVotes);
    } 
    catch (error) {
      console.error("Error fetching reviews:", error);
      const message = error.response?.data?.message || "Failed to fetch reviews";
      toast.error(message);
    } 
  };


  // useEffect(() => {
  //   fetchClubDetails();
  // }, [clubId, user?.token, user?.userId]);

  const handleBookmark = async () => {
    if(!user){
      setIsModalOpen(true);
      return;
    }
    console.log("BOOKMARK STATE", isBookmarked);
    try {
      // 3. Manage toast
      if (toastId.current) toast.dismiss(toastId.current);
      console.log("inside bookmark now");
      const message = isBookmarked ? "Bookmark Removed" : "Club Bookmarked!";
      toastId.current = toast.success(message, { duration: 1000 });
    // 4. Debounced API call
      const response = await fetch(`http://localhost:5095/api/SavedClub`, {
        method: isBookmarked ? "DELETE" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.token}`
        },
        body: JSON.stringify({ clubId })
      });

      if (!response.ok) {
        // 5. Revert on failure
        // setIsBookmarked(!newBookmarkState);

        throw new Error("Bookmark update failed");
      }
      await fetchClubDetails();
    } 
    catch (error) {
      toast.error(error.message);
    } 
    // finally {
    //   setIsProcessing(false);
    // }
  };

  const handleVoteClick = async (newValue, reviewId) => {
    if (!user) {
      setIsModalOpen(true);
      return;
    }
    if (isVoting) return;
    setIsVoting(true);
    try {
      const currentVote = userVotes[reviewId] || 0;
      let sendValue = currentVote === newValue ? 0 : newValue;
      // const storedUser = getStoredUser();/
      const response = await api.post("/ReviewVote", {
        reviewId: reviewId,
        value: sendValue
      }, );

      const result = response.data;

      setUserVotes(prev => ({
        ...prev,
        [reviewId]: result.newVoteValue
      }));

      setReviews(prev => 
        prev.map(r => 
          r.id === reviewId 
            ? { ...r, netScore: result.newNetScore } 
            : r
        )
      );

    } 
    catch (error) {
      console.error("Voting error:", error);
      const message = error.response?.data?.message || "Vote failed";
      toast.error(message);
    } 
    finally {
      setIsVoting(false);
    }
  };

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
    return (
      <div className="h-[calc(100vh-4rem)] bg-gradient-to-br from-blue-50 to-white flex items-center justify-center">
        <div className="flex items-center space-x-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          <p className="font-bold text-xl">Now Loading..</p>
        </div>
      </div>
    ); 
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Club Header */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 border border-blue-100">
          <div className="flex flex-col md:flex-row justify-between items-start gap-6">
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
              <div className="mb-4">
              {user && user.roles.includes("Administrator") &&
                <div className="flex items-center gap-2">
                  <Button 
                    className="flex items-center gap-2 px-6 py-3 border-2 border-blue-200 text-blue-600 hover:bg-blue-50 hover:border-blue-300 rounded-xl transition-all duration-200 hover:scale-105 font-semibold bg-transparent"
                    title="Edit University"
                    onClick = {() => {
                      router.push(`http://localhost:3000/admin/club/${clubId}/edit`);
                    }}
                  >Edit
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button 
                    className="flex items-center gap-2 px-6 py-3 border-2 border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 rounded-xl transition-all duration-200 hover:scale-105 font-semibold bg-transparent"
                    title="Delete Club"
                    onClick={() => {
                        setIsDeleteOpen(true);
                        setClubToDelete(clubId);
                        console.log("this is club id", clubId);
                        setDeleteMode("Club");
                    }}
                  >Delete
                    <Trash2 className="w-4 h-4" />
                  </Button>           
                </div>
              }
              </div>
              <div className="flex flex-wrap gap-2 mb-4">
                <Badge className="bg-blue-100 text-blue-800">{club.categoryName}</Badge>
                {club.tags.map((tag, index) => (
                  <Badge key={index} variant="outline" className="border-blue-200 text-blue-600">
                    {tag}
                  </Badge>
                ))}
              </div>

              <p className="text-gray-700 mb-6 text-lg leading-relaxed">Just a description</p>

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
              <p className="text-gray-600">Based on {club.reviewCount} review(s)</p>
            </div>

            {/* Rating Distribution */}
            <div className="mb-6">
              <h3 className="font-semibold text-gray-900 mb-4">Rating Breakdown</h3>
              {[5, 4, 3, 2, 1].map((star) =>
                renderRatingBar(star, club.ratingDistribution[star], club.reviewCount),
              )}
            </div>

            {/* Add Review Button */}
            
            <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold flex items-center justify-center"
              onClick={() => {
                if(user) {
                  router.push(`/school/${schoolId}/club/${clubId}/add-review`);
                }
                else{
                  setIsModalOpen(true);
                  return;
                }
              }}>
              <Plus className="w-4 h-4" />
              Add A Review
            </Button>
          </div>

          {/* Category Breakdown */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-blue-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Rating Breakdown</h2>
            <div className="space-y-1">
              {renderCategoryRating("leadership", club.leadershipRating)}
              {renderCategoryRating("inclusivity", club.inclusivityRating)}
              {renderCategoryRating("networking", club.networkingRating)}
              {renderCategoryRating("skillsDevelopment", club.skillsDevelopmentRating)}
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        {/* {reviews.length > 0 &&} */}
        {reviews.length === 0 && (
          <div className="bg-white rounded-2xl shadow-lg p-12 border border-blue-100 text-center">
            <div className="text-gray-400 mb-4">
              <NotebookPen className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No Reviews</h3>
            <p className="text-gray-600 mb-6">
              No ratings yet. Be the first one to review!
            </p>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold"
              onClick={() => {
                if(user) {
                  router.push(`/school/${schoolId}/club/${clubId}/add-review`);
                }
                else{
                  setIsModalOpen(true);
                  return;
                }
              }}>Write a Review
            </Button>
          </div>
        )}
        {reviews.length > 0 && 
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-blue-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Reviews ({reviews.length})</h2>
            {/* Reviews List */}
            <div className="space-y-6 border-t border-gray-500 p-4">
              {reviews.map((review) => (
                <div key={review.id} className="border-b border-gray-200 pb-6 last:border-b-0">
                  <p>{console.log("REVIEW USER ID", review.userId)}</p>
                  {user && review.userId === user.userId && <p className="font-bold">(MY REVIEW)</p>}
                  <div className="flex justify-between mb-3">
                    <div>
                      <div className="flex items-center justify-center gap-2 mt-1 w-full">
                        <div className="flex items-center gap-2">
                          <div className="flex">{renderStars(((review.inclusivityRating + review.leadershipRating + review.networkingRating + review.skillsDevelopmentRating) / 4).toFixed(1))}</div>
                          <div className="flex font-bold">{((review.inclusivityRating + review.leadershipRating + review.networkingRating + review.skillsDevelopmentRating) / 4).toFixed(1)}</div>
                        </div>
                        {user && (
                          <div className="flex items-center gap-2">
                            {/* Only allows editing if the user is the owner */}
                            {review.userId === user.userId && (
                              <Button 
                                className="flex items-center gap-2 px-6 py-3 border-2 border-blue-200 text-blue-600 hover:bg-blue-50 hover:border-blue-300 rounded-xl transition-all duration-200 hover:scale-105 font-semibold bg-transparent"
                                title="Edit Review"
                                onClick={() => {
                                  setClubData(review);
                                  router.push(`/school/${schoolId}/club/${clubId}/edit-review/${review.id}`);
                                }}
                              >
                                Edit
                                <Pencil className="w-4 h-4" />
                              </Button>
                            )}

                            {/* Allow deletion if the user is the owner OR an admin */}
                            {(review.userId === user.userId || user.roles.includes("Administrator")) && (
                              <Button 
                                className="flex items-center gap-2 px-6 py-3 border-2 border-red-200 text-red-600 hover:bg-blue-50 hover:border-blue-300 rounded-xl transition-all duration-200 hover:scale-105 font-semibold bg-transparent"
                                title="Delete Review"
                                onClick={() => {
                                  setReviewToDelete(review.id);
                                  setDeleteMode("Review");
                                  setIsDeleteOpen(true);
                                }}
                              >
                                Delete
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            )}
                          </div>
                        )}
                      </div>
                      <div className="text-sm mt-1 text-gray-500">{monthNumbers[parseInt(review.createdAt.slice(5,7))] + " " + parseInt(review.createdAt.slice(8,10)) + ", " + review.createdAt.slice(0,4)}</div>
                    </div>
                  </div>
                  <p className="text-gray-700 leading-relaxed mb-3">{review.comment}</p>
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center gap-4">
                      <button className={`transition-colors ${userVotes[review.id] === 1 ? "text-green-500" : ""} ${isVoting ? "opacity-50 cursor-not-allowed" : ""}`} 
                      onClick={() => handleVoteClick(1, review.id)} disabled={isVoting}>
                        <ArrowBigUp className={`hover:text-green-600 transition-colors ${userVotes[review.id] === 1 ? "fill-green-500" : ""} ${isVoting ? "opacity-50 cursor-not-allowed" : ""}`}/>
                      </button>
                      <p className="font-bold">{review.netScore}</p>
                      <button className={`transition-colors ${userVotes[review.id] === -1 ? "text-red-500" : ""} ${isVoting ? "opacity-50 cursor-not-allowed" : ""}`} 
                      onClick={() => handleVoteClick(-1, review.id)} disabled={isVoting}>
                      <ArrowBigDown className={`hover:text-red-600 transition-colors ${userVotes[review.id] === -1 ? "fill-red-500" : ""} ${isVoting ? "opacity-50 cursor-not-allowed" : ""}`}/>
                      </button>
                    </div>
                    <button className="flex items-center gap-2 text-sm hover:text-red-500 font-medium">
                      <span className="text-black font-bold"></span><Flag className="hover:fill-red-500 transition-colors" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <DeleteModal 
              isOpen={isDeleteOpen}
              onClose={() => setIsDeleteOpen(false)}
              modalText={deleteMode}
              onDelete={async () => {
                if((deleteMode === "Review" && !reviewToDelete) || (deleteMode === "Club" && !clubToDelete)){
                  return;
                }
                try{
                  console.log("club id is", clubToDelete);
                  const url = deleteMode === "Review" ? `http://localhost:5095/api/Review/${reviewToDelete}` : `http://localhost:5095/api/AdminClub/${clubToDelete}`;
                  console.log(url);
                  const response = await fetch(url, {
                    method: "DELETE",
                    headers: {
                      "Authorization": `Bearer ${user.token}`
                    }
                  });
                  if (!response.ok) throw new Error("Delete failed");
                  if (deleteMode === "Review") {
                    setReviews((prevReviews) =>
                      prevReviews.filter((r) => r.id !== reviewToDelete)
                    );
                  };
                  toast.success(`${deleteMode} deleted successfully!`, {
                    duration: 5000, // 5 seconds
                  });
                  router.push(`/school/${schoolId}/club/${clubId}`);
                }
                catch(error){
                  console.error(error);
                  toast.error("Deletion failed. Please try again.");
                }
                finally {
                  setIsDeleteOpen(false);
                  setReviewToDelete(null);
                  setDeleteMode(null);
                  setClubToDelete(null);
                }
              }}
            />

            {/* Load More Reviews */}
            <div className="text-center mt-8">
              {reviews.length < totalReviewCount && (
                <Button className="bg-white text-blue-600 border border-blue-300 hover:bg-gray-100 hover:text-blue-700 hover:border-blue-400 transition-colors duration-200" onClick={() => fetchReviewsPage(currentPage + 1)}>
                  Load More Reviews
                </Button>
              )}
            </div>
          </div>
        }
      </div>
      <LoginModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </div>
  )
}
