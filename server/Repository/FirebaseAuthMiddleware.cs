using System.Security.Claims;
using FirebaseAdmin.Auth;
using Microsoft.Extensions.Logging;

public class FirebaseAuthMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<FirebaseAuthMiddleware> _logger;

    public FirebaseAuthMiddleware(RequestDelegate next, ILogger<FirebaseAuthMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        // If there's no Authorization header, *do not* block — proceed as anonymous
        string authHeader = context.Request.Headers["Authorization"].FirstOrDefault();

        if (string.IsNullOrEmpty(authHeader) || !authHeader.StartsWith("Bearer ", StringComparison.OrdinalIgnoreCase))
        {
            // No token provided — let controller / [Authorize] handle protected endpoints.
            await _next(context);
            return;
        }

        var token = authHeader.Substring("Bearer ".Length).Trim();

        try
        {
            var decodedToken = await FirebaseAuth.DefaultInstance.VerifyIdTokenAsync(token);

            // Put the Firebase UID somewhere convenient
            context.Items["FirebaseUid"] = decodedToken.Uid;

            // Build minimal ClaimsPrincipal so [Authorize] (and User.*) works
            var claims = new List<Claim>
            {
                // set NameIdentifier to firebase UID
                new Claim(ClaimTypes.NameIdentifier, decodedToken.Uid),
            };

            // If Firebase token contains an email claim, add it (key is usually "email")
            if (decodedToken.Claims.TryGetValue("email", out var emailObj) && emailObj != null)
            {
                claims.Add(new Claim(ClaimTypes.Email, emailObj.ToString()));
            }

            var identity = new ClaimsIdentity(claims, "Firebase");
            context.User = new ClaimsPrincipal(identity);
        }
        catch (FirebaseAuthException fae)
        {
            _logger.LogWarning("Firebase token verification failed: {Msg}", fae.Message);
            context.Response.StatusCode = StatusCodes.Status401Unauthorized;
            await context.Response.WriteAsync("Invalid Firebase token.");
            return;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Unexpected error verifying Firebase token");
            context.Response.StatusCode = StatusCodes.Status500InternalServerError;
            await context.Response.WriteAsync("Authentication error.");
            return;
        }

        await _next(context);
    }
}
