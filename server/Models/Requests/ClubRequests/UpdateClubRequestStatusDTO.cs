using RateMyCollegeClub.Models;

namespace RateMyCollegeClub.Models.Requests.ClubRequests;

public class UpdateClubRequestStatusDTO
{
    public RequestStatus Status { get; set; }
    public string? RejectionReason { get; set; }
    
}
