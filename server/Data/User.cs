using Microsoft.AspNetCore.Identity;
using RateMyCollegeClub.Models;

namespace RateMyCollegeClub.Data;

public class User : IdentityUser {
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string SchoolName { get; set; } = string.Empty;
    public string Major { get; set; } = string.Empty;
    public virtual ICollection<Review> Reviews { get; set; } = [];
    public virtual ICollection<SavedClub> SavedClubs { get; set; } = [];
}