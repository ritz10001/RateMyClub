using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Identity;
using RateMyCollegeClub.Models;

namespace RateMyCollegeClub.Data;

public class User : IdentityUser
{
    [Required, MaxLength(50)]
    public string FirstName { get; set; } = string.Empty;
    [Required, MaxLength(50)]
    public string LastName { get; set; } = string.Empty;
    [Required, MaxLength(100)]
    public string SchoolName { get; set; } = string.Empty;
    [Required, MaxLength(100)]
    public string Major { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public bool isDeleted { get; set; } = false;
    public DateTime? RefreshTokenExpiry { get; set; }
    public int? UniversityId { get; set; }
    public virtual University? University { get; set; }
    public virtual ICollection<Review> Reviews { get; set; } = [];
    public virtual ICollection<SavedClub> SavedClubs { get; set; } = [];
    public virtual ICollection<UniversityRequest> UniversityRequests { get; set; } = [];
    public virtual ICollection<ClubRequest> ClubRequests { get; set; } = [];
}