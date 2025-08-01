namespace RateMyCollegeClub.Models.Users;

public class AuthResponseDTO
{
    public string UserId { get; set; }
    public string Token { get; set; }
    public string RefreshToken { get; set; }
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public string Email { get; set; }
    public List<string> Roles { get; set; } 
    public DateTime? RefreshTokenExpiry { get; set; }
}