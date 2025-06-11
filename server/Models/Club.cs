using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore.Metadata.Internal;

namespace RateMyCollegeClub.Models;

public class Club {
    public int Id { get; set; }
    [Required]
    [MaxLength(100)]
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public bool IsActive { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public string LogoUrl { get; set; } = string.Empty;
    public string ClubLocation { get; set; } = string.Empty;
    public int CategoryId { get; set; }
    public Category Category { get; set; }
    public int UniversityId { get; set; }
    public University University { get; set; }
    public virtual ICollection<Review> Reviews { get; set; } = [];
    public virtual ICollection<SavedClub>? SavedByUsers { get; set; } = [];

}