"use client"

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Plus, Users, Building } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import PageNav from "../components/PageNav";
import LoginModal from "../components/login-modal";
import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/navigation";
import { useDebounce } from 'use-debounce';

export default function DirectoryPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [filteredSchools, setFilteredSchools] = useState([]);
  const [schools, setSchools] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(6);
  const [totalPages, setTotalPages] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user, isInitialized } = useAuth();
  const [debouncedSearchQuery] = useDebounce(searchQuery, 700);
  const router = useRouter();
  useEffect(() => {
  const fetchSchools = async () => {
    try{
      const effectivePage = searchQuery ? 1 : page;
      const response = await fetch(`http://localhost:5095/api/University/paged?page=${effectivePage}&pageSize=${pageSize}&search=${searchQuery}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })
      if(response.ok){
        const data = await response.json();
        console.log("Fetched schools:", data);
        setSchools(data.data);
        setFilteredSchools(data.data);
        setTotalPages(Math.ceil(data.total / pageSize));
      }
      else{
        console.log("Failed to fetch schools");

      }
    }
    catch (error) {
      console.error("Error fetching schools:", error);
    }
    finally {
      setIsLoading(false);
    }
  }
  fetchSchools();
}, [debouncedSearchQuery, page])

  const updateDisplayedSchools = () => {
    let results = [...schools]
    
    // Sort
    results.sort((a, b) => {
      switch (sortBy) {
        case "name": return a.name.localeCompare(b.name)
        case "reviews": return b.reviewCount - a.reviewCount
        case "clubs": return b.clubsCount - a.clubsCount
        default: return 0
      }
    })
    
    setFilteredSchools(results)
  }

  useEffect(() => {
    updateDisplayedSchools()
  }, [debouncedSearchQuery, sortBy, schools])

  // Handler for sort select
  const handleSort = (value) => {
    setSortBy(value)
  }
  if(isLoading){
    return(
      <div className="fixed inset-0 bg-white dark:bg-black z-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
          <p className="text-gray-600 dark:text-white text-lg font-medium">Loading...</p>
        </div>
      </div>
    )
  }
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white dark:from-zinc-950 dark:to-zinc-900 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl text-center font-bold text-blue-600 dark:text-blue-400 mb-2">School Directory</h1>
          <p className="text-xl text-center text-gray-600 dark:text-gray-400">Discover colleges and universities</p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-lg p-6 mb-8 border border-blue-100 dark:border-blue-900">
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            {/* Search Bar */}
            <div className="relative flex-1 w-full lg:w-auto">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-5 h-5" />
              <Input
                type="text"
                placeholder="Search schools by name or location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 py-3 text-sm md:text-md xl:text-lg border-2 border-gray-200 dark:border-zinc-700 focus:border-blue-500 rounded-xl w-full bg-white dark:bg-zinc-800 text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400"
              />
            </div>

            {/* Sort By */}
            <div className="flex items-center gap-2 w-full lg:w-auto">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap">Sort by:</span>
              <Select value={sortBy} onValueChange={handleSort}>
                <SelectTrigger className="w-full lg:w-48 border-2 border-gray-200 dark:border-zinc-700 rounded-xl bg-white dark:bg-zinc-800 text-gray-900 dark:text-gray-100">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-zinc-800 border-zinc-700">
                  <SelectItem value="name" className="text-gray-900 dark:text-gray-100">School Name</SelectItem>
                  <SelectItem value="reviews" className="text-gray-900 dark:text-gray-100">Most Reviews</SelectItem>
                  <SelectItem value="clubs" className="text-gray-900 dark:text-gray-100">Most Clubs</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Add School Button */}
            <Button className="bg-blue-600 dark:bg-blue-700 hover:bg-blue-700 dark:hover:bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold whitespace-nowrap w-full lg:w-auto"
              onClick={(e) => {
                e.preventDefault();
                if (user) {
                  router.push(`/school/request/university-request`);
                } 
                else {
                  setIsModalOpen(true);
                }
              }}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add School
            </Button>
            <LoginModal 
              isOpen={isModalOpen} 
              onClose={() => setIsModalOpen(false)} 
            />
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600 dark:text-gray-400">
            Showing {filteredSchools.length} schools
          </p>
        </div>

        {/* School Grid */}
        <div className="rounded-xl grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-8">
          {filteredSchools.map((school) => (
            <Link key={school.id} href={`/school/${school.id}`} className="group">
              <div className="bg-white dark:bg-zinc-900 rounded-md shadow-lg border border-blue-100 dark:border-blue-900 pb-6 hover:shadow-xl transition-all duration-300 group-hover:scale-105 overflow-hidden">
                {/* School Logo */}
                <div className="flex justify-center mb-4 h-55">
                  <img
                    // src={school.logoUrl} 
                    src={"/generic.jpeg"}
                    alt={`${school.name} logo`}
                    className="h-full w-full"
                  />
                </div>

                {/* School Info */}
                <div className="text-center">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-1">
                      {school.name}
                    </h3>
                  </div>
                  
                  <p className="text-gray-600 dark:text-gray-400 mb-4">{school.location}</p>

                  {/* Stats */}
                  <div className="flex justify-center gap-6 text-sm">
                    <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                      <Users className="w-4 h-4" />
                      <span>{school.reviewCount} reviews</span>
                    </div>
                    <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                      <Building className="w-4 h-4" />
                      <span>{school.clubsCount} clubs</span>
                    </div>
                  </div>
                </div>

                {/* Club Count Badge */}
                <div className="mt-4 text-center">
                  <span className="inline-block bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-full text-sm font-semibold">
                    {school.clubsCount} Active Clubs
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
          
        {/* Load More Button */}
        <div className="text-center">
          <PageNav current={page} total={totalPages} onChange={setPage} />
        </div>
      </div>
    </div>
  )
}
