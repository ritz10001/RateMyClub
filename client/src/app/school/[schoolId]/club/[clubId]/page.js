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
import { getAuth } from "firebase/auth"
import { app } from "@/app/utils/firebase"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

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
  const { user, isInitialized } = useAuth();
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
  const auth = getAuth(app);
  console.log("Club ID:", clubId);
  console.log("bookmark status", isBookmarked);
  console.log("USER INFORMATION", user);

  useEffect(() => {}, [reviewToDelete])

  const fetchClubDetails = async () => {
  try {
    if (!isInitialized) {
      console.log("Auth not initialized yet, skipping fetch");
      return;
    }
    // Always use Firebase auth directly for token operations
    const currentUser = auth.currentUser;
    
    if (!currentUser) {
      console.log("No user logged in, fetching public data only");
      // Fetch public club data without auth
      const response = await fetch(`http://localhost:5095/api/Club/${clubId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setClub(data);
        setIsBookmarked(false);
      }
      return;
    }

    // User is logged in, get token from Firebase directly
    console.log("User logged in, fetching with auth");
    const idToken = await currentUser.getIdToken(); // Use currentUser, not user from context
    
    const response = await fetch(`http://localhost:5095/api/Club/${clubId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${idToken}`
      }
    });
    
    if (response.ok) {
      const data = await response.json();
      setClub(data);
      setIsBookmarked(data.isBookmarked || false);
    }
  } catch (error) {
    console.error("Error fetching club information:", error);
  } finally {
    setIsLoading(false);
  }
};

  useEffect(() => {
  const fetchInitialData = async () => {
    try {
      console.log("TRYING TO FETCH DATA");
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

  // Only fetch when auth is initialized
  if (isInitialized) {
    fetchInitialData();
  }
}, [clubId, user, isInitialized]); // Include all dependencies here

  const fetchReviewsPage = async (page = 1, pageSize = 5) => {
    try {
      const headers = { "Content-Type": "application/json" };

      // Get token from Firebase if logged in
      if (auth.currentUser) {
        const idToken = await auth.currentUser.getIdToken();
        headers["Authorization"] = `Bearer ${idToken}`;
      }

      const response = await fetch(
        `http://localhost:5095/api/Club/${clubId}/reviews?page=${page}&pageSize=${pageSize}`,
        { method: "GET", headers }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Review details", data);

      setReviews(prev => page === 1 ? data.items : [...prev, ...data.items]);
      setTotalReviewCount(data.totalCount);
      setPageSize(data.pageSize);
      setCurrentPage(data.page);

      const updatedVotes = { ...userVotes };
      data.items.forEach(review => {
        updatedVotes[review.id] = review.currentUserVote || 0;
      });
      setUserVotes(updatedVotes);

    } catch (error) {
      console.error("Error fetching reviews:", error);
      toast.error(error.message || "Failed to fetch reviews");
    }
  };


  const handleBookmark = async () => {
    if (!user) {
      setIsModalOpen(true);
      return;
    }

    try {
      const message = !isBookmarked ? "Club Bookmarked!" : "Bookmark Removed";
      toast.success(message, { duration: 1000 });

      const currentUser = auth.currentUser;
      if (!currentUser) {
        toast.error("Please log in to bookmark clubs");
        return;
      }

      const idToken = await currentUser.getIdToken();

      const url = `http://localhost:5095/api/SavedClub`;
      const options = !isBookmarked
        ? {
            method: "POST",
            headers: { "Content-Type": "application/json", "Authorization": `Bearer ${idToken}` },
            body: JSON.stringify({ clubId }),
          }
        : {
            method: "DELETE",
            headers: { "Content-Type": "application/json", "Authorization": `Bearer ${idToken}` },
            body: JSON.stringify({ clubId }),
          };

      const response = await fetch(url, options);

      if (!response.ok) {
        throw new Error("Bookmark update failed");
      }

      // Re-fetch to sync with backend truth
      await fetchClubDetails();
    } catch (error) {
      toast.error(error.message || "Bookmark update failed");
    }
  };

  const handleVoteClick = async (newValue, reviewId) => {
  if (!user) {
    setIsModalOpen(true);
    return;
  }
  if (isVoting) return;

  setIsVoting(true);

  try {
    // Get token from the current Firebase auth user
    const idToken = await auth.currentUser.getIdToken();

    const currentVote = userVotes[reviewId] || 0;
    const sendValue = currentVote === newValue ? 0 : newValue;

    const response = await fetch("http://localhost:5095/api/ReviewVote", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${idToken}`
      },
      body: JSON.stringify({ reviewId, value: sendValue })
    });

    if (!response.ok) {
      // try to extract an error message from the response body
      let errMsg = "Vote failed";
      try {
        const errBody = await response.json();
        if (errBody && errBody.message) errMsg = errBody.message;
        else if (typeof errBody === "string") errMsg = errBody;
      } catch (e) { /* ignore parse errors */ }
      throw new Error(errMsg);
    }

    const result = await response.json();

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

  } catch (error) {
    console.error("Voting error:", error);
    const message = error?.message || "Vote failed";
    toast.error(message);
  } finally {
    setIsVoting(false);
  }
};




  const handleSubmitReview = (e) => {
    e.preventDefault()
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

  if (isLoading || !isInitialized) { 
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white dark:from-zinc-950 dark:to-zinc-900 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Club Header */}
        <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-lg p-8 mb-8 border border-blue-100 dark:border-blue-900">
          <div className="flex flex-col md:flex-row justify-between items-start gap-6">
            <div className="flex-1">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-2xl md:text-3xl xl:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2">{club.name}</h1>
                  <Link
                    href={`/school/${schoolId}`}
                    className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-500 font-medium text-lg underline underline-offset-4"
                  >
                    {club.universityName}
                  </Link>
                </div>
                
                <button onClick={handleBookmark} className="p-2 rounded-full hover:bg-red-50 dark:hover:bg-red-950 transition-colors group">
                  <Heart
                    className={`w-6 h-6 transition-all ${
                      isBookmarked ? "text-red-500 fill-current" : "text-red-500 dark:text-red-400 hover:fill-current hover:scale-110"
                    }`}
                  />
                </button>
              </div>
              <div className="mb-4">
              {user && user.roles.includes("Administrator") && 
                <div className="flex items-center gap-2">
                  <Button 
                    className="flex items-center gap-2 px-6 py-3 border-2 border-blue-200 dark:border-blue-900 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950 hover:border-blue-300 dark:hover:border-blue-700 rounded-xl transition-all duration-200 hover:scale-105 font-semibold bg-transparent"
                    title="Edit University"
                    onClick = {() => {
                      router.replace(`http://localhost:3000/admin/club/${clubId}/edit`);
                    }}
                  >Edit
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button 
                    className="flex items-center gap-2 px-6 py-3 border-2 border-red-200 dark:border-red-900 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950 hover:border-red-300 dark:hover:border-red-700 rounded-xl transition-all duration-200 hover:scale-105 font-semibold bg-transparent"
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
                <Badge className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">{club.categoryName}</Badge>
                {club.tags.map((tag, index) => (
                  <Badge key={index} variant="outline" className="border-blue-200 dark:border-blue-900 text-blue-600 dark:text-blue-400">
                    {tag}
                  </Badge>
                ))}
              </div>

              <p className="text-gray-700 dark:text-gray-300 mb-6 text-md md:text-lg leading-relaxed">Just a description</p>

                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                  <MapPin className="w-4 h-4" />
                  <span>{club.clubLocation}</span>
                </div>
            </div>
          </div>
        </div>

        {/* Rating Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Overall Rating */}
          <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-lg p-6 border border-blue-100 dark:border-blue-900">
            <h2 className="text-xl md:text-2xl xl:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-6">Overall Rating</h2>

            {/* Overall Rating Display */}
            <div className="text-center mb-6">
              <div className="text-5xl font-bold text-gray-900 dark:text-gray-100 mb-2">{club.averageRating}</div>
              <div className="flex justify-center gap-1 mb-2">
                {renderStars(Math.round(club.averageRating), "w-6 h-6")}
              </div>
              <p className="text-gray-600 dark:text-gray-400">Based on {club.reviewCount} review(s)</p>
            </div>

            {/* Rating Distribution */}
            <div className="mb-6">
              <h3 className="text-xl md:text-2xl xl:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">Rating Distribution</h3>
              {[5, 4, 3, 2, 1].map((star) =>
                renderRatingBar(star, club.ratingDistribution[star], club.reviewCount),
              )}
            </div>

            {/* Add Review Button */}
            
            <Button className="w-full bg-blue-600 dark:bg-blue-700 hover:bg-blue-700 dark:hover:bg-blue-600 text-white py-3 rounded-xl font-semibold flex items-center justify-center"
              onClick={() => {
                if(user) {
                  router.replace(`/school/${schoolId}/club/${clubId}/add-review`);
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
          <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-lg p-6 border border-blue-100 dark:border-blue-900">
            <h2 className="text-xl md:text-2xl xl:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-6">Rating Breakdown</h2>
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
          <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-lg p-12 border border-blue-100 dark:border-blue-900 text-center">
            <div className="text-gray-400 dark:text-gray-500 mb-4">
              <NotebookPen className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">No Reviews</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              No ratings yet. Be the first one to review!
            </p>
            <Button className="bg-blue-600 dark:bg-blue-700 hover:bg-blue-700 dark:hover:bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold"
              onClick={() => {
                if(user) {
                  router.replace(`/school/${schoolId}/club/${clubId}/add-review`);
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
          <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-lg p-6 border border-blue-100 dark:border-blue-900">
            <h2 className="text-xl md:text-2xl xl:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-6">Reviews ({reviews.length})</h2>
            {/* Reviews List */}
            <div className="space-y-6 border-t border-gray-500 dark:border-zinc-700 p-4">
              {reviews.map((review) => (
                <div key={review.id} className="border-b border-gray-200 dark:border-zinc-800 pb-6 last:border-b-0">
                  <p>{console.log("REVIEW USER ID", review.userId)}</p>
                  {user && review.userId === user.sqlUserId && <p className="font-bold dark:text-gray-300">(MY REVIEW)</p>}
                  <div className="flex justify-between mb-3">
                    <div>
                      <div className="flex items-center justify-center gap-2 mt-1 w-full">
                        <div className="flex items-center gap-2">
                          <div className="flex">{renderStars(((review.inclusivityRating + review.leadershipRating + review.networkingRating + review.skillsDevelopmentRating) / 4).toFixed(1))}</div>
                          <div className="flex font-bold dark:text-gray-300">{((review.inclusivityRating + review.leadershipRating + review.networkingRating + review.skillsDevelopmentRating) / 4).toFixed(1)}</div>
                        </div>
                        {user && (
                          <div className="flex items-center gap-2">
                            {/* Only allows editing if the user is the owner */}
                            {review.userId === user.sqlUserId && (
                              <Button 
                                className="flex items-center gap-2 px-6 py-3 border-2 border-blue-200 dark:border-blue-900 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950 hover:border-blue-300 dark:hover:border-blue-700 rounded-xl transition-all duration-200 hover:scale-105 font-semibold bg-transparent"
                                title="Edit Review"
                                onClick={() => {
                                  setClubData(review);
                                  router.replace(`/school/${schoolId}/club/${clubId}/edit-review/${review.id}`);
                                }}
                              >
                                Edit
                                <Pencil className="w-4 h-4" />
                              </Button>
                            )}

                            {/* Allow deletion if the user is the owner OR an admin */}
                            {(review.userId === user.sqlUserId) && (
                              <Button 
                                className="flex items-center gap-2 px-6 py-3 border-2 border-red-200 dark:border-red-900 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950 hover:border-red-300 dark:hover:border-red-700 rounded-xl transition-all duration-200 hover:scale-105 font-semibold bg-transparent"
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
                      <div className="text-sm mt-1 text-gray-500 dark:text-gray-400">{monthNumbers[parseInt(review.createdAt.slice(5,7))] + " " + parseInt(review.createdAt.slice(8,10)) + ", " + review.createdAt.slice(0,4)}</div>
                    </div>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">{review.comment}</p>
                  <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                    <div className="flex items-center gap-4">
                      <button className={`transition-colors ${userVotes[review.id] === 1 ? "text-green-500" : ""} ${isVoting ? "opacity-50 cursor-not-allowed" : ""}`} 
                      onClick={() => handleVoteClick(1, review.id)} disabled={isVoting}>
                        <ArrowBigUp className={`hover:text-green-600 transition-colors ${userVotes[review.id] === 1 ? "fill-green-500" : ""} ${isVoting ? "opacity-50 cursor-not-allowed" : ""}`}/>
                      </button>
                      <p className="font-bold dark:text-gray-300">{review.netScore}</p>
                      <button className={`transition-colors ${userVotes[review.id] === -1 ? "text-red-500" : ""} ${isVoting ? "opacity-50 cursor-not-allowed" : ""}`} 
                      onClick={() => handleVoteClick(-1, review.id)} disabled={isVoting}>
                      <ArrowBigDown className={`hover:text-red-600 transition-colors ${userVotes[review.id] === -1 ? "fill-red-500" : ""} ${isVoting ? "opacity-50 cursor-not-allowed" : ""}`}/>
                      </button>
                    </div>
                    {/* <button className="flex items-center gap-2 text-sm hover:text-red-500 font-medium">
                      <span className="text-black font-bold"></span><Flag className="hover:fill-red-500 transition-colors" />
                      
                    </button> */}
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button className="flex items-center gap-2 text-sm hover:text-red-500 font-medium">
                            <span className="text-black dark:text-gray-200 font-bold"></span>
                            <Flag className="hover:fill-red-500 transition-colors" />
                          </button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Coming soon!</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </div>
              ))}
            </div>
            {/* Load More Reviews */}
            <div className="text-center mt-8">
              {reviews.length < totalReviewCount && (
                <Button className="bg-white dark:bg-zinc-800 text-blue-600 dark:text-blue-400 border border-blue-300 dark:border-blue-700 hover:bg-gray-100 dark:hover:bg-zinc-700 hover:text-blue-700 dark:hover:text-blue-500 hover:border-blue-400 dark:hover:border-blue-600 transition-colors duration-200" onClick={() => fetchReviewsPage(currentPage + 1)}>
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
      <DeleteModal 
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        modalText={deleteMode}
        onDelete={async () => {
          if((deleteMode === "Review" && !reviewToDelete) || (deleteMode === "Club" && !clubToDelete)){
            return;
          }
          try {
            console.log("club id is", clubToDelete);
            const url = deleteMode === "Review" 
              ? `/Review/${reviewToDelete}` 
              : `/AdminClub/${clubToDelete}`;
            console.log(url);
            const currentUser = auth.currentUser;
            const idToken = await currentUser.getIdToken();
            
            const response = await fetch(`http://localhost:5095/api${url}`, {
              method: "DELETE" ,
              headers: {
                "Authorization": `Bearer ${idToken}`
              }
            });
            
            if (deleteMode === "Review") {
              setReviews((prevReviews) =>
                prevReviews.filter((r) => r.id !== reviewToDelete)
              );
              router.replace(`/school/${schoolId}/club/${clubId}`);
            }
            if(deleteMode == "Club"){
              router.replace(`/school/${schoolId}`);
            }
            toast.success(`${deleteMode} deleted successfully!`, {
              duration: 5000, // 5 seconds
            });
          }
          catch(error){
            console.error(error);
            toast.error(error.response?.data?.message || "Deletion failed. Please try again.");
          }
          finally {
            setIsDeleteOpen(false);
            setReviewToDelete(null);
            setDeleteMode(null);
            setClubToDelete(null);
          }
        }}
      />
    </div>
  )
}
