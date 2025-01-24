using System.ComponentModel.DataAnnotations;

namespace RateMyCollegeClub.Models.Clubs;

public class GetClubsDTO {
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public bool IsActive { get; set; }
    public string ClubLocation { get; set; } = string.Empty;
    public int CategoryId { get; set; }
    public string CategoryName { get; set; } = string.Empty;
}