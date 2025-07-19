namespace RateMyCollegeClub.Models.Requests;

public class GetUniversityRequestDTO
{
    public int Id { get; set; }
    public string UniversityName { get; set; } = string.Empty;
    public string FullName { get; set; } = string.Empty;
    public UniversityType UniversityType { get; set; } = UniversityType.Public;
    public string Location { get; set; } = string.Empty;
    public string? UserId { get; set; }
    public string RequestedBy { get; set; } = string.Empty;
    public DateTime RequestedAt { get; set; }
    public IntPtr Status { get; set; } // Default status can be
}