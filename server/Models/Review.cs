using System.ComponentModel.DataAnnotations.Schema;

namespace RateMyCollegeClub.Models;

class Review {
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
    // [ForeignKey(nameof(UserId))]
    // public string UserId { get; set; } = string.Empty;
    public Club Club {get; set;}
    // public virtual User User {get; set;}

}