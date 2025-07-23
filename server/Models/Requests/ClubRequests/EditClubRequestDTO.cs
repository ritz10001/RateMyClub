namespace RateMyCollegeClub.Models.Requests;

public class EditClubRequestDTO
{
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string ClubLocation { get; set; } = string.Empty;
}
