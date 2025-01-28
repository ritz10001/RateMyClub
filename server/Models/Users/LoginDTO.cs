using System.ComponentModel.DataAnnotations;

namespace RateMyCollegeClub.Models.Users;

public class LoginDTO
{
    [Required]
    [EmailAddress]
    public string Email { get; set; }
    [Required]
    [StringLength(15, ErrorMessage = "Your password is limited to {2} and {1} characters", MinimumLength = 6)]
    public string Password { get; set; }

}