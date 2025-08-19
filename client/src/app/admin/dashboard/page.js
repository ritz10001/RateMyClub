"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Check, X, Eye, Clock, GraduationCap, Users } from "lucide-react"
import { useState, useEffect } from "react"
import { useAuth } from "@/app/context/AuthContext"
import { toast } from "sonner"
import { api } from "@/app/utils/axios"
import { getAuth } from "firebase/auth"
import { app } from "@/app/utils/firebase"

const ConfirmationModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  type, // 'approve' | 'reject'
  requestType, // 'university' | 'club'
  requestName,
  rejectionReason,
  setRejectionReason,
  logoUrl,
  setLogoUrl,
  universityData,
  setUniversityData,
  clubData,
  setClubData,
  clubRequests,
  modalState,
  isProcessing
}) => {
  if (!isOpen) return null;

  const isReject = type === 'reject';
  const isApprove = type === 'approve';
  const isUniversityApproval = isApprove && requestType === 'university';
  const isClubApproval = isApprove && requestType === "club";
  const title = isReject ? 'Reject Request' : 'Approve Request';
  const message = `Are you sure you want to ${type} the ${requestType} "${requestName}"?`;

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 overflow-y-auto py-4 dark:bg-black/50">
      <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto dark:bg-zinc-800 dark:shadow-2xl">
        <h3 className="text-xl font-bold text-gray-900 mb-4 dark:text-gray-100">{title}</h3>

        <p className="text-gray-600 mb-4 dark:text-gray-400">{message}</p>

        {(type === 'approve') && requestType === 'university' && (
          <div className="mb-4 space-y-4">
            <div className="border-b border-gray-200 pb-2 mb-4 dark:border-zinc-700">
              <h4 className="text-lg font-medium text-gray-900 dark:text-gray-100">University Details</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">Review and edit if needed before {type === 'approve' ? 'approving' : 'rejecting'}</p>
            </div>

            {/* University Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 dark:text-gray-300">
                University Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={universityData?.universityName || ''}
                onChange={(e) => setUniversityData(prev => ({ ...prev, universityName: e.target.value }))}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-zinc-700 dark:border-zinc-600 dark:text-gray-100 dark:focus:ring-blue-400 dark:focus:border-blue-400"
              />
            </div>
            {/* Location */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 dark:text-gray-300">
                Location <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={universityData?.location || ''}
                onChange={(e) => setUniversityData(prev => ({ ...prev, location: e.target.value }))}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-zinc-700 dark:border-zinc-600 dark:text-gray-100 dark:focus:ring-blue-400 dark:focus:border-blue-400"
              />
            </div>
            {/* Official Website */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 dark:text-gray-300">
                Official Website
              </label>
              <input
                type="url"
                value={universityData?.officialWebsite || ''}
                onChange={(e) => setUniversityData(prev => ({ ...prev, officialWebsite: e.target.value }))}
                placeholder="https://university.edu"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-zinc-700 dark:border-zinc-600 dark:text-gray-100 dark:placeholder-gray-400 dark:focus:ring-blue-400 dark:focus:border-blue-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 dark:text-gray-300">
                Description
              </label>
              <textarea
                value={universityData?.description || ''}
                onChange={(e) => setClubData(prev => ({ ...prev, description: e.target.value }))}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-zinc-700 dark:border-zinc-600 dark:text-gray-100 dark:placeholder-gray-400 dark:focus:ring-blue-400 dark:focus:border-blue-400"
                rows={4}
              />
            </div>
            {/* Logo URL for approval only */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 dark:text-gray-300">
                University Logo URL <span className="text-red-500">*</span>
              </label>
              <input
                type="url"
                value={logoUrl}
                onChange={(e) => setLogoUrl(e.target.value)}
                placeholder="https://example.com/logo.png"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-zinc-700 dark:border-zinc-600 dark:text-gray-100 dark:placeholder-gray-400 dark:focus:ring-blue-400 dark:focus:border-blue-400"
              />
              <div className="text-sm text-gray-500 mt-1 dark:text-gray-400">
                Please provide a valid URL for the university logo
              </div>
              {/* Optional: Logo preview */}
              {logoUrl && (
                <div className="mt-3">
                  <p className="text-sm text-gray-600 mb-2 dark:text-gray-400">Logo Preview:</p>
                  <img
                    src={logoUrl}
                    alt="Logo preview"
                    className="w-16 h-16 object-contain border border-gray-200 rounded-lg dark:border-zinc-700"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'block';
                    }}
                  />
                  <div className="text-sm text-red-500 mt-1 hidden">
                    Invalid image URL
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Dealing with clubs now */}
        {(type === 'approve') && requestType === 'club' && (
          <div className="mb-4 space-y-4">
            <div className="border-b border-gray-200 pb-2 mb-4 dark:border-zinc-700">
              <h4 className="text-lg font-medium text-gray-900 dark:text-gray-100">Club Details</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Review and edit name/description if needed
              </p>
            </div>

            {/* Club Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 dark:text-gray-300">
                Club Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={clubData?.name || ''}
                onChange={(e) => setClubData(prev => ({ ...prev, name: e.target.value }))}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-zinc-700 dark:border-zinc-600 dark:text-gray-100 dark:focus:ring-blue-400 dark:focus:border-blue-400"
              />
            </div>

            {/* Club location */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 dark:text-gray-300">
                Club Location <span className="text-red-500">*</span>
              </label>
              <input
                value={clubData?.clubLocation || ''}
                onChange={(e) => setClubData(prev => ({ ...prev, clubLocation: e.target.value }))}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-zinc-700 dark:border-zinc-600 dark:text-gray-100 dark:focus:ring-blue-400 dark:focus:border-blue-400"
                rows={4}
              />
            </div>

            {/* Club Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 dark:text-gray-300">
                Description
              </label>
              <textarea
                value={clubData?.description || ''}
                onChange={(e) => setClubData(prev => ({ ...prev, description: e.target.value }))}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-zinc-700 dark:border-zinc-600 dark:text-gray-100 dark:placeholder-gray-400 dark:focus:ring-blue-400 dark:focus:border-blue-400"
                rows={4}
              />
            </div>

            {/* Read-only fields */}
            <div className="bg-gray-50 p-4 rounded-lg dark:bg-zinc-700">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="font-medium text-gray-500 dark:text-gray-400">University</p>
                  <p className="dark:text-gray-200">{clubRequests.find(c => c.id === modalState.requestId)?.universityName}</p>
                </div>
                <div>
                  <p className="font-medium text-gray-500 dark:text-gray-400">Category</p>
                  <p className="dark:text-gray-200">{clubRequests.find(c => c.id === modalState.requestId)?.category}</p>
                </div>
                <div className="col-span-2">
                  <p className="font-medium text-gray-500 dark:text-gray-400">Tags</p>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {clubRequests.find(c => c.id === modalState.requestId)?.tags.map(tag => (
                      <Badge key={tag.id} variant="outline" className="dark:bg-zinc-900 dark:text-gray-300 dark:border-zinc-600">{tag.name}</Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        {isReject && (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2 dark:text-gray-300">
              Rejection Reason <span className="text-red-500">*</span>
            </label>
            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="Please provide a reason for rejection..."
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none dark:bg-zinc-700 dark:border-zinc-600 dark:text-gray-100 dark:placeholder-gray-400 dark:focus:ring-blue-400 dark:focus:border-blue-400"
              rows={4}
              maxLength={500}
            />
            <div className="text-sm text-gray-500 mt-1 dark:text-gray-400">
              {rejectionReason.length}/500 characters
            </div>
          </div>
        )}

        <div className="flex gap-3 justify-end">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isProcessing}
            className="px-4 py-2 dark:bg-transparent dark:border-zinc-700 dark:text-gray-300 dark:hover:bg-zinc-700"
          >
            Cancel
          </Button>
          <Button
            onClick={onConfirm}
            disabled={
              isProcessing ||
              (isReject && !rejectionReason.trim()) ||
              (isUniversityApproval && (
                !logoUrl.trim() ||
                !universityData.universityName.trim() ||
                !universityData.location.trim()
              )) ||
              (isClubApproval && (
                !clubData.name.trim() ||
                !clubData.clubLocation.trim()
              ))
            }
            className={`px-4 py-2 ${
              isReject
                ? 'bg-red-600 hover:bg-red-700 text-white dark:bg-red-500 dark:hover:bg-red-600'
                : 'bg-green-600 hover:bg-green-700 text-white dark:bg-green-500 dark:hover:bg-green-600'
            }`}
          >
            {isProcessing ? (
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                Processing...
              </div>
            ) : (
              type === 'approve' ? 'Approve' : 'Reject'
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default function AdminRequestsPage() {
  const [universityRequests, setUniversityRequests] = useState([]);
  const [clubRequests, setClubRequests] = useState([]);
  const [isUniversityLoading, setIsUniversityLoading] = useState(true);
  const [isClubLoading, setIsClubLoading] = useState(true);
  const [logoUrl, setLogoUrl] = useState('');
  const [universityData, setUniversityData] = useState({
    universityName: '',
    location: '',
    officialWebsite: '',
    description: ''
  });
  const [clubData, setClubData] = useState({
    name: '',
    description: ''
  });
  const { user, isInitialized } = useAuth();

  // related to modal state
  const [modalState, setModalState] = useState({
    isOpen: false,
    type: null, // 'approve' | 'reject'
    requestType: null, // 'university' | 'club'
    requestId: null,
    requestName: '',
  });
  const [rejectionReason, setRejectionReason] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const auth = getAuth(app);

  useEffect(() => {
    const fetchUniversityRequests = async () => {
      try {
        const currentUser = auth.currentUser;
        const idToken = await currentUser.getIdToken();
        const response = await fetch("http://localhost:5095/api/AdminUniversityRequest", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${idToken}`
          }
        });
        if(response.ok){
          const data = await response.json();
          console.log(data);
          setUniversityRequests(data);
        }
      }
      catch(error){
        toast.error("An error occured while trying to fetch requests.");
      }
      finally {
        setIsUniversityLoading(false);
      }
    }
    if (isInitialized && user) {
      fetchUniversityRequests();
    }
  }, [user, isInitialized])

  useEffect(() => {
    const fetchClubRequests = async () => {
      try {
        const currentUser = auth.currentUser;
        const idToken = await currentUser.getIdToken();
        const response = await fetch("http://localhost:5095/api/AdminClubRequest", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${idToken}`
          }
        });
        if(response.ok){
          const data = await response.json();
          console.log("data of clubs", data);
          setClubRequests(data); 
        }
      } 
      catch (error) {
        toast.error("An error occurred while trying to fetch club requests.");
      }
      finally {
        setIsClubLoading(false);
      }
    };

    if (isInitialized && user) {
      fetchClubRequests();
    }
  }, [user, isInitialized]);

  const openModal = (type, requestType, requestId, requestName) => {
    if (requestType === 'university') {
      const request = universityRequests.find(req => req.id === requestId);
      if (request) {
        setUniversityData({
          universityName: request.universityName,
          location: request.location,
          officialWebsite: request.officialWebsite || ''
        });
      }
    } 
    else if (requestType === 'club') {
      const request = clubRequests.find(req => req.id === requestId);
      if (request) {
        setClubData({
          name: request.name,
          description: request.description,
          clubLocation: request.clubLocation,
          universityId: request.universityId,
          categoryId: request.categoryId,
          tagIds: request.tags
        });
      }
    }
    setModalState({
      isOpen: true,
      type,
      requestType,
      requestId,
      requestName
    });
    setRejectionReason(''); // Reset rejection reason
    setLogoUrl('');
  };

  const closeModal = () => {
    if (isProcessing) return; // Prevent closing during processing
    setModalState({
      isOpen: false,
      type: null,
      requestType: null,
      requestId: null,
      requestName: ''
    });
    setRejectionReason('');
    setLogoUrl('');
    setUniversityData({ // Reset university data
      universityName: '',
      location: '',
      officialWebsite: ''
    });
  };

  const handleUniversityAction = async () => {
    setIsProcessing(true);
    const { requestId, type } = modalState;
    try {
      const currentUser = auth.currentUser;
      const idToken = await currentUser.getIdToken();
      if (type === "approve") {
        // STEP 1: Apply admin's changes to the request
        await fetch(`http://localhost:5095/api/AdminUniversityRequest/edit-request/${requestId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${idToken}`
          },
          body: JSON.stringify({
            universityName: universityData.universityName,
            location: universityData.location,
            officialWebsite: universityData.officialWebsite
          })
        });
        // STEP 2: Mark request as approved
        await fetch(`http://localhost:5095/api/AdminUniversityRequest/${requestId}/status`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${idToken}`
          },
          body: JSON.stringify({
            status: 1,
            rejectionReason: null
          })
        });
        // STEP 3: Add final university to DB
        await fetch("http://localhost:5095/api/AdminUniversity", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${idToken}`
          },
          body: JSON.stringify({
            name: universityData.universityName,
            location: universityData.location,
            officialWebsite: universityData.officialWebsite,
            logoUrl: logoUrl
          })
        });
      }
      else if(type === "reject"){ 
        // Only update status with rejection reason
        await fetch(`http://localhost:5095/api/AdminUniversityRequest/${requestId}/status`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${idToken}`
          },
          body: JSON.stringify({
            status: 2, // 2 = Rejected
            rejectionReason: rejectionReason
          })
        });
      }

      setUniversityRequests(prev => prev.filter(req => req.id !== requestId));

      toast.success(
        type === 'approve' 
          ? 'University request approved and university created successfully!' 
          : 'University request rejected successfully!'
      );
      closeModal();
      
    } 
    catch (error) {
      console.error(`Error ${type}ing university request:`, error);
      // Better error handling with axios
      const errorMessage = error.response?.data?.message || error.message || "An unknown error occurred";
      toast.error(`An error occurred while ${type === 'approve' ? 'approving' : 'rejecting'} the request: ${errorMessage}`);
    } 
    finally {
      setIsProcessing(false);
    }
  }

  const handleClubAction = async () => {
    setIsProcessing(true);
    const { requestId, type } = modalState;
    try {
      const currentUser = auth.currentUser;
      const idToken = await currentUser.getIdToken();
      if (type === "approve") {
        // STEP 1: Apply admin's changes to the request
        await fetch(`http://localhost:5095/api/AdminClubRequest/edit-request/${requestId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${idToken}`
          },
          body: JSON.stringify({
            name: clubData.name,
            description: clubData.description,
            clubLocation: clubData.clubLocation
          })
        });
        // STEP 2: Mark request as approved
        await fetch(`http://localhost:5095/api/AdminClubRequest/${requestId}/status`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${idToken}`
          },
          body: JSON.stringify({
            status: 1,  // 1 = Approved
            rejectionReason: null
          })
        });
        // STEP 3: Add final club to DB
        const res = await fetch("http://localhost:5095/api/AdminClub", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${idToken}`
          },
          body: JSON.stringify({
            name: clubData.name,
            description: clubData.description,
            clubLocation: clubData.clubLocation,
            universityId: clubData.universityId,
            categoryId: clubData.categoryId,
            tagIds: clubData.tagIds.map(tag => tag.id)
          })
        });
      }
      else if(type === "reject"){
        // Only update status with rejection reason
        const response = await fetch(`http://localhost:5095/api/AdminClubRequest/${requestId}/status`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${idToken}`
          },
          body: JSON.stringify({
            status: 2, // 2 = Rejected
            rejectionReason: rejectionReason
          })
        });
      }
      setClubRequests(prev => prev.filter(req => req.id !== requestId));
      toast.success(
        type === 'approve' 
          ? 'Club request approved and club created successfully!' 
          : 'Club request rejected successfully!'
      );
      closeModal();
    } 
    catch (error) {
      console.error(`Error ${type}ing club request:`, error);
      toast.error(`An error occurred while ${type === 'approve' ? 'approving' : 'rejecting'} the request: ${error.message}`);
    } 
    finally {
      setIsProcessing(false);
    }
  };

  const handleModalConfirm = () => {
    if (modalState.requestType === 'university') {
      handleUniversityAction();
    } 
    else {
      handleClubAction();
    }
  };

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

  if (isUniversityLoading || isClubLoading) { 
    return (
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
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage university and club requests</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-blue-100 dark:bg-zinc-800 dark:border-zinc-700 dark:shadow-xl">
            <div className="flex items-center gap-3">
              <GraduationCap className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Pending Universities</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {universityRequests.filter((r) => r.status.toLowerCase() === "pending").length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-blue-100 dark:bg-zinc-800 dark:border-zinc-700 dark:shadow-xl">
            <div className="flex items-center gap-3">
              <Users className="w-8 h-8 text-green-600 dark:text-green-400" />
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Pending Clubs</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {clubRequests.filter((r) => r.status.toLowerCase() === "pending").length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-blue-100 dark:bg-zinc-800 dark:border-zinc-700 dark:shadow-xl">
            <div className="flex items-center gap-3">
              <Check className="w-8 h-8 text-green-600 dark:text-green-400" />
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Approved</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {[...universityRequests, ...clubRequests].filter((r) => r.status.toLowerCase() === "approved").length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-blue-100 dark:bg-zinc-800 dark:border-zinc-700 dark:shadow-xl">
            <div className="flex items-center gap-3">
              <Clock className="w-8 h-8 text-yellow-600 dark:text-yellow-400" />
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Requests</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{universityRequests.length + clubRequests.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* University Requests Table */}
        <div className="bg-white rounded-2xl shadow-lg mb-8 border border-blue-100 dark:bg-zinc-800 dark:border-zinc-700">
          <div className="p-6 border-b border-gray-200 dark:border-zinc-700">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
              <GraduationCap className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              University Requests
            </h2>
          </div>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50 dark:bg-zinc-900">
                  <TableHead className="text-gray-600 dark:text-gray-400">University Name</TableHead>
                  <TableHead className="text-gray-600 dark:text-gray-400">Requested By</TableHead>
                  <TableHead className="text-gray-600 dark:text-gray-400">Location</TableHead>
                  <TableHead className="text-gray-600 dark:text-gray-400">Submitted</TableHead>
                  <TableHead className="text-gray-600 dark:text-gray-400">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {universityRequests.map((request) => (
                  <TableRow key={request.id} className="border-b border-gray-200 dark:border-zinc-700 dark:bg-zinc-800 dark:text-gray-300">
                    <TableCell className="font-medium">{request.universityName}</TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{request.fullName}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{request.requestedBy}</p>
                      </div>
                    </TableCell>
                    <TableCell>{request.location}</TableCell>
                    <TableCell>{new Date(request.requestedAt).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => openModal('approve', 'university', request.id, request.universityName)}
                          className="bg-green-600 hover:bg-green-700 text-white p-2 rounded-lg"
                          disabled={isProcessing}
                        >
                          <Check className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => openModal('reject', 'university', request.id, request.universityName)}
                          className="border-red-200 text-red-600 hover:bg-red-50 p-2 rounded-lg dark:border-red-700 dark:text-red-400 dark:hover:bg-red-900"
                          disabled={isProcessing}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Club Requests Table */}
        <div className="bg-white rounded-2xl shadow-lg border border-blue-100 dark:bg-zinc-800 dark:border-zinc-700">
          <div className="p-6 border-b border-gray-200 dark:border-zinc-700">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
              <Users className="w-6 h-6 text-green-600 dark:text-green-400" />
              Club Requests
            </h2>
          </div>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50 dark:bg-zinc-900">
                  <TableHead className="text-gray-600 dark:text-gray-400">Club Name</TableHead>
                  <TableHead className="text-gray-600 dark:text-gray-400">Requested By</TableHead>
                  <TableHead className="text-gray-600 dark:text-gray-400">University</TableHead>
                  <TableHead className="text-gray-600 dark:text-gray-400">Category</TableHead>
                  <TableHead className="text-gray-600 dark:text-gray-400">Tags</TableHead>
                  <TableHead className="text-gray-600 dark:text-gray-400">Submitted</TableHead>
                  <TableHead className="text-gray-600 dark:text-gray-400">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {clubRequests.map((request) => (
                  <TableRow key={request.id} className="border-b border-gray-200 dark:border-zinc-700 dark:bg-zinc-800 dark:text-gray-300">
                    <TableCell className="font-medium">{request.name}</TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{request.fullName}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{request.requestedBy}</p>
                      </div>
                    </TableCell>
                    <TableCell>{request.universityName}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="border-green-200 text-green-600 dark:border-green-700 dark:text-green-400">
                        {request.category}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {request.tags.map((tag, idx) => {
                        return (
                          <div key={idx} className="flex flex-col">
                            <Badge variant="outline" className="border-red-200 text-red-600 dark:border-red-700 dark:text-red-400">
                              {tag.name}
                            </Badge>
                          </div>
                        );
                      })}
                    </TableCell>
                    <TableCell>{new Date(request.requestedAt).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => openModal('approve', 'club', request.id, request.name)}
                          className="bg-green-600 hover:bg-green-700 text-white p-2 rounded-lg"
                          disabled={isProcessing}
                        >
                          <Check className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => openModal('reject', 'club', request.id, request.name)}
                          className="border-red-200 text-red-600 hover:bg-red-50 p-2 rounded-lg dark:border-red-700 dark:text-red-400 dark:hover:bg-red-900"
                          disabled={isProcessing}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
        <ConfirmationModal
          isOpen={modalState.isOpen}
          onClose={closeModal}
          onConfirm={handleModalConfirm}
          type={modalState.type}
          requestType={modalState.requestType}
          requestName={modalState.requestName}
          rejectionReason={rejectionReason}
          setRejectionReason={setRejectionReason}
          logoUrl={logoUrl}
          setLogoUrl={setLogoUrl}
          universityData={universityData}
          setUniversityData={setUniversityData}
          clubData={clubData}
          setClubData={setClubData}
          clubRequests={clubRequests}
          modalState={modalState}
          isProcessing={isProcessing}
        />
      </div>
    </div>
  )
}
