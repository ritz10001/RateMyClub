namespace RateMyCollegeClub.Models.Requests;


public class EditUniversityRequestDTO
{
    public string UniversityName { get; set; } = string.Empty;
    public string Location { get; set; } = string.Empty;
    public string? OfficialWebsite { get; set; } = string.Empty;
}
