namespace RateMyCollegeClub.Models.Requests;

public class GetMyUniversityRequestDTO
{
    public int Id { get; set; }
    public string UniversityName { get; set; } = string.Empty;
    public UniversityType UniversityType { get; set; } = UniversityType.Public;
    public string Location { get; set; } = string.Empty;
    public string? UserId { get; set; }
    public DateTime RequestedAt { get; set; }
    public int Status { get; set; } // Default status can be
}