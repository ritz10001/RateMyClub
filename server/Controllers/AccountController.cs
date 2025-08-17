using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using FirebaseAdmin.Auth;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
using Newtonsoft.Json;
using RateMyCollegeClub.Data;
using RateMyCollegeClub.Interfaces;
using RateMyCollegeClub.Models.Users;
using RateMyCollegeClub.Repository;

namespace RateMyCollegeClub.Controllers;

[Route("api/[controller]")]
[ApiController]

public class AccountController : ControllerBase
{
    private readonly IAuthService _authService;
    private readonly UserManager<User> _userManager;
    private readonly FirebaseAuthService _firebaseAuthService;
    private readonly ITagsRepository _tagsRepository;
    public AccountController(IAuthService authService, UserManager<User> userManager, FirebaseAuthService firebaseAuthService, ITagsRepository tagsRepository)
    {
        _authService = authService;
        _userManager = userManager;
        _firebaseAuthService = firebaseAuthService;
        _tagsRepository = tagsRepository;
    }
    [HttpPost("resend-verification")]
    public async Task<IActionResult> ResendVerification([FromBody] ResendVerificationRequestDTO request)
    {
        if (string.IsNullOrWhiteSpace(request.Email))
        {
            return BadRequest("Email is required.");
        }
        var (Success, ErrorMessage) = await _authService.ResendVerification(request.Email);
        if (!Success)
        {
            return BadRequest(ErrorMessage);
        }

        return Ok(new { Message = "Verification email resent successfully." });
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
    public async Task<IActionResult> FirebaseRegister([FromBody] FirebaseRegisterDTO firebaseRegisterDTO, [FromQuery] string role = "User")
    {
        var (authResponse, errors, confirmationUrl) = await _authService.FirebaseRegister(firebaseRegisterDTO, role);

        if (errors != null && errors.Any())
        {
            foreach (var error in errors)
            {
                ModelState.AddModelError(error.Code, error.Description);
            }
            return BadRequest(ModelState);
        }

        if (firebaseRegisterDTO.IsSSO)
        {
            return Ok(authResponse);
        }

        var response = new RegisterResponseDTO
        {
            AuthResponse = authResponse,
            ConfirmationUrl = confirmationUrl
        };

        return Ok(response);
    }

    [HttpPost("firebase-login")]
    public async Task<IActionResult> FirebaseLogin([FromBody] string firebaseIdToken)
    {
        try
        {
            var authResponse = await _authService.FirebaseLogin(firebaseIdToken);
            if (authResponse == null)
            {
                Console.WriteLine("the token is not valid");
                // Could mean invalid token, user not found, or email not verified
                return Unauthorized(new { Message = "Invalid token, user not registered, or email not verified." });
            }
            return Ok(authResponse);
        }
        catch (Exception ex)
        {
            Console.WriteLine("Some exception was caught");
            Console.WriteLine(ex);
            // Log exception if needed
            return StatusCode(500, new { Message = "An unexpected error occurred." });
        }
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
    [HttpPatch("update-profile")]
    [Authorize]
    public async Task<IActionResult> UpdateProfile([FromBody] UpdateUserInfoDTO updateUserInfo)
    {
        var firebaseUid = HttpContext.Items["FirebaseUid"] as string;
        User? user = null;
        if (!string.IsNullOrEmpty(firebaseUid))
        {
            user = await _userManager.Users.Include(u => u.Tags).FirstOrDefaultAsync(u => u.FireBaseUid == firebaseUid);
        }
        if (user == null) return Unauthorized();
        user.FirstName = updateUserInfo.FirstName ?? user.FirstName;
        user.LastName = updateUserInfo.LastName ?? user.LastName;
        user.UniversityId = updateUserInfo.UniversityId ?? user.UniversityId;
        if (updateUserInfo.TagIds != null && updateUserInfo.TagIds.Any())
        {
            var tags = await _tagsRepository.GetTagsByIdsAsync(updateUserInfo.TagIds);
            user.Tags = tags;
        }
        var result = await _userManager.UpdateAsync(user);
        if (!result.Succeeded)
            return BadRequest(result.Errors);

        return NoContent();
    }
    private string? GetUserId()
    {
        return User.Claims.FirstOrDefault(c => c.Type == "uid")?.Value;
    }

}