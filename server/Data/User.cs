using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Identity;
using RateMyCollegeClub.Models;

namespace RateMyCollegeClub.Data;

public class User : IdentityUser
{
    public string FireBaseUid { get; set; }
    [Required, MaxLength(50)]
    public string FirstName { get; set; } = string.Empty;
    [Required, MaxLength(50)]
    public string LastName { get; set; } = string.Empty;
    public string SchoolName { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public int? UniversityId { get; set; }
    public virtual University? University { get; set; }
    public virtual ICollection<Review> Reviews { get; set; } = [];
    public virtual ICollection<SavedClub> SavedClubs { get; set; } = [];
    public virtual ICollection<UniversityRequest> UniversityRequests { get; set; } = [];
    public virtual ICollection<ClubRequest> ClubRequests { get; set; } = [];
    public virtual ICollection<Tag> Tags { get; set; } = [];
}