"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Star, ArrowLeft, HeartCrack, Users } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"
import { useAuth } from "../context/AuthContext"
import { toast } from "sonner"
import { getAuth } from "firebase/auth"
import { app } from "../utils/firebase"
import AuthRoute from "../components/AuthRoute"


export default function SavedClubsPage(){
  return (
    <AuthRoute>
      <SavedClubsContent />
    </AuthRoute>
  );
}
function SavedClubsContent() {
  const [savedClubs, setSavedClubs] = useState([]);
  const [sortBy, setSortBy] = useState("recent");
  const [isLoading, setIsLoading] = useState(true)
  const { user, isInitialized } = useAuth();
  const auth = getAuth(app);

  useEffect(() => {
    const fetchSavedClubs = async () => {
      if (!user) {
        console.log("User not authenticated yet, skipping fetch");
        return;
      }
      try {
        // Get fresh Firebase ID token for auth header
        const currentUser = auth.currentUser;
        const idToken = await currentUser.getIdToken();

        const response = await fetch("http://localhost:5095/api/SavedClub", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${idToken}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setSavedClubs(data);
        } 
        else {
          toast.error("Failed to fetch saved clubs. Please try again later.");
        }
      } 
      catch (error) {
        toast.error("An error occurred while fetching saved clubs.");
      } 
      finally {
        setIsLoading(false);
      }
    };

    if (isInitialized) {
      fetchSavedClubs();
    }
  }, [user, isInitialized]);


const handleRemoveClub = async (clubId) => {
  if (!user) {
    toast.error("You must be logged in to remove a saved club.");
    return;
  }

  try {
    // Get fresh Firebase ID token for auth header
    const currentUser = auth.currentUser;
    const idToken = await currentUser.getIdToken();

    const response = await fetch(`http://localhost:5095/api/SavedClub/`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${idToken}`,
      },
      body: JSON.stringify({ clubId }),
    });

    if (response.ok) {
      const data = await response.json();
      console.log(data);
      setSavedClubs((prev) => prev.filter((club) => club.clubId !== clubId));
      toast.success("Club removed from saved clubs successfully.");
    } 
    else {
      const errorData = await response.json();
      toast.error(`Failed to remove club: ${errorData.message || "Unknown error"}`);
    }
  } 
  catch (error) {
    toast.error("An error occurred while removing the club, please try again later.");
  }
};


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

  if(!isInitialized || isLoading){
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
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-500 font-medium mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2">Saved Clubs</h1>
              <p className="text-gray-600 dark:text-gray-400">Your bookmarked clubs ({savedClubs.length})</p>
            </div>

            {/* Sort Options */}
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap">Sort by:</span>
              <Select value={sortBy} onValueChange={handleSort}>
                <SelectTrigger className="w-48 border-2 border-gray-200 dark:border-zinc-700 rounded-xl bg-white dark:bg-zinc-800 text-gray-900 dark:text-gray-100">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-zinc-800 border-zinc-700">
                  <SelectItem value="recent" className="text-gray-900 dark:text-gray-100">Recently Saved</SelectItem>
                  <SelectItem value="name" className="text-gray-900 dark:text-gray-100">Club Name</SelectItem>
                  <SelectItem value="rating" className="text-gray-900 dark:text-gray-100">Highest Rated</SelectItem>
                  <SelectItem value="school" className="text-gray-900 dark:text-gray-100">School Name</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Empty State */}
        {savedClubs.length === 0 && (
          <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-lg p-12 border border-blue-100 dark:border-blue-900 text-center">
            <div className="text-gray-400 dark:text-gray-500 mb-4">
              <HeartCrack className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">No Saved Clubs</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              You haven't saved any clubs yet. Start exploring and bookmark clubs you're interested in!
            </p>
            <Button className="bg-blue-600 dark:bg-blue-700 hover:bg-blue-700 dark:hover:bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold" asChild>
              <Link href="/directory">Explore Clubs</Link>
            </Button>
          </div>
        )}

        {/* Saved Clubs Grid */}
        {savedClubs.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {savedClubs.map((club) => (
              <div
                key={club.clubId}
                className="bg-white dark:bg-zinc-900 rounded-2xl shadow-lg border border-blue-100 dark:border-blue-900 p-6 hover:shadow-xl transition-all duration-300"
              >
                {/* Club Header */}
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300 text-xs">{club.categoryName}</Badge>
                      <div className="flex items-center gap-1 text-yellow-500">
                        <Star className="w-4 h-4 fill-current dark:text-yellow-400" />
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{club.averageRating}</span>
                      </div>
                    </div>
                    <Link href={`/school/${club.universityId}/club/${club.clubId}`} className="group">
                      <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {club.clubName}
                      </h3>
                    </Link>
                    <Link
                      href={`/school/${club.universityId}`}
                      className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-500 font-medium text-sm underline underline-offset-4"
                    >
                      {club.universityName}
                    </Link>
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => handleRemoveClub(club.clubId)}
                    className="p-2 rounded-full hover:bg-red-50 dark:hover:bg-red-950 transition-colors group/remove"
                    title="Remove from saved clubs"
                  >
                    <HeartCrack className="w-5 h-5 text-red-500 dark:text-red-400 hover:scale-110 transition-all group-hover/remove:text-red-600 dark:group-hover/remove:text-red-500" />
                  </button>
                </div>

                {/* Club Description */}
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">{club.description}</p>

                {/* Club Stats */}
                <div className="flex justify-between items-center mb-4 text-sm text-gray-600 dark:text-gray-400">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4" />
                    <span>{club.reviewCount} reviews</span>
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1 mb-4">
                  {club.tags.slice(0, 3).map((tag, index) => (
                    <Badge key={index} variant="outline" className="text-xs border-blue-200 dark:border-blue-900 text-blue-600 dark:text-blue-400 bg-white dark:bg-zinc-900">
                      {tag}
                    </Badge>
                  ))}
                </div>

                {/* Saved Date */}
                <div className="text-xs text-gray-500 dark:text-gray-400 border-t border-gray-100 dark:border-zinc-800 pt-3">
                  Saved on{" "}
                  {new Date(club.savedAt).toLocaleDateString("en-US", {
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
              className="border-2 border-blue-200 dark:border-blue-900 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950 px-6 py-3 rounded-xl font-semibold bg-transparent mr-4"
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
