using System.ComponentModel.DataAnnotations;

namespace RateMyCollegeClub.Models;

public class Category {
    public int Id { get; set; }
    [Required, MaxLength(50)]
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public bool isActive { get; set; } 
    public virtual ICollection<Club> Clubs { get; set; } = [];

}