namespace RateMyCollegeClub.Models.Requests;

using RateMyCollegeClub.Configurations;
public class GetUniversityRequestsDTO
{
    public int Id { get; set; }
    public string UniversityName { get; set; } = string.Empty;
    public string FullName { get; set; } = string.Empty;
    public string UniversityType { get; set; } = string.Empty;
    public string Location { get; set; } = string.Empty;
    public string? UserId { get; set; }
    public string RequestedBy { get; set; } = string.Empty;
    public DateTime RequestedAt { get; set; }
    public string Status { get; set; }// Default status can be
    // public string StatusDisplay => ((RequestStatus)Status).GetDisplayName();
    // public string UniversityTypeDisplay => UniversityType.GetDisplayName();
}