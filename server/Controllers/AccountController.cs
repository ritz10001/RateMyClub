using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using FirebaseAdmin.Auth;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
using RateMyCollegeClub.Data;
using RateMyCollegeClub.Interfaces;
using RateMyCollegeClub.Models.Users;

namespace RateMyCollegeClub.Controllers;

[Route("api/[controller]")]
[ApiController]

public class AccountController : ControllerBase
{
    private readonly IAuthService _authService;
    private readonly UserManager<User> _userManager;
    private readonly FirebaseAuthService _firebaseAuthService;
    public AccountController(IAuthService authService, UserManager<User> userManager, FirebaseAuthService firebaseAuthService)
    {
        _authService = authService;
        _userManager = userManager;
        _firebaseAuthService = firebaseAuthService;
    }

    [HttpPost]
    [Route("register")]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<ActionResult> Register([FromBody] UserDTO userDTO, [FromQuery] string role = "User")
    {
        var (authResponse, errors, confirmationUrl) = await _authService.Register(userDTO, role);

        if (errors != null && errors.Any())
        {
            foreach (var error in errors)
            {
                ModelState.AddModelError(error.Code, error.Description);
            }
            return BadRequest(ModelState);
        }
        var response = new RegisterResponseDTO
        {
            AuthResponse = authResponse,
            ConfirmationUrl = confirmationUrl
        };

        return Ok(response);
    }
    [HttpPost("verify-email")]
    public async Task<IActionResult> VerifyEmail([FromBody] EmailVerificationDTO emailVerificationDTO)
    {
        var user = await _userManager.FindByEmailAsync(emailVerificationDTO.Email);
        if (user == null)
        {
            return BadRequest("Invalid Email!");
        }
        var result = await _userManager.ConfirmEmailAsync(user, emailVerificationDTO.Token);
        if (result.Succeeded)
        {
            return Ok("Email Confirmed!");
        }
        return BadRequest("Email Confirmation Failed");
    }
    [HttpPost("firebase-register")]
    public async Task<IActionResult> FirebaseRegister([FromBody] FirebaseRegisterDTO firebaseRegisterDTO)
    {
        var result = await _authService.FirebaseRegister(firebaseRegisterDTO);
        if (string.IsNullOrWhiteSpace(result.UserId))
        {
            return BadRequest(new { result.Message });
        }
        return Ok(result);
    }
    [HttpPost("firebase-login")]
    public async Task<IActionResult> FirebaseLogin([FromBody] string firebaseIdToken)
    {
        var authResponse = await _authService.FirebaseLogin(firebaseIdToken);
        if (authResponse == null)
        {
            return Unauthorized(new { Message =  "Invalid token or user not registered."});
        }
        return Ok(authResponse);
    }
    [HttpPost]
    [Route("login")]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<ActionResult> Login([FromBody] LoginDTO loginDTO)
    {
        var authResponse = await _authService.Login(loginDTO);

        if (authResponse == null)
        {
            return Unauthorized();
        }

        return Ok(authResponse);
    }
    // [HttpPost("logout")]
    // public async Task<ActionResult> Logout()
    // {
    //     Response.Cookies.Delete("authToken");
    //     Response.Cookies.Delete("refreshToken");
    //     return Ok();
    // }
    // [HttpGet("me")]
    // [Authorize]
    // public async Task<IActionResult> GetCurrentUser()
    // {
    //     Console.WriteLine("---------------------------------------------------------------------");
    //     var userId = GetUserId();
    //     if (userId == null)
    //     {
    //         Console.WriteLine("USER ID IS NULL");
    //         return Unauthorized();
    //     }
    //     var user = await _userManager.FindByIdAsync(userId);
    //     if (user == null)
    //     {
    //         Console.WriteLine("USER NOT FOUND");
    //         return Unauthorized();
    //     }
    //     var roles = await _userManager.GetRolesAsync(user);
    //     var authResponse = new AuthResponseDTO
    //     {
    //         UserId = user.Id,
    //         FirstName = user.FirstName,
    //         LastName = user.LastName,
    //         Email = user.Email,
    //         Roles = roles.ToList()
    //     };
    //     Console.WriteLine("the me endpoint was successful");
    //     return Ok(authResponse);
    // }

    // /Controllers/AccountController.cs

    // [HttpPost("refresh")]
    // public async Task<ActionResult> Refresh()
    // {
    //     var isInitialRequest = Request.Headers.ContainsKey("X-Init-Request");
    //     Console.WriteLine("=== Refresh endpoint called ===");

    //     // 1. Get refresh token from cookie
    //     var refreshToken = Request.Cookies["refreshToken"];
    //     if (string.IsNullOrEmpty(refreshToken))
    //     {
    //         Console.WriteLine("No refresh token in cookies");
    //         return Unauthorized(new { Message = "No refresh token" });
    //     }

    //     Console.WriteLine($"Found refresh token: {refreshToken.Substring(0, Math.Min(10, refreshToken.Length))}...");

    //     var tokenParts = refreshToken.Split('.');
    //     if (tokenParts.Length < 2)
    //     {
    //         return Unauthorized(new { Message = "Invalid token format" });
    //     }
    //     var userId = tokenParts[0];
    //     var user = await _userManager.FindByIdAsync(userId);
    //     if (user == null)
    //     {
    //         Console.WriteLine("User not found for refresh token");
    //         return Unauthorized(new { Message = "Invalid refresh token" });
    //     }
    //     // 2. Verify the stored token matches
    //     var storedToken = await _userManager.GetAuthenticationTokenAsync(
    //         user,
    //         "RateMyCollegeClub",
    //         "RefreshToken");

    //     if (storedToken != refreshToken)
    //     {
    //         Console.WriteLine("Refresh token mismatch");
    //         await _userManager.UpdateSecurityStampAsync(user); // Rotate security stamp on mismatch
    //         return Unauthorized(new { Message = "Invalid refresh token" });
    //     }
    //     Console.WriteLine($"Found user: {user.Email}");

    //     // 3. Check if token is expired
    //     if (user.RefreshTokenExpiry == null || DateTime.UtcNow > user.RefreshTokenExpiry)
    //     {
    //         Console.WriteLine("Refresh token expired");
    //         await _userManager.RemoveAuthenticationTokenAsync(user, "RateMyCollegeClub", "RefreshToken");

    //         // Clear cookies
    //         Response.Cookies.Delete("authToken");
    //         Response.Cookies.Delete("refreshToken");

    //         return Unauthorized(new { Message = "Refresh token expired" });
    //     }

    //     // 4. Generate new tokens
    //     var authResponse = await _authService.VerifyRefreshToken(user.Id);
    //     if (authResponse == null)
    //     {
    //         Console.WriteLine("Token verification failed");
    //         return Unauthorized(new { Message = "Token verification failed" });
    //     }

    //     Console.WriteLine($"Refresh successful for user: {user.Email}");
    //     var roles = await _userManager.GetRolesAsync(user);
    //     // var authResponse = new AuthResponseDTO
    //     // {
    //     //     UserId = user.Id,
    //     //     FirstName = user.FirstName,
    //     //     LastName = user.LastName,
    //     //     Email = user.Email,
    //     //     Roles = roles.ToList(),
    //     //     Token = result.Token
    //     // };
    //     return Ok(authResponse);
    // }

    // private string GetUserIdFromToken()
    // {
    //     var refreshToken = Request.Cookies["refreshToken"];
    //     if (string.IsNullOrEmpty(refreshToken))
    //     {
    //         return null;
    //     }
    //     try
    //     {
    //         var tokenHandler = new JwtSecurityTokenHandler();
    //         var jsonToken = tokenHandler.ReadJwtToken(refreshToken);
    //         // Extract userId from token claims (adjust claim name as needed)
    //         var userIdClaim = jsonToken.Claims.FirstOrDefault(x => x.Type == "sub" || x.Type == "uid" || x.Type == ClaimTypes.NameIdentifier);
    //         return userIdClaim?.Value;
    //     }
    //     catch (Exception ex)
    //     {
    //         Console.WriteLine($"Error reading token: {ex.Message}");
    //         return null;
    //     }
    // }
    private string? GetUserId()
    {
        return User.Claims.FirstOrDefault(c => c.Type == "uid")?.Value;
    }

}