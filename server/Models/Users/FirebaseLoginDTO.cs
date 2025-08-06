namespace RateMyCollegeClub.Models.Users;

public class FirebaseLoginDTO
{
    public bool Success { get; set; }
    public string Message { get; set; }
    public string UserId { get; set; }
    public string Email { get; set; }
    public ICollection<string> Roles { get; set; } = [];
}