using System.ComponentModel.DataAnnotations;
using RateMyCollegeClub.Models.Reviews;

namespace RateMyCollegeClub.Models.Clubs;

public class GetReviewDTO : BaseReviewDTO {
    public int Id { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    [Required]
    [Range(1, int.MaxValue)]
    public int ClubId { get; set; }
}