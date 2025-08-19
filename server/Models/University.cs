using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;
using RateMyCollegeClub.Data;

namespace RateMyCollegeClub.Models;

public class University
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    [MaxLength(100)]
    public string Location { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public string LogoUrl { get; set; } = string.Empty;
    public string OfficialWebsite { get; set; } = string.Empty;
    public virtual ICollection<Club> Clubs { get; set; } = [];
    public virtual ICollection<User>? Users { get; set; } = [];
}