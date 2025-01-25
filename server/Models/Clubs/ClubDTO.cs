using System.ComponentModel.DataAnnotations;

namespace RateMyCollegeClub.Models.Clubs;

public class ClubDTO {
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
}