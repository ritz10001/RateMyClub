"use client"

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Plus, Info, GraduationCap } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useAuth } from "@/app/context/AuthContext"
import { toast } from 'sonner';
import { useRouter } from "next/navigation";
import { getAuth } from "firebase/auth";
import { app } from "@/app/utils/firebase";
import AuthRoute from "@/app/components/AuthRoute";

export default function RequestUniversityPage(){
  const redirectPath = `/all-schools`;
  return(
    <AuthRoute redirectTo={redirectPath}>
      <RequestUniversityContent />
    </AuthRoute>
  );
}
function RequestUniversityContent() {
  const { user } = useAuth();
  const auth = getAuth(app);
  console.log("User data:", user);
  const router = useRouter();
  const [universityData, setUniversityData] = useState({
    fullName: user?.firstName ? `${user.firstName} ${user.lastName}` : "",
    requestedBy: user?.email || "",
    universityName: "",
    location: "",
    officialWebsite: "",
    additionalInfo: "",
  })

  const handleInputChange = (field, value) => {
    setUniversityData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      console.log("UNIVERSITY DATA");
      console.log(universityData);
      const currentUser = auth.currentUser;
      const idToken = await currentUser.getIdToken();
      const response = await fetch("http://localhost:5095/api/UniversityRequest", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${idToken}`
        },
        body: JSON.stringify({
          fullName: universityData.fullName,
          requestedBy: universityData.requestedBy,
          universityName: universityData.universityName,
          location: universityData.location,
          officialWebsite: universityData.officialWebsite,
          additionalInfo: universityData.additionalInfo,
        })
      })
      if(response.ok){
        const requestResponse = await response.json();
        console.log(requestResponse);
        toast.success("University request submitted! We'll review it shortly.", {
          duration: 5000, // 5 seconds
        });
        router.push("/all-schools");
      }
      else{
        const errorData = await response.json();
        toast.error(errorData.message || "Submission failed. Please try again.");
      }
    }
    catch(error){
      toast.error("Network error. Please check your connection.");
      console.error("Club request submission failed");
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white py-8">
      <div className="max-w-3xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/all-schools"
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Directory
          </Link>
          <div className="flex items-center gap-3 mb-2">
            <GraduationCap className="w-8 h-8 text-blue-600" />
            <h1 className="text-4xl font-bold text-gray-900">Request a New University</h1>
          </div>
          <p className="text-gray-600">
            Can't find your school? Help us expand our directory by requesting to add your university.
          </p>
        </div>

        {/* Information Banner */}
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6 mb-8">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-blue-800">
              <p className="font-semibold mb-2">Before you submit:</p>
              <ul className="space-y-1 list-disc list-inside">
                <li>Make sure your university isn't already listed in our directory</li>
                <li>Provide accurate and complete information</li>
                <li>Your request will be reviewed by our team within 3-5 business days</li>
                <li>You'll receive an email confirmation once your university is approved</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Request Form */}
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-blue-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">University Information</h2>
            <div className="space-y-6">
              {/* University Name */}
              <div>
                <Label htmlFor="universityName" className="text-sm font-medium text-gray-700 mb-2 block">
                  University Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="universityName"
                  type="text"
                  placeholder="Enter the full official name of the university..."
                  value={universityData.universityName}
                  onChange={(e) => handleInputChange("universityName", e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
                  required
                />
              </div>

              {/* School Type */}
              {/* <div>
                <Label htmlFor="schoolType" className="text-sm font-medium text-gray-700 mb-2 block">
                  School Type <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={universityData.universityType}
                  onValueChange={(value) => handleInputChange("universityType", Number(value))}
                >
                  <SelectTrigger className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500">
                    <SelectValue placeholder="Select the type of institution..." />
                  </SelectTrigger>
                  <SelectContent>
                    {schoolTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div> */}

              {/* Location */}
              <div>
                <Label htmlFor="location" className="text-sm font-medium text-gray-700 mb-2 block">
                  Location <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="location"
                  type="text"
                  placeholder="City, State (e.g., Austin, TX)"
                  value={universityData.location}
                  onChange={(e) => handleInputChange("location", e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
                  required
                />
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-blue-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Contact & Additional Details</h2>
            <div className="space-y-6">
              {/* Website */}
              <div>
                <Label htmlFor="officialWebsite" className="text-sm font-medium text-gray-700 mb-2 block">
                  Official Website <span className="text-gray-400">(Optional)</span>
                </Label>
                <Input
                  id="officialWebsite"
                  type="url"
                  placeholder="https://www.university.edu"
                  value={universityData.officialWebsite}
                  onChange={(e) => handleInputChange("officialWebsite", e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
                />
              </div>
              {/* Additional Information */}
              <div>
                <Label htmlFor="additionalInfo" className="text-sm font-medium text-gray-700 mb-2 block">
                  Additional Information <span className="text-gray-400">(Optional)</span>
                </Label>
                <Textarea
                  id="additionalInfo"
                  placeholder="Any additional information about the university that would be helpful (student population, notable programs, etc.)..."
                  value={universityData.additionalInfo}
                  onChange={(e) => handleInputChange("additionalInfo", e.target.value)}
                  className="min-h-32 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Review Process Information */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-6 text-white">
            <h3 className="text-xl font-bold mb-3">What happens next?</h3>
            <div className="space-y-2 text-blue-100">
              <p>• Our team will verify the university information within 3-5 business days</p>
              <p>• We may reach out for additional verification if needed</p>
              <p>• Once approved, the university will be added to our directory</p>
              <p>• Students can then start adding clubs and writing reviews</p>
              <p>• You'll receive an email confirmation with the university's new page link</p>
            </div>
          </div>

          {/* Submit Section */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-blue-100">
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
              <div className="text-sm text-gray-600">
                <p>By submitting this request, you confirm that the information provided is accurate and complete.</p>
              </div>
              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  className="border-2 border-gray-200 text-gray-600 hover:bg-gray-50 px-6 py-3 rounded-xl font-semibold bg-transparent"
                  asChild
                >
                  <Link href="/directory">Cancel</Link>
                </Button>
                <Button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-semibold"
                  disabled={
                    !universityData.universityName || !universityData.location
                  }
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
