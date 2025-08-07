using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using RateMyCollegeClub.Data;

namespace RateMyCollegeClub.Models;

public class Tag
{
    public int Id { get; set; }

    [Required]
    [MaxLength(50)]
    public string Name { get; set; } = string.Empty;
    public virtual ICollection<Club> Clubs { get; set; } = [];
    public virtual ICollection<User> Users { get; set; } = [];
}

