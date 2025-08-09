namespace RateMyCollegeClub.Interfaces;
public interface IEmailService
{
    Task<bool> SendVerificationEmailAsync(string toEmail, string firstName, string verificationUrl);
}