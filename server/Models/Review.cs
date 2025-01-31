using System.ComponentModel.DataAnnotations.Schema;
using RateMyCollegeClub.Data;

namespace RateMyCollegeClub.Models;

public class Review {
    public int Id { get; set; }
    public int LeadershipRating { get; set; }
    public int InclusivityRating { get; set; }
    public int NetworkingRating { get; set; }
    public int SkillsDevelopmentRating { get; set; }
    public int OverallRating { get; set;}
    public string Comment { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    [ForeignKey(nameof(ClubId))]
    public int ClubId { get; set; }
    public Club Club { get; set; }

    [ForeignKey(nameof(UserId))]
    public string UserId { get; set; } = string.Empty;
    public virtual User User {get; set;}

}