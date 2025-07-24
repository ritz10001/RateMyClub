"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Plus, Info, University } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"

export default function RequestClubPage({ params }) {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [clubData, setClubData] = useState({
    clubName: "",
    description: "",
    categoryId: 0,
    additionalInfo: "",
    meetingLocation: "",
    universityId: 0
  })

  const handleInputChange = (field, value) => {
    setClubData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // TODO: Implement club request submission
    console.log("Club request submitted:", clubData)
  }

  useEffect(() => {
  fetch('http://localhost:5095/api/Categories')
    .then(res => res.json())
    .then(data => {
      console.log(data);
      setCategories(data);
      setIsLoading(false);
    });
}, []);

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
      <div className="max-w-3xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <Link
            href={`/school/1`}
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to University
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Request a New Club</h1>
          <p className="text-gray-600">
            Can't find your club? Help us expand our directory by requesting to add your club.
          </p>
        </div>

        {/* Information Banner */}
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6 mb-8">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-blue-800">
              <p className="font-semibold mb-2">Before you submit:</p>
              <ul className="space-y-1 list-disc list-inside">
                <li>Make sure your club isn't already listed</li>
                <li>Provide accurate and complete information</li>
                <li>Your request will be reviewed by our team within 2-3 business days</li>
                <li>You'll receive an email confirmation once your club is approved</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Request Form */}
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-blue-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Basic Information</h2>
            <div className="space-y-6">
              {/* Club Name */}
              <div>
                <Label htmlFor="clubName" className="text-sm font-medium text-gray-700 mb-2 block">
                  Club Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="clubName"
                  type="text"
                  placeholder="Enter the full name of your club..."
                  value={clubData.clubName}
                  onChange={(e) => handleInputChange("clubName", e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
                  required
                />
              </div>

              {/* Category */}
              <div>
                <Label htmlFor="category" className="text-sm font-medium text-gray-700 mb-2 block">
                  Category <span className="text-red-500">*</span>
                </Label>
                <Select value={clubData.category} onValueChange={(value) => handleInputChange("category", value)}>
                  <SelectTrigger className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500">
                    <SelectValue placeholder="Select a category for your club..." />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category, idx) => (
                      <SelectItem key={idx} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Short Description */}
              <div>
                <Label htmlFor="shortDescription" className="text-sm font-medium text-gray-700 mb-2 block">
                  Short Description <span className="text-gray-400">(Optional)</span>
                </Label>
                <Textarea
                  id="shortDescription"
                  placeholder="Provide a brief description of what your club does..."
                  value={clubData.shortDescription}
                  onChange={(e) => handleInputChange("shortDescription", e.target.value)}
                  className="min-h-24 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Additional Details */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-blue-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Additional Details</h2>
            <div className="space-y-6">
              {/* Contact Email */}
              {/* <div>
                <Label htmlFor="contactEmail" className="text-sm font-medium text-gray-700 mb-2 block">
                  Contact Email <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="contactEmail"
                  type="email"
                  placeholder="Club officer or contact person's email..."
                  value={clubData.contactEmail}
                  onChange={(e) => handleInputChange("contactEmail", e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
                  required
                />
              </div> */}

              {/* Meeting Location */}
              <div>
                <Label htmlFor="meetingLocation" className="text-sm font-medium text-gray-700 mb-2 block">
                  Meeting Location <span className="text-gray-400">(Optional)</span>
                </Label>
                <Input
                  id="meetingLocation"
                  type="text"
                  placeholder="Where does your club typically meet?"
                  value={clubData.meetingLocation}
                  onChange={(e) => handleInputChange("meetingLocation", e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
                />
              </div>

              {/* Additional Information */}
              {/* <div>
                <Label htmlFor="additionalInfo" className="text-sm font-medium text-gray-700 mb-2 block">
                  Additional Information <span className="text-gray-400">(Optional)</span>
                </Label>
                <Textarea
                  id="additionalInfo"
                  placeholder="Any additional information that would help us understand your club better..."
                  value={clubData.additionalInfo}
                  onChange={(e) => handleInputChange("additionalInfo", e.target.value)}
                  className="min-h-32 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
                />
              </div> */}
            </div>
          </div>

          {/* Review Process Information */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-6 text-white">
            <h3 className="text-xl font-bold mb-3">What happens next?</h3>
            <div className="space-y-2 text-blue-100">
              <p>• Our team will review your club request within 2-3 business days</p>
              <p>• We may reach out for additional information if needed</p>
              <p>• Once approved, your club will be added to the directory</p>
              <p>• You'll receive an email confirmation with next steps</p>
            </div>
          </div>

          {/* Submit Section */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-blue-100">
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
              <div className="text-sm text-gray-600">
                <p>By submitting this request, you confirm that the information provided is accurate.</p>
              </div>
              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  className="border-2 border-gray-200 text-gray-600 hover:bg-gray-50 px-6 py-3 rounded-xl font-semibold bg-transparent"
                  asChild
                >
                  <Link href={`/school/${params.id}`}>Cancel</Link>
                </Button>
                <Button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-semibold"
                  disabled={!clubData.clubName || !clubData.category || !clubData.contactEmail}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Submit Request
                </Button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
