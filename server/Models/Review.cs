namespace RateMyCollegeClub.Models;

class Review {
    public int Id { get; set; }
    public int ClubId { get; set; }
    public string UserId { get; set; } = string.Empty;
    public int LeadershipRating {get; set;}
    public int InclusivityRating {get; set;}
    public int NetworkingRating {get; set;}
    public int SkillsDevelopmentRating {get; set;}
    public string Comment {get; set;} = string.Empty;
    public Club Club {get; set;}
    // public virtual User User {get; set;}

}