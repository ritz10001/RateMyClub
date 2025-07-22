"use client"

import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Star, ArrowLeft, HeartCrack, Users, NotebookPen, Pencil, Trash2, University, Ban } from "lucide-react"
import { toast } from "sonner"
import WithdrawRequestModal from "../components/withdraw-request-modal";
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

const statusCodes = {
  "Pending": 0,
  "Approved": 1,
  "Rejected": 2
}

export default function MyRequestsPage(){
  const [universityRequests, setUniversityRequests] = useState([]);
  const [clubRequests, setClubRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [filterBy, setFilterBy] = useState("All");
  const [displayedRequests, setDisplayedRequests] = useState([]);
  const [requestType, setRequestType] = useState("university");
  const [itemToDelete, setItemToDelete] = useState(null);
  const [requests, setRequests] = useState([]);
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    const fetchUniversityRequests = async () => {
      if (!user?.token) {
        console.log("User not authenticated yet, skipping fetch");
        return;
      }
      try {
        const response = await fetch("http://localhost:5095/api/UniversityRequest/my-university-requests", {
          method: "GET",
          headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${user?.token}`
          }
          })
          if(response.ok){
            const data = await response.json();
            console.log(data);
            setUniversityRequests(data);
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
      fetchUniversityRequests();
  }, [user?.token]);

  useEffect(() => {
    const fetchClubRequests = async () => {
      try {
        const response = await fetch("http://localhost:5095/api/ClubRequest/my-club-requests", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${user?.token}`
          }
        })
        if(response.ok){
          const data = await response.json();
          setClubRequests(data);
        }
        else{
          toast.error("Failed to fetch club requests. Please try again later.")
        }
      }
      catch(error){
        toast.error("An error occurred while trying to fetch club requests.");
      }
      finally{
        setIsLoading(false);
      }
    }
    if (user?.token) {
      fetchClubRequests();
    }
  }, [user?.token]);

  const WithdrawRequest = async () => {
    if(!itemToDelete){
      return;
    }
    const endpoint = requestType === "university" ? `http://localhost:5095/api/UniversityRequest/${itemToDelete}`
    : `http://localhost:5095/api/ClubRequest/${itemToDelete}`;
    try{
      const response = await fetch(endpoint, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${user.token}`
        }
      });
      if (!response.ok) throw new Error("Delete failed");

      if (requestType === "university") {
        setUniversityRequests((prevRequests) =>
          prevRequests.filter((r) => r.id !== itemToDelete)
        );
      } 
      else {
        setClubRequests((prevRequests) =>
          prevRequests.filter((r) => r.id !== itemToDelete)
        );
      }
      toast.success("Request deleted successfully!", {
        duration: 5000, // 5 seconds
      });
    }
    catch(error){
      console.error(error);
      toast.error(errorData.message || "Deletion failed. Please try again.");
    }
    finally {
      setIsDeleteOpen(false);
      setItemToDelete(null);
    }
  }

  useEffect(() => {
    updateDisplayedRequests();
  }, [universityRequests, clubRequests, requestType, filterBy]);

  const updateDisplayedRequests = () => {
    const currentRequests = requestType === "university" ? universityRequests : clubRequests;
    let results = [...currentRequests];
    if (filterBy !== "All") {
      results = results.filter((request) => 
        request.status === statusCodes[filterBy]
      );
    }
    setDisplayedRequests(results);
  }

  const handleRequestTypeChange = (type) => {
    setRequestType(type);
    setFilterBy("All");
  }
  const handleFilter = (category) => {
    setFilterBy(category);
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
              <h1 className="text-4xl font-bold text-gray-900 mb-2">My Requests</h1>
              <p className="text-gray-600">Your requests</p>
            </div>  
            <div className="flex items-center gap-4">
              {/* Request Type Toggle */}
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-700">Type:</span>
                <div className="flex bg-gray-100 rounded-xl p-1">
                  <button
                    onClick={() => handleRequestTypeChange("university")}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      requestType === "university"
                        ? "bg-blue-600 text-white shadow-sm"
                        : "text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    <University className="w-4 h-4 inline mr-1" />
                    Universities
                  </button>
                  <button
                    onClick={() => handleRequestTypeChange("club")}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      requestType === "club"
                        ? "bg-blue-600 text-white shadow-sm"
                        : "text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    <Users className="w-4 h-4 inline mr-1" />
                    Clubs
                  </button>
                </div>
              </div>

              {/* Filter Dropdown */}
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-700 whitespace-nowrap">Filter by:</span>
                <Select value={filterBy} onValueChange={handleFilter}>
                  <SelectTrigger className="w-48 border-2 border-gray-200 rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All</SelectItem>
                    <SelectItem value="Pending">Pending</SelectItem>
                    <SelectItem value="Approved">Approved</SelectItem>
                    <SelectItem value="Rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div> 
        </div>
            
        {displayedRequests.length === 0 && (
          <div className="bg-white rounded-2xl shadow-lg p-12 border border-blue-100 text-center">
            <div className="text-gray-400 mb-4">
              {requestType === "university" ? <University className="w-16 h-16 mx-auto" /> : <Users className="w-16 h-16 mx-auto"/>}
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No {requestType === "university" ? "University" : "Clubs"}</h3>
            <p className="text-gray-600 mb-6">
              You haven't made any {requestType} requests yet. Feel free to request addition of your {requestType}!
            </p>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold" asChild>
              <Link href={`/all-schools`}>Explore {requestType === "university" ? "Universities" : "Clubs"}</Link>
            </Button>
          </div>
        )}
        {displayedRequests.length > 0 &&
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-blue-100 mx-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
              {requestType === "university" ? "University" : "Club"} Requests ({displayedRequests.length})
            </h2>
            {/* Reviews List */}
            <div className="space-y-6 border-t border-gray-500 py-4">
            {displayedRequests.map((request) => (
              <div key={request.id} className="border-b border-gray-500 pb-6 last:border-b-0">
                <div className="flex justify-between">
                  <p className="font-bold text-xl md:text-2xl mb-2 text-gray-700">{requestType === "university" ? request.universityName : request.name}</p>
                    {request.status === 0 && <button 
                    className="flex items-center gap-2 p-2 border-2 border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 rounded-lg transition-all duration-200 hover:scale-105"
                    title="Delete Review"
                    onClick={() => {
                        setItemToDelete(request.id);
                        setIsDeleteOpen(true);
                    }}>Withdraw Request
                    <Ban className="w-4 h-4" />
                    </button>}      
                </div>
                {requestType === "university" && (
                  <p className="text-md mb-2 text-gray-600 font-medium">{request.location}</p>
                )}
                {requestType === "club" && request.universityName && (
                  <p className="text-md mb-2 text-gray-600 font-medium">{request.universityName}</p>
                )}
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm font-semibold text-gray-700">Status:</span>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${
                    request.status === 1 ? "bg-green-100 text-green-800 border-green-200" :
                    request.status === 2 ? "bg-red-100 text-red-800 border-red-200" :
                    "bg-amber-100 text-amber-800 border-amber-200"
                  }`}>
                    {request.status === 1 ? "✅ Approved" :
                      request.status === 2 ? "❌ Rejected" :
                      "🕒 Pending"}
                  </span>
                </div>
                {request.status === 2 && (
                  <p className="text-sm mb-2 text-gray-600 font-medium">Comments: {request.rejectionReason}</p>
                )}
                <p className="text-sm text-gray-500">{monthNumbers[parseInt(request.requestedAt.slice(5,7))] + " " + parseInt(request.requestedAt.slice(8,10)) + ", " + request.requestedAt.slice(0,4)}</p>
              </div>
            ))}
            </div>
          {/* Load More Reviews */}
          <div className="text-center mt-8">
            <Button
              variant="outline"
              className="border-2 border-blue-200 text-blue-600 hover:bg-blue-50 px-8 py-3 rounded-xl font-semibold bg-transparent"
            >
              Load More Requests
            </Button>
          </div>
        </div>
      }
      </div>
      <WithdrawRequestModal 
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onDelete={WithdrawRequest}
      />
    </div>
    );
}