using SendGrid;
using SendGrid.Helpers.Mail;
using RateMyCollegeClub.Interfaces;
using Microsoft.Extensions.Configuration; // Ensure this is included

// Remove MailKit and MimeKit usings as they are no longer needed
// using MailKit.Net.Smtp;
// using MailKit.Security;
// using MimeKit;

public class EmailService : IEmailService
{
    private readonly IConfiguration _configuration;
    private readonly ISendGridClient _sendGridClient; // Inject ISendGridClient

    public EmailService(IConfiguration configuration, ISendGridClient sendGridClient) // Inject ISendGridClient
    {
        _configuration = configuration;
        _sendGridClient = sendGridClient; // Assign the injected client
    }

    public async Task<bool> SendVerificationEmailAsync(string toEmail, string firstName, string verificationUrl)
    {
        try
        {
            var emailSettings = _configuration.GetSection("EmailSettings");

            var fromEmail = emailSettings["SenderEmail"];
            var fromName = emailSettings["SenderName"];

            if (string.IsNullOrEmpty(fromEmail) || string.IsNullOrEmpty(fromName))
            {
                Console.WriteLine("EmailSettings:SenderEmail or EmailSettings:SenderName is not configured.");
                return false;
            }

            var from = new EmailAddress(fromEmail, fromName);
            var to = new EmailAddress(toEmail);
            var subject = "Verify Your RateMyCollegeClub Account";
            var htmlContent = GetVerificationEmailTemplate(firstName, verificationUrl);

            // Create the email message using SendGrid Helpers
            var msg = MailHelper.CreateSingleEmail(from, to, subject, null, htmlContent); // null for plain text content

            Console.WriteLine($"Attempting to send email to {toEmail} via SendGrid API...");
            var response = await _sendGridClient.SendEmailAsync(msg); // Send via HTTP API

            if (response.IsSuccessStatusCode)
            {
                Console.WriteLine("Email sent successfully via SendGrid API!");
                return true;
            }
            else
            {
                var responseBody = await response.Body.ReadAsStringAsync();
                Console.WriteLine($"SendGrid API email failed with status {response.StatusCode}: {responseBody}");
                // Log the full response details for debugging
                Console.WriteLine($"SendGrid Response Headers: {response.Headers}");
                return false;
            }
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Email sending failed (SendGrid API): {ex.Message}");
            return false;
        }
    }

    private string GetVerificationEmailTemplate(string firstName, string verificationUrl)
    {
        // This method remains identical
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
