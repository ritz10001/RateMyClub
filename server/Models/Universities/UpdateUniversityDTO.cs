

namespace RateMyCollegeClub.Models.Universities;

public class UpdateUniversityDTO : BaseUniversityDTO
{
    public string LogoUrl { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string OfficialWebsite { get; set; } = string.Empty;

}   