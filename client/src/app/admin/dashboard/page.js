"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Check, X, Eye, Clock, GraduationCap, Users } from "lucide-react"
import { useState } from "react"

// Mock data for university requests
const mockUniversityRequests = [
  {
    id: 1,
    universityName: "Texas Tech University",
    requestedBy: "john.doe@email.com",
    submitterName: "John Doe",
    location: "Lubbock, TX",
    schoolType: "Public University",
    website: "https://www.ttu.edu",
    submittedDate: "2024-01-15",
    status: "pending",
  },
  {
    id: 2,
    universityName: "University of Houston",
    requestedBy: "sarah.smith@email.com",
    submitterName: "Sarah Smith",
    location: "Houston, TX",
    schoolType: "Public University",
    website: "https://www.uh.edu",
    submittedDate: "2024-01-14",
    status: "pending",
  },
  {
    id: 3,
    universityName: "Rice University",
    requestedBy: "mike.johnson@email.com",
    submitterName: "Mike Johnson",
    location: "Houston, TX",
    schoolType: "Private University",
    website: "https://www.rice.edu",
    submittedDate: "2024-01-12",
    status: "pending",
  },
]

// Mock data for club requests
const mockClubRequests = [
  {
    id: 1,
    clubName: "AI Research Club",
    requestedBy: "alice.wilson@email.com",
    submitterName: "Alice Wilson",
    university: "Texas Tech University",
    category: "Engineering",
    description: "Exploring artificial intelligence and machine learning research",
    submittedDate: "2024-01-16",
    status: "pending",
  },
  {
    id: 2,
    clubName: "Debate Society",
    requestedBy: "bob.brown@email.com",
    submitterName: "Bob Brown",
    university: "University of Houston",
    category: "Academic",
    description: "Competitive debate and public speaking club",
    submittedDate: "2024-01-15",
    status: "pending",
  },
  {
    id: 3,
    clubName: "Sustainability Initiative",
    requestedBy: "emma.davis@email.com",
    submitterName: "Emma Davis",
    university: "Rice University",
    category: "Service",
    description: "Promoting environmental awareness and sustainable practices",
    submittedDate: "2024-01-13",
    status: "pending",
  },
  {
    id: 4,
    clubName: "Gaming Club",
    requestedBy: "chris.lee@email.com",
    submitterName: "Chris Lee",
    university: "Texas Tech University",
    category: "Recreation",
    description: "Video game tournaments and gaming community",
    submittedDate: "2024-01-11",
    status: "pending",
  },
]

export default function AdminRequestsPage() {
  const [universityRequests, setUniversityRequests] = useState(mockUniversityRequests)
  const [clubRequests, setClubRequests] = useState(mockClubRequests)

  const handleUniversityAction = (id, action) => {
    setUniversityRequests((prev) =>
      prev.map((request) => (request.id === id ? { ...request, status: action } : request)),
    )
    // TODO: Implement actual approval/rejection logic
    console.log(`University request ${id} ${action}`)
  }

  const handleClubAction = (id, action) => {
    setClubRequests((prev) => prev.map((request) => (request.id === id ? { ...request, status: action } : request)))
    // TODO: Implement actual approval/rejection logic
    console.log(`Club request ${id} ${action}`)
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>
      case "approved":
        return <Badge className="bg-green-100 text-green-800">Approved</Badge>
      case "rejected":
        return <Badge className="bg-red-100 text-red-800">Rejected</Badge>
      default:
        return <Badge className="bg-gray-100 text-gray-800">Unknown</Badge>
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Manage university and club requests</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-blue-100">
            <div className="flex items-center gap-3">
              <GraduationCap className="w-8 h-8 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Pending Universities</p>
                <p className="text-2xl font-bold text-gray-900">
                  {universityRequests.filter((r) => r.status === "pending").length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-blue-100">
            <div className="flex items-center gap-3">
              <Users className="w-8 h-8 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">Pending Clubs</p>
                <p className="text-2xl font-bold text-gray-900">
                  {clubRequests.filter((r) => r.status === "pending").length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-blue-100">
            <div className="flex items-center gap-3">
              <Check className="w-8 h-8 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">Total Approved</p>
                <p className="text-2xl font-bold text-gray-900">
                  {[...universityRequests, ...clubRequests].filter((r) => r.status === "approved").length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-blue-100">
            <div className="flex items-center gap-3">
              <Clock className="w-8 h-8 text-yellow-600" />
              <div>
                <p className="text-sm text-gray-600">Total Requests</p>
                <p className="text-2xl font-bold text-gray-900">{universityRequests.length + clubRequests.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* University Requests Table */}
        <div className="bg-white rounded-2xl shadow-lg mb-8 border border-blue-100">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <GraduationCap className="w-6 h-6 text-blue-600" />
              University Requests
            </h2>
          </div>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>University Name</TableHead>
                  <TableHead>Requested By</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>School Type</TableHead>
                  <TableHead>Submitted</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {universityRequests.map((request) => (
                  <TableRow key={request.id}>
                    <TableCell className="font-medium">{request.universityName}</TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{request.submitterName}</p>
                        <p className="text-sm text-gray-600">{request.requestedBy}</p>
                      </div>
                    </TableCell>
                    <TableCell>{request.location}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="border-blue-200 text-blue-600">
                        {request.schoolType}
                      </Badge>
                    </TableCell>
                    <TableCell>{new Date(request.submittedDate).toLocaleDateString()}</TableCell>
                    <TableCell>{getStatusBadge(request.status)}</TableCell>
                    <TableCell>
                      {request.status === "pending" ? (
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={() => handleUniversityAction(request.id, "approved")}
                            className="bg-green-600 hover:bg-green-700 text-white p-2 rounded-lg"
                          >
                            <Check className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleUniversityAction(request.id, "rejected")}
                            className="border-red-200 text-red-600 hover:bg-red-50 p-2 rounded-lg"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-blue-200 text-blue-600 hover:bg-blue-50 p-2 rounded-lg bg-transparent"
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                        </div>
                      ) : (
                        <span className="text-sm text-gray-500">Processed</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Club Requests Table */}
        <div className="bg-white rounded-2xl shadow-lg border border-blue-100">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Users className="w-6 h-6 text-green-600" />
              Club Requests
            </h2>
          </div>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Club Name</TableHead>
                  <TableHead>Requested By</TableHead>
                  <TableHead>University</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Submitted</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {clubRequests.map((request) => (
                  <TableRow key={request.id}>
                    <TableCell className="font-medium">{request.clubName}</TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{request.submitterName}</p>
                        <p className="text-sm text-gray-600">{request.requestedBy}</p>
                      </div>
                    </TableCell>
                    <TableCell>{request.university}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="border-green-200 text-green-600">
                        {request.category}
                      </Badge>
                    </TableCell>
                    <TableCell>{new Date(request.submittedDate).toLocaleDateString()}</TableCell>
                    <TableCell>{getStatusBadge(request.status)}</TableCell>
                    <TableCell>
                      {request.status === "pending" ? (
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={() => handleClubAction(request.id, "approved")}
                            className="bg-green-600 hover:bg-green-700 text-white p-2 rounded-lg"
                          >
                            <Check className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleClubAction(request.id, "rejected")}
                            className="border-red-200 text-red-600 hover:bg-red-50 p-2 rounded-lg"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-blue-200 text-blue-600 hover:bg-blue-50 p-2 rounded-lg bg-transparent"
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                        </div>
                      ) : (
                        <span className="text-sm text-gray-500">Processed</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  )
}
