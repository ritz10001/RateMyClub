using RateMyCollegeClub.Models;

namespace RateMyCollegeClub.Models.Requests.UniversityRequests;

public class UpdateUniversityRequestStatusDTO
{
    public RequestStatus Status { get; set; }
    public string? RejectionReason { get; set; }
}
