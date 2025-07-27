"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Plus, Users, Building } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"
import PageNav from "../components/PageNav"

export default function DirectoryPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [filteredSchools, setFilteredSchools] = useState([]);
  const [schools, setSchools] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(6);
  const [totalPages, setTotalPages] = useState(1);

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
}, [searchQuery, page])

  const updateDisplayedSchools = () => {
    let results = [...schools]
    
    // Filter
    if (searchQuery) {
      results = results.filter(school =>
        school.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        school.location.toLowerCase().includes(searchQuery.toLowerCase())
    )
    }
    
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
  }, [searchQuery, sortBy, schools])

  // Handler for sort select
  const handleSort = (value) => {
    setSortBy(value)
  }
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl text-center font-bold text-blue-600 mb-2">School Directory</h1>
          <p className="text-xl text-center text-gray-600">Discover colleges and universities</p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-blue-100">
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            {/* Search Bar */}
            <div className="relative flex-1 w-full lg:w-auto">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="text"
                placeholder="Search schools by name or location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 py-3 text-lg border-2 border-gray-200 focus:border-blue-500 rounded-xl w-full"
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
                  <SelectItem value="name">School Name</SelectItem>
                  <SelectItem value="reviews">Most Reviews</SelectItem>
                  <SelectItem value="clubs">Most Clubs</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Add School Button */}
            <Button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold whitespace-nowrap w-full lg:w-auto">
              <Link href="/school/request/university-request" className="flex items-center justify-center">
              <Plus className="w-4 h-4 mr-2" />
              Add School
              </Link>
            </Button>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            Showing {filteredSchools.length} schools
          </p>
        </div>

        {/* School Grid */}
        {isLoading ? (
          <div className="h-[calc(100vh-4rem)] bg-gradient-to-br from-blue-50 to-white flex items-center justify-center">
            <div className="flex items-center space-x-4">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              <p className="font-bold text-xl">Now Loading..</p>
            </div>
          </div>
          ) : 
          <div className="rounded-xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {filteredSchools.map((school) => (
              <Link key={school.id} href={`/school/${school.id}`} className="group">
                <div className="bg-white rounded-md shadow-lg border border-blue-100 pb-6 hover:shadow-xl transition-all duration-300 group-hover:scale-105 overflow-hidden">
                  {/* School Logo */}
                  <div className="flex justify-center mb-4 h-55">
                    <img
                      src={school.logoUrl}
                      alt={`${school.name} logo`}
                      className="h-full w-full"
                    />
                  </div>

                  {/* School Info */}
                  <div className="text-center">
                    <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                      {school.name}
                    </h3>
                    <p className="text-gray-600 mb-4">{school.location}</p>

                    {/* Stats */}
                    <div className="flex justify-center gap-6 text-sm">
                      <div className="flex items-center gap-1 text-gray-600">
                        <Users className="w-4 h-4" />
                        <span>{school.reviewCount} reviews</span>
                      </div>
                      <div className="flex items-center gap-1 text-gray-600">
                        <Building className="w-4 h-4" />
                        <span>{school.clubsCount} clubs</span>
                      </div>
                    </div>
                  </div>

                  {/* Club Count Badge */}
                  <div className="mt-4 text-center">
                    <span className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">
                      {school.clubsCount} Active Clubs
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          }
        {/* Load More Button */}
        <div className="text-center">
          <PageNav current={page} total={totalPages} onChange={setPage} />
        </div>
      </div>
    </div>
  )
}
