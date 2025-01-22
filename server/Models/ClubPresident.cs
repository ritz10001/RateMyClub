namespace RateMyCollegeClub.Models;

class ClubPresident {
    public int Id {get; set;}
    public int ClubId {get; set;}
    public string UserId {get; set;}
    public virtual Club Club {get; set;}
    // public virtual User User {get; set;}
}
