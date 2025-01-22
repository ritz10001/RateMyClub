namespace RateMyCollegeClub.Models;

class SavedClub {
    public int Id {get; set;}
    public string UserId {get; set;}
    public int ClubId {get; set;}
    public User User {get; set;}
    public Club Club {get; set;}

}