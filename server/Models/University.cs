using System.ComponentModel.DataAnnotations;

namespace RateMyCollegeClub.Models;

public class University {
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Location { get; set; } = string.Empty;
    public virtual ICollection<Club> Clubs { get; set; } = [];
}