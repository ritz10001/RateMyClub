using MailKit.Net.Smtp;
using MailKit.Security;
using MimeKit;
using RateMyCollegeClub.Interfaces;

public class EmailService : IEmailService
{
    private readonly IConfiguration _configuration;

    public EmailService(IConfiguration configuration)
    {
        _configuration = configuration;
    }

    public async Task<bool> SendVerificationEmailAsync(string toEmail, string firstName, string verificationUrl)
    {
        try
        {
            var emailSettings = _configuration.GetSection("EmailSettings");
            
            var message = new MimeMessage();
            message.From.Add(new MailboxAddress(
                emailSettings["SenderName"], 
                emailSettings["SenderEmail"]
            ));
            message.To.Add(new MailboxAddress("", toEmail));
            message.Subject = "Verify Your Rate My College Club Account";

            var bodyBuilder = new BodyBuilder
            {
                HtmlBody = GetVerificationEmailTemplate(firstName, verificationUrl)
            };
            message.Body = bodyBuilder.ToMessageBody();

            using var client = new SmtpClient();
            await client.ConnectAsync(
                emailSettings["SmtpServer"], 
                int.Parse(emailSettings["SmtpPort"]), 
                SecureSocketOptions.StartTls
            );
            await client.AuthenticateAsync(
                emailSettings["SenderEmail"], 
                emailSettings["SenderPassword"]
            );
            await client.SendAsync(message);
            await client.DisconnectAsync(true);

            return true;
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Email sending failed: {ex.Message}");
            return false;
        }
    }

    private string GetVerificationEmailTemplate(string firstName, string verificationUrl)
    {
        return $@"
        <div style='max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; padding: 20px;'>
            <div style='background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;'>
                <h1 style='color: white; margin: 0; font-size: 28px;'>Rate My College Club</h1>
            </div>
            
            <div style='background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #dee2e6;'>
                <h2 style='color: #333; margin-top: 0;'>Welcome, {firstName}! 🎉</h2>
                
                <p style='color: #666; font-size: 16px; line-height: 1.6;'>
                    Thanks for joining Rate My College Club! You're just one click away from discovering amazing college clubs and connecting with fellow students.
                </p>
                
                <div style='text-align: center; margin: 30px 0;'>
                    <a href='{verificationUrl}' 
                       style='background: #28a745; color: white; padding: 15px 30px; text-decoration: none; 
                              border-radius: 6px; font-weight: bold; font-size: 16px; display: inline-block;
                              box-shadow: 0 2px 4px rgba(40, 167, 69, 0.2);'>
                        ✅ Verify My Email Address
                    </a>
                </div>
                
                <p style='color: #666; font-size: 14px;'>
                    This link will expire in 24 hours. If you didn't create an account with us, you can safely ignore this email.
                </p>
                
                <hr style='border: none; border-top: 1px solid #dee2e6; margin: 20px 0;'>
                
                <p style='color: #999; font-size: 12px; margin: 0;'>
                    Best regards,<br>
                    The Rate My College Club Team<br>
                    <em>Connecting students, one club at a time</em>
                </p>
            </div>
        </div>";
    }
}