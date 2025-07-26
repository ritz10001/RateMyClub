using RateMyCollegeClub.Models.Clubs;
using RateMyCollegeClub.Models.Universities;
using RateMyCollegeClub.Utils;

public class GetUniversityWithPagedClubsDTO
{
    public GetUniversityDTO University { get; set; }
    public PagedResult<GetClubsDTO> Clubs { get; set; }
}
