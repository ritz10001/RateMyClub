using System.ComponentModel.DataAnnotations;
using RateMyCollegeClub.Models.Reviews;

namespace RateMyCollegeClub.Models.Clubs;

public class GetReviewsDTO
{
    public int Id { get; set; }
    public int ClubId { get; set; }
    public decimal OverallRating { get; set; }
    public string Comment { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;  
    public string UserDisplayName { get; set; } = string.Empty;
}