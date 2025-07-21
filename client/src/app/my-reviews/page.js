"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Star, ArrowLeft, HeartCrack, Users, NotebookPen, Pencil, Trash2 } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"
import { useAuth } from "../context/AuthContext"
import { toast } from "sonner"
import DeleteReviewModal from "@/app/components/delete-review-modal"
import LoginModal from "@/app/components/login-modal"
import { useClub } from "../context/ClubContext"
import { useRouter } from "next/navigation"

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

export default function MyReviewsPage() {
  const [reviews, setReviews] = useState([]);
  const [sortBy, setSortBy] = useState("recent");
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [reviewToDelete, setReviewToDelete] = useState(null);
  const router = useRouter();
  // const { setClubData } = useClub();
  const { user } = useAuth();

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch("http://localhost:5095/api/Review/mine", {
          method: "GET",
          headers:{
            "Content-Type": "application/json",
            "Authorization": `Bearer ${user?.token}`    
          }
        }) 
        if(response.ok){
          const data = await response.json();
          setReviews(data);
        }
        else{
          toast.error("Failed to fetch reviews. Please try again later.")
        }
      }
      catch(error){
        toast.error("An error occured while trying to fetch reviews.");
      }
      finally{
        setIsLoading(false);
      }
    }
    fetchReviews();
  });
  
  const handleSort = (value) => {
    setSortBy(value)
    const sorted = [...savedClubs].sort((a, b) => {
      switch (value) {
        case "recent":
          return new Date(b.savedDate) - new Date(a.savedDate)
        case "name":
          return a.name.localeCompare(b.name)
        case "school":
          return a.school.localeCompare(b.school)
        default:
          return 0
      }
    })
    setReviews(sorted)  
  }

  const renderStars = (rating, size = "w-4 h-4") => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star key={i} className={`${size} ${i < rating ? "text-yellow-500 fill-current" : "text-gray-300"}`} />
    ))
  }

  if (isLoading) {
    return <>
      <div className="col-span-full flex justify-center py-12 space-x-4">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        <p className="font-bold text-xl">Now Loading..</p>
      </div>
    </>;
  }

  return(
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">My Reviews</h1>
              <p className="text-gray-600">Your reviews ({reviews.length})</p>
            </div>

            {/* Sort Options */}
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700 whitespace-nowrap">Sort by:</span>
              <Select value={sortBy} onValueChange={handleSort}>
                <SelectTrigger className="w-48 border-2 border-gray-200 rounded-xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recent">Recent Comments</SelectItem>
                  <SelectItem value="name">Club Name</SelectItem>
                  <SelectItem value="school">School Name</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Empty State */}
        {reviews.length === 0 && (
          <div className="bg-white rounded-2xl shadow-lg p-12 border border-blue-100 text-center">
            <div className="text-gray-400 mb-4">
              <NotebookPen className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No Reviews</h3>
            <p className="text-gray-600 mb-6">
              You haven't made any reviews yet. Start exploring and reviewing clubs!
            </p>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold" asChild>
              <Link href="/directory">Explore Clubs</Link>
            </Button>
          </div>
        )}
      </div>
      {reviews.length > 0 &&
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-blue-100 mx-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Reviews ({reviews.length})</h2>


          {/* Reviews List */}
          <div className="space-y-6 border-t border-gray-500 py-4">
            {reviews.map((review) => (
              <div key={review.id} className="border-b border-gray-500 pb-6 last:border-b-0">
                {/* <p>{console.log("REVIEW USER ID", review.userId)}</p> */}
                {/* {user && review.userId === user.userId && <p className="font-bold">(MY REVIEW)</p>} */}
                <div className="flex justify-between mb-3">
                  <div>
                    <div className="flex items-center justify-center gap-2 mt-1 w-full">
                      <div className="flex items-center gap-2">
                        <div className="flex">{renderStars(review.overallRating)}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button 
                          className="flex items-center gap-2 p-2 border-2 border-blue-200 text-blue-600 hover:bg-blue-50 hover:border-blue-300 rounded-lg transition-all duration-200 hover:scale-105"
                          title="Edit Review"
                          onClick = {() => {
                            // setClubData(review);
                            router.push(`/school/${review.universityId}/club/${review.clubId}/edit-review/${review.id}`);
                          }}
                        >Edit
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button 
                          className="flex items-center gap-2 p-2 border-2 border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 rounded-lg transition-all duration-200 hover:scale-105"
                          title="Delete Review"
                          onClick={() => {
                              setReviewToDelete(review.id)
                              setIsDeleteOpen(true);
                          }}
                        >Delete
                          <Trash2 className="w-4 h-4" />
                        </button>           
                      </div>
                    </div>
                    <div className="text-sm mt-1 text-gray-500">{monthNumbers[parseInt(review.createdAt.slice(5,7))] + " " + parseInt(review.createdAt.slice(8,10)) + ", " + review.createdAt.slice(0,4)}</div>
                  </div>
                </div>
                <p className="text-gray-700 leading-relaxed mb-3">{review.comment}</p>
                {/* <div className="flex items-center justify-between text-sm text-gray-500">
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
                </div> */}
              </div>
            ))}
          </div>
          <DeleteReviewModal 
            isOpen={isDeleteOpen}
            onClose={() => setIsDeleteOpen(false)}
            onDelete={async () => {
              if(!reviewToDelete){
                return;
              }
              try{
                console.log("THIS REVIEW TO DELETE", reviewToDelete);
                const response = await fetch(`http://localhost:5095/api/Review/${reviewToDelete}`, {
                  method: "DELETE",
                  headers: {
                    "Authorization": `Bearer ${user.token}`
                  }
                });
                if (!response.ok) throw new Error("Delete failed");
                setReviews((prevReviews) =>
                  prevReviews.filter((r) => r.id !== reviewToDelete)
                );
                toast.success("Review deleted successfully!", {
                  duration: 5000, // 5 seconds
                });
              }
              catch(error){
                console.error(error);
                toast.error(errorData.message || "Deletion failed. Please try again.");
              }
              finally {
                setIsDeleteOpen(false);
                setReviewToDelete(null);
              }
            }}
          />

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
      }
    </div>
  );
}