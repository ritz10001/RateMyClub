
namespace RateMyCollegeClub.Models.Requests.UniversityRequests;
public class UniversityRequestResponseDTO
{
    public int Id { get; set; }  // or whatever your PK is
    public string FullName { get; set; } = string.Empty;
    public string RequestedBy { get; set; } = string.Empty;
    public string UniversityName { get; set; } = string.Empty;
    public string Location { get; set; } = string.Empty;
    public string? OfficialWebsite { get; set; }
    public string? AdditionalInfo { get; set; }
    public string? UserId { get; set; }  // optionally return who requested it
}
