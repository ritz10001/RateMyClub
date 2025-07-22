"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Check, X, Eye, Clock, GraduationCap, Users } from "lucide-react"
import { useState, useEffect } from "react"
import { useAuth } from "@/app/context/AuthContext"
import { toast } from "sonner"

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
  isProcessing
}) => {
  if (!isOpen) return null;

  const isReject = type === 'reject';
  const isApprove = type === 'approve';
  const isUniversityApproval = isApprove && requestType === 'university';
  const title = isReject ? 'Reject Request' : 'Approve Request';
  const message = `Are you sure you want to ${type} the ${requestType} "${requestName}"?`;

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md mx-4">
        <h3 className="text-xl font-bold text-gray-900 mb-4">{title}</h3>
        
        <p className="text-gray-600 mb-4">{message}</p>

        {isUniversityApproval && (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              University Logo URL <span className="text-red-500">*</span>
            </label>
            <input
              type="url"
              value={logoUrl}
              onChange={(e) => setLogoUrl(e.target.value)}
              placeholder="https://example.com/logo.png"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <div className="text-sm text-gray-500 mt-1">
              Please provide a valid URL for the university logo
            </div>
            {/* Optional: Logo preview */}
            {logoUrl && (
              <div className="mt-3">
                <p className="text-sm text-gray-600 mb-2">Logo Preview:</p>
                <img 
                  src={logoUrl} 
                  alt="Logo preview" 
                  className="w-16 h-16 object-contain border border-gray-200 rounded-lg"
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
        )}
        
        {isReject && (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Rejection Reason <span className="text-red-500">*</span>
            </label>
            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="Please provide a reason for rejection..."
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
              rows={4}
              maxLength={500}
            />
            <div className="text-sm text-gray-500 mt-1">
              {rejectionReason.length}/500 characters
            </div>
          </div>
        )}
        
        <div className="flex gap-3 justify-end">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isProcessing}
            className="px-4 py-2"
          >
            Cancel
          </Button>
          <Button
            onClick={onConfirm}
            disabled={isProcessing || (isReject && !rejectionReason.trim()) ||
              (isUniversityApproval && !logoUrl.trim())}
            className={`px-4 py-2 ${
              isReject 
                ? 'bg-red-600 hover:bg-red-700 text-white' 
                : 'bg-green-600 hover:bg-green-700 text-white'
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
  const { user } = useAuth();

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

  useEffect(() => {
    const fetchUniversityRequests = async () => {
      try {
        const response = await fetch("http://localhost:5095/api/AdminUniversityRequest", {
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
        else {
          toast.error("Failed to fetch requests. Please try again later.")
        }
      }
      catch(error){
        toast.error("An error occured while trying to fetch requests.");
      }
      finally {
        setIsUniversityLoading(false);
      }
    }
    if (user?.token) {
      fetchUniversityRequests();
    }
  }, [user?.token])

  useEffect(() => {
    const fetchClubRequests = async () => {
      try {
        const response = await fetch("http://localhost:5095/api/AdminClubRequest", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${user?.token}`
          }
        })
        if (response.ok) {
          const data = await response.json();
          console.log(data);
          setClubRequests(data);
        } 
        else {
          toast.error("Failed to fetch club requests. Please try again later.");
        }
      } 
      catch (error) {
        toast.error("An error occurred while trying to fetch club requests.");
      }
      finally {
        setIsClubLoading(false);
      }
    };

    if (user?.token) {
      fetchClubRequests();
    }
  }, [user?.token]);

  const openModal = (type, requestType, requestId, requestName) => {
    setModalState({
      isOpen: true,
      type,
      requestType,
      requestId,
      requestName
    });
    setRejectionReason(''); // Reset rejection reason
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
  };


  const handleUniversityAction = async () => {
    setIsProcessing(true);
    const { requestId, type } = modalState;
    try {
      const response = await fetch(`http://localhost:5095/api/AdminUniversityRequest/${requestId}/status`, {
        method: "PUT", // or PATCH, depending on your API
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${user?.token}`
        },
        body: JSON.stringify({
          status: type === "approve" ? 1 : 2,
          rejectionReason: type === "rejection" ? rejectionReason : null
        })
      });
      if (!response.ok) {
        throw new Error(`Failed to update request status: ${response.statusText}`);
      }
      if (type === "approve") {
      // Find the university request data
        const universityRequest = universityRequests.find(req => req.id === requestId);
      
        if (universityRequest) {
          const universityData = {
            name: universityRequest.universityName,
            location: universityRequest.location,
            logoUrl: logoUrl
          };

          const universityResponse = await fetch("http://localhost:5095/api/AdminUniversity", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${user?.token}`
            },
            body: JSON.stringify(universityData)
          });

          if (!universityResponse.ok) {
            // If university creation fails, we might want to revert the status update
            throw new Error(`Failed to create university record: ${universityResponse.statusText}`);
          }

          console.log("University created successfully");
        }
      }
      setUniversityRequests((prev) =>
        prev.map((request) => 
          request.id === requestId 
            ? { ...request, status: type === 'approve' ? 'approved' : 'rejected' } 
            : request
        )
      );

      toast.success(
        type === 'approve' 
          ? 'University request approved and university created successfully!' 
          : 'University request rejected successfully!'
      );
      closeModal();
      
    } 
    catch (error) {
      console.error(`Error ${type}ing university request:`, error);
      toast.error(`An error occurred while ${type === 'approve' ? 'approving' : 'rejecting'} the request: ${error.message}`);
    } 
    finally {
      setIsProcessing(false);
    }
  }

  const handleClubAction = async () => {
    setIsProcessing(true);
    const { requestId, type } = modalState;
    try {
      // Step 1: Update the request status
      const payload = {
        status: type === 'approve' ? 1 : 2, // Assuming 1 = approved, 2 = rejected
        rejectionReason: type === 'reject' ? rejectionReason : null
      };

      const response = await fetch(`http://localhost:5095/api/AdminClubRequest/${requestId}/status`, {
        method: "PUT", // or PATCH, depending on your API
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${user?.token}`
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`Failed to update request status: ${response.statusText}`);
      }

      // Step 2: If approved, create the club record
      if (type === "approve") {
        // Find the club request data
        const clubRequest = clubRequests.find(req => req.id === requestId);
        console.log(clubRequest);
        if (clubRequest) {
          const clubData = {
            name: clubRequest.name,
            description: clubRequest.description,
            clubLocation: clubRequest.clubLocation,
            universityId: clubRequest.universityId,
            categoryId: clubRequest.categoryId,
            tagIds: clubRequest.tags.map(tag => tag.id) // Extract tag IDs from tags array
          };
          console.log("SENDING DATA");
          console.log(clubData);

          const clubResponse = await fetch("http://localhost:5095/api/AdminClub", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${user?.token}`
            },
            body: JSON.stringify(clubData)
          });

          if (!clubResponse.ok) {
            throw new Error(`Failed to create club record: ${clubResponse.statusText}`);
          }

          console.log("Club created successfully");
        }
      }
      // Step 3: Update local state
      setClubRequests((prev) =>
        prev.map((request) => 
          request.id === requestId 
            ? { ...request, status: type === 'approve' ? 'approved' : 'rejected' } 
            : request
        )
      );
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
                  {universityRequests.filter((r) => r.status.toLowerCase() === "pending").length}
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
                  {clubRequests.filter((r) => r.status.toLowerCase() === "pending").length}
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
                  {[...universityRequests, ...clubRequests].filter((r) => r.status.toLowerCase() === "approved").length}
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
                  {/* <TableHead>Status</TableHead> */}
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {universityRequests.map((request) => (
                  <TableRow key={request.id}>
                    <TableCell className="font-medium">{request.universityName}</TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{request.fullName}</p>
                        <p className="text-sm text-gray-600">{request.requestedBy}</p>
                      </div>
                    </TableCell>
                    <TableCell>{request.location}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="border-blue-200 text-blue-600">
                        {request.universityType}
                      </Badge>
                    </TableCell>
                    <TableCell>{new Date(request.requestedAt).toLocaleDateString()}</TableCell>
                    {/* <TableCell>{getStatusBadge(request.status.toLowerCase())}</TableCell> */}
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
                          className="border-red-200 text-red-600 hover:bg-red-50 p-2 rounded-lg"
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
                  <TableHead>Tags</TableHead>
                  <TableHead>Submitted</TableHead>
                  {/* <TableHead>Status</TableHead> */}
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {clubRequests.map((request) => (
                  <TableRow key={request.id}>
                    <TableCell className="font-medium">{request.name}</TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{request.fullName}</p>
                        <p className="text-sm text-gray-600">{request.requestedBy}</p>
                      </div>
                    </TableCell>
                    <TableCell>{request.universityName}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="border-green-200 text-green-600">
                        {request.category}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {request.tags.map((tag, idx) => {
                        return(
                          <div key={idx} className="flex flex-col">
                            <Badge variant="outline" className="border-red-200 text-red-600">
                              {tag.name}
                            </Badge>
                          </div>
                        );
                      })}
                    </TableCell>
                    <TableCell>{new Date(request.requestedAt).toLocaleDateString()}</TableCell>
                    {/* <TableCell>{getStatusBadge(request.status.toLowerCase())}</TableCell> */}
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
                          className="border-red-200 text-red-600 hover:bg-red-50 p-2 rounded-lg"
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
          isProcessing={isProcessing}
        />
      </div>
    </div>
  )
}
