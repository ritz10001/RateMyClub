using System.ComponentModel.DataAnnotations;

namespace RateMyCollegeClub.Models.Users;

public class UserDTO : LoginDTO
{
    [Required]
    public string FirstName { get; set; }
    [Required]
    public string LastName { get; set; }

}