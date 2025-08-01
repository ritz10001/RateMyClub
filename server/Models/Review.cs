using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using RateMyCollegeClub.Data;
using server.Models;

namespace RateMyCollegeClub.Models;

public class Review
{
    public int Id { get; set; }
    [Range(1, 5, ErrorMessage = "Rating must be between 1 and 5.")]
    public int LeadershipRating { get; set; }
    [Range(1, 5, ErrorMessage = "Rating must be between 1 and 5.")]
    public int InclusivityRating { get; set; }
    [Range(1, 5, ErrorMessage = "Rating must be between 1 and 5.")]
    public int NetworkingRating { get; set; }
    [Range(1, 5, ErrorMessage = "Rating must be between 1 and 5.")]
    public int SkillsDevelopmentRating { get; set; }
    [MaxLength(1000, ErrorMessage = "Comment cannot exceed 1000 characters.")]
    public decimal OverallRating { get; set; }
    public string Comment { get; set; } = string.Empty;
    public string Recommendation { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public int ClubId { get; set; }
    public Club Club { get; set; }
    public string? UserId { get; set; }
    public User? User { get; set; }
    public ICollection<ReviewVote> Votes { get; set; } = new List<ReviewVote>();
    public int NetScore { get; set; } = 0;

}