using System.ComponentModel.DataAnnotations;
using RateMyCollegeClub.Models.Reviews;

namespace RateMyCollegeClub.Models.Clubs;

public class GetMyReviewsDTO
{
    public int Id { get; set; }
    public int ClubId { get; set; }
    public string ClubName { get; set; } = string.Empty;
    public string UniversityName { get; set; } = string.Empty;
    public decimal OverallRating { get; set; }
    public string Comment { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}