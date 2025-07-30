using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
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
    public AccountController(IAuthService authService, UserManager<User> userManager)
    {
        _authService = authService;
        _userManager = userManager;
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

    [HttpPost]
    [Route("refreshtoken")]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<ActionResult> RefreshToken([FromBody] AuthResponseDTO request)
    {
        var authResponse = await _authService.VerifyRefreshToken(request);

        if (authResponse == null)
        {
            return Unauthorized();
        }

        return Ok(authResponse);
    }

    [HttpPost("refresh")]
    public async Task<IActionResult> Refresh([FromBody] AuthResponseDTO authResponseDTO)
    {
        var result = await _authService.VerifyRefreshToken(authResponseDTO);
        if (result == null)
        {
            return Unauthorized("Invalid Refresh Token");
        }
        return Ok(result);
    }

}