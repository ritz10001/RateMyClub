

using RateMyCollegeClub.Models.Clubs;

namespace RateMyCollegeClub.Models.Universities;

public class GetUniversityDTO : BaseUniversityDTO
{
    public int Id { get; set; }
    public string LogoUrl { get; set; } = string.Empty;
    public int ClubsCount { get; set; }
    public UniversityType UniversityType { get; set; } = UniversityType.Public;
    public DateTime CreatedAt { get; set; }
    public string Description { get; set; } = string.Empty;
    public ICollection<GetClubsDTO> Clubs { get; set; } = new List<GetClubsDTO>();
}