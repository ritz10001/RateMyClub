

namespace RateMyCollegeClub.Models.Universities;

public class CreateUniversityDTO : BaseUniversityDTO
{
    public string SecondaryName { get; set; } = string.Empty;
    public string LogoUrl { get; set; } = string.Empty;
    public string OfficialWebsite { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}