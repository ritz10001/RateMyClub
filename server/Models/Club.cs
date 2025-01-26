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
    public string ClubLocation { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    [ForeignKey(nameof(CategoryId))]
    public int CategoryId { get; set; }
    public Category Category { get; set; }

    [ForeignKey(nameof(UniversityId))]
    public int UniversityId { get; set; }
    public University University { get; set; }
    public virtual ICollection<Review> Reviews { get; set; } = [];
    public virtual ICollection<SavedClub> SavedClubs { get; set; } = [];

}