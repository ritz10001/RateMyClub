namespace RateMyCollegeClub.Models.Users;

public class AuthResponseDTO
{
    public string UserId { get; set; }
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public string Email { get; set; }
    public List<string> Roles { get; set; } 
    public string ConfirmationUrl { get; set; } = "";  // ← just empty in login
    public string Message { get; set; } = "";
}