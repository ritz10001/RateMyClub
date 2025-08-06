using System.ComponentModel.DataAnnotations;

public class FirebaseRegisterDTO
{
    [Required]
    public string FirebaseIdToken { get; set; }
    [Required]
    public string Email { get; set; }  // Still capture this for consistency
    [Required]
    public string FirstName { get; set; }
    [Required]
    public string LastName { get; set; }
    public string? SchoolName { get; set; }
    public int? UniversityId { get; set; }  // For DB linkage if used
    public List<string>? Interests { get; set; }  // For recommendation system
}
