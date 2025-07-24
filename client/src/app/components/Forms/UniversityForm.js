"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Plus, Info, GraduationCap } from "lucide-react"
import Link from "next/link"

export default function UniversityForm({ universityData, setUniversityData, handleSubmit, submitLabel = "Submit" }) {

  const handleInputChange = (field, value) => {
    setUniversityData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Information */}
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-blue-100">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">University Information</h2>
        <div className="space-y-6">
            {/* University Name */}
            <div>
            <Label htmlFor="name" className="text-sm font-medium text-gray-700 mb-2 block">
                University Name <span className="text-red-500">*</span>
            </Label>
            <Input
                id="name"
                type="text"
                placeholder="Enter the full official name of the university..."
                value={universityData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
                required
            />
            </div>
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
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors mb-8"
                required
            />
            </div>
            {/* LOGO URL */}
            <div>
            <Label htmlFor="logoUrl" className="text-sm font-medium text-gray-700 mb-2 block">
                Logo Url <span className="text-red-500">*</span>
            </Label>
            <Input
                id="logoUrl"
                type="text"
                placeholder="Paste Logo URL here..."
                value={universityData.logoUrl}
                onChange={(e) => handleInputChange("logoUrl", e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors mb-8"
                required
            />
            </div>
            {/* Description */}
            <div>
            <Label htmlFor="description" className="text-sm font-medium text-gray-700 mb-2 block">
                Description <span className="text-red-500">*</span>
            </Label>
            <Input
                id="description"
                type="text"
                placeholder="Description..."
                value={universityData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors mb-8"
                required
            />
            </div>
            {/* Official Website */}
            <div>
            <Label htmlFor="officialWebsite" className="text-sm font-medium text-gray-700 mb-2 block">
                Official Website <span className="text-red-500">*</span>
            </Label>
            <Input
                id="officialWebsite"
                type="text"
                placeholder="Official Website of the University..."
                value={universityData.officialWebsite}
                onChange={(e) => handleInputChange("officialWebsite", e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors mb-8"
                required
            />
            </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <div className="flex gap-3">
                <Button
                    type="button"
                    variant="outline"
                    className="border-2 border-gray-200 text-gray-600 hover:bg-gray-50 px-6 py-3 rounded-xl font-semibold bg-transparent"
                    asChild
                >
                    <Link href="/all-schools">Cancel</Link>
                </Button>
                <Button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-semibold"
                >
                    <Plus className="w-4 h-4 mr-2" />
                    Submit
                </Button>
                </div>
            </div>
        </div>
    </form>
  )
}
