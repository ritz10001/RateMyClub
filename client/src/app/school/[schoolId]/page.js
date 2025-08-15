"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Search, Plus, Users, Star, MapPin, Calendar, Heart, Pencil, Trash2 } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { use } from "react"
import LoginModal from "@/app/components/login-modal"
import { useAuth } from "@/app/context/AuthContext"
import { useRouter } from "next/navigation"
import DeleteModal from "@/app/components/delete-modal"
import { toast } from 'sonner';
import PageNav from "@/app/components/PageNav"
import { api } from "@/app/utils/axios"
import { getAuth } from "firebase/auth"
import { app } from "@/app/utils/firebase"
// Mock data for school details

export default function SchoolPage({ params }) {
  const { schoolId } = useParams();
  console.log("params:", params);
  console.log("universityId:", schoolId);

  const [university, setUniversity] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [clubs, setClubs] = useState([]);
  const [filteredClubs, setFilteredClubs] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [filterBy, setFilterBy] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [universityToDelete, setUniversityToDelete] = useState(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(6);
  const [totalPages, setTotalPages] = useState(1);
  const { user, isInitialized } = useAuth();
  const auth = getAuth(app);
  console.log("USER INFORMATION", user);
  const router = useRouter();

  useEffect(() => {
  const fetchClubs = async () => {
    try {
      if (!isInitialized) {
        console.log("Auth not initialized yet, skipping fetch");
        return;
      }

      const currentUser = auth.currentUser;
    
      if (!currentUser) {
        console.log("No user logged in, fetching public data only");
        // Fetch public club data without auth
        const response = await fetch(`http://localhost:5095/api/University/${schoolId}/clubs?page=${page}&pageSize=${pageSize}&search=${searchQuery}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json"
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          console.log("Fetched clubs:", data);
          setUniversity(data.university);
          setClubs(data.clubs.items || []);
          setFilteredClubs(data.clubs.items || []);
          setTotalPages(Math.ceil(data.clubs.totalCount / pageSize));
        }
        return;
      }
      console.log("User logged in, fetching with auth");
      const idToken = await currentUser.getIdToken();
      const response = await fetch(`http://localhost:5095/api/University/${schoolId}/clubs?page=${page}&pageSize=${pageSize}&search=${searchQuery}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${idToken}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log("Fetched clubs:", data);
        setUniversity(data.university);
        setClubs(data.clubs.items || []);
        setFilteredClubs(data.clubs.items || []);
        setTotalPages(Math.ceil(data.clubs.totalCount / pageSize));
      }
    } 
    catch (error) {
      console.error("Error fetching clubs:", error);
    } 
    finally {
      setIsLoading(false);
    }
  } 
  fetchClubs();
}, [schoolId, searchQuery, page, isInitialized]); // Remove 'user' from dependencies since we're not using it

  useEffect(() => {
    updateDisplayedClubs();
  }, [searchQuery, sortBy, clubs, filterBy]);

  const updateDisplayedClubs = () => {
    let results = [...clubs];

    // Filter by search query
    if (searchQuery) {
      results = results.filter(
        (club) =>
          club.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          club.categoryName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          club.tags?.some((tag) =>
            tag.toLowerCase().includes(searchQuery.toLowerCase())
          )
      );
    }

    // Filter by category
    results = results.filter((club) => {
      if (filterBy === "all") return true;
      return club.categoryName.toLowerCase() === filterBy.toLowerCase();
    })

    // Sort clubs
    results.sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name);
        case "rating":
          return b.averageRating - a.averageRating;
        case "reviews":
          return b.reviewCount - a.reviewCount;
        case "bookmarked":
          return (b.isBookmarked ? 1 : 0) - (a.isBookmarked ? 1 : 0);
        default:
          return 0;
      }
    });

    setFilteredClubs(results);
  };

  const handleSort = (value) => {
    setSortBy(value);
  };

  const handleFilter = (category) => {
    setFilterBy(category);
  }

  if (isLoading || !isInitialized || !university) { 
    return (
      <div className="h-[calc(100vh-4rem)] bg-gradient-to-br from-blue-50 to-white flex items-center justify-center">
        <div className="flex items-center space-x-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          <p className="font-bold text-xl">Now Loading..</p>
        </div>
      </div>
    ); 
  }

  // if (!university) {
  //   return <div className="text-center py-8">University not found</div>;
  // }

  const categories = ["all", ...new Set(clubs.map(club => club.categoryName.toLowerCase()))];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* School Header */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 border border-blue-100">
          <div className="flex flex-col lg:flex-row items-center lg:items-start gap-6">
            {/* School Logo */}
            <img
              src={"https://www.texastech.edu/universities/ttu-campus-2022.jpg"}
              alt={`${university.name} logo`}
              className="w-32 h-32 rounded-full border-4 border-blue-100"
            />

            {/* School Info */}
            <div className="flex-1 text-center lg:text-left">
              <h1 className="text-2xl md:text-3xl xl:text-4xl font-bold text-gray-900 mb-2">{university.name}</h1>
              <div className="flex flex-wrap justify-center lg:justify-start gap-4 text-gray-600 mb-4">
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  <span>{university.location}</span>
                </div>
              </div>
              <p className="text-gray-700 mb-6 max-w-2xl">{university.description}</p>

              {/* Stats */}
              <div className="flex flex-wrap justify-center lg:justify-start gap-6 mb-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{university.clubsCount}</div>
                  <div className="text-sm text-gray-600">Active Clubs</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{clubs.reduce((s, e) => s + e.reviewCount, 0)}</div>
                  <div className="text-sm text-gray-600">Total Reviews</div>
                </div>
              </div>
            </div>            
            {/* Action Button */}
            {user && user.roles.includes("Administrator") &&
              <div className="flex items-center gap-2">
                <Button 
                  className="flex items-center gap-2 px-6 py-3 border-2 border-blue-200 text-blue-600 hover:bg-blue-50 hover:border-blue-300 rounded-xl transition-all duration-200 hover:scale-105 font-semibold bg-transparent"
                  title="Edit University" 
                  onClick = {() => {
                    router.push(`http://localhost:3000/admin/school/${schoolId}/edit`);
                  }}
                >Edit
                  <Pencil className="w-4 h-4" />
                </Button>
                <Button 
                  className="flex items-center gap-2 px-6 py-3 border-2 border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 rounded-xl transition-all duration-200 hover:scale-105 font-semibold bg-transparent"
                  title="Delete University"
                  onClick={() => {
                      setUniversityToDelete(schoolId);
                      setIsDeleteOpen(true);
                  }}
                >Delete
                  <Trash2 className="w-4 h-4" />
                </Button>           
              </div>
            } 
          </div>
        </div>

        {/* Can't Find Your Club Section */}
        {user && !user.roles.includes("Administrator") && 
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-6 mb-8 text-white text-center">
            <h2 className="text-xl md:text-2xl font-bold mb-2">Can't find your club?</h2>
            <p className="text-blue-100 mb-4">Add yours today and help other students discover your community!</p>
            <Button className="bg-white text-blue-600 hover:bg-gray-100 px-6 py-3 rounded-xl font-semibold"
            onClick={(e) => {
                e.preventDefault();
                if (user) {
                  router.push(`/school/${schoolId}/club/request/club-request`);
                } 
                else {
                  setIsModalOpen(true);
                }
              }}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Your Club
            </Button>
            <LoginModal 
              isOpen={isModalOpen} 
              onClose={() => setIsModalOpen(false)} 
            />
          </div>
        }

        {/* Search and Filters */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-blue-100">
          <div className="flex flex-col lg:flex-row gap-4 items-center mb-4">
            {/* Search Bar */}
            <div className="relative flex-1 w-full lg:w-auto">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="text"
                placeholder="Search clubs by name, description, or tags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 py-3 text-sm md:text-md xl:text-lg  border-2 border-gray-200 focus:border-blue-500 rounded-xl w-full"
              />
            </div>

            {/* Sort By */}
            <div className="flex items-center gap-2 w-full lg:w-auto">
              <span className="text-sm font-medium text-gray-700 whitespace-nowrap">Sort by:</span>
              <Select value={sortBy} onValueChange={handleSort}>
                <SelectTrigger className="w-full lg:w-48 border-2 border-gray-200 rounded-xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">Club Name</SelectItem>
                  <SelectItem value="rating">Highest Rated</SelectItem>
                  <SelectItem value="reviews">Most Reviews</SelectItem>
                  <SelectItem value="bookmarked">Bookmarked</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Category Filters */}
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button
                key={category}
                variant={filterBy === category ? "default" : "outline"}
                onClick={() => handleFilter(category)}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                  filterBy === category
                    ? "bg-blue-600 text-white hover:bg-blue-700"
                    : "border-blue-200 text-blue-600 hover:bg-blue-50"
                }`}
              >
                {category === "all" ? "All Categories" : category.charAt(0).toUpperCase() + category.slice(1)}
              </Button>
            ))}
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            Showing {filteredClubs.length} of {clubs.length} clubs
          </p>
        </div>

        {/* Clubs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {filteredClubs.map((club) => (
            <Link key={club.id} href={`/school/1/club/${club.id}`} className="group">
              <div className="bg-white rounded-2xl shadow-lg border border-blue-100 p-6 hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                {/* Club Header */}
                <div className="mb-4">
                  <div className="flex justify-between items-start mb-2">
                    <Badge variant="secondary" className="bg-blue-100 text-blue-800 text-xs">
                      {club.categoryName}
                    </Badge>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1 text-yellow-500">
                        <Star className="w-4 h-4 fill-current" />
                        <span className="text-sm font-medium text-gray-700">{club.averageRating}</span>
                      </div>
                      <Heart
                        className={`w-5 h-5 p-0.5 transition-all group-hover/heart:scale-110 cursor-pointer ${
                          club.isBookmarked 
                            ? "text-red-500 fill-red-500" 
                            : "text-red-500 hover:fill-red-500"
                        }`} 
                      />
                    </div>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-1">
                    {club.name}
                  </h3>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">{club.description}</p>
                </div>

                {/* Club Stats */}
                <div className="flex justify-between items-center mb-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4" />
                    <span>{club.reviewCount} reviews</span>
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1">
                  {club.tags.slice(0, 3).map((tag, index) => (
                    <Badge key={index} variant="outline" className="text-xs border-blue-200 text-blue-600">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Load More Button */}
        {clubs.length > 0 &&
          <div className="text-center">
            <PageNav current={page} total={totalPages} onChange={setPage} />
          </div>
        }
      </div>
      {isDeleteOpen &&
            
        <DeleteModal 
          isOpen={isDeleteOpen}
          onClose={() => setIsDeleteOpen(false)}
          modalText = "University"
          onDelete={async () => {
            if(!universityToDelete){
              return;
            }
            try{
              const currentUser = auth.currentUser;
              const idToken = await currentUser.getIdToken();
              const response = await fetch(`http://localhost:5095/api/AdminUniversity/${universityToDelete}`, {
                method: "DELETE",
                headers: {
                  "Authorization": `Bearer ${idToken}`
                }
              });
              if(response.ok){
                 toast.success("University deleted successfully!", {
                  duration: 5000, // 5 seconds
                });
              }
            }
            catch(error){
              console.error(error);
              toast.error(errorData.message || "Deletion failed. Please try again.");
            }
            finally {
              setIsDeleteOpen(false);
              setUniversityToDelete(null);
              router.push("/all-schools");
            }
          }}
        />
      }
    </div>
    
  )
}
