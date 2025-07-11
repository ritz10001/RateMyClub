using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using RateMyCollegeClub.Data;

namespace RateMyCollegeClub.Models;

public class SavedClub
{
    public int Id { get; set; }
    public int ClubId { get; set; }
    public Club Club { get; set; }
    public DateTime SavedAt { get; set; } = DateTime.UtcNow;
    public string? UserId { get; set; }
    public User? User { get; set; }
      
}