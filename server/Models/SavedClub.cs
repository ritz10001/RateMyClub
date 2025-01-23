using System.ComponentModel.DataAnnotations.Schema;

namespace RateMyCollegeClub.Models;

class SavedClub {
    public int Id { get; set;}
    // public string UserId {get; set;}
    [ForeignKey(nameof(ClubId))]
    public int ClubId { get; set;}
    public DateTime SavedAt { get; set; }
    // public User User {get; set;}
    public Club Club { get; set;}

}