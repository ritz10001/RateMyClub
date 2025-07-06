namespace RateMyCollegeClub.Models.Users;

public class AuthResponseDTO
{
    public string UserId { get; set; }
    public string Token { get; set; }
    public string RefreshToken { get; set; }
    public string FirstName { get; set; }
    public string LastName { get; set; }
}