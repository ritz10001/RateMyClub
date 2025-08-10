using System.Security.Claims;
using System.Text.Json;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
using Newtonsoft.Json;
using RateMyCollegeClub.Data;
using RateMyCollegeClub.Interfaces;
using RateMyCollegeClub.Models;
using RateMyCollegeClub.Models.Requests;
using RateMyCollegeClub.Models.Requests.UniversityRequests;
using RateMyCollegeClub.Models.Users;

namespace RateMyCollegeClub.Controllers;

[Route("api/[controller]")]
[ApiController]

public class UniversityRequestController : ControllerBase
{
    private readonly IMapper _mapper;
    private readonly IUniversityRequestsRepository _universityRequestsRepository;
    private readonly UserManager<User> _userManager;
    public UniversityRequestController(IMapper mapper, IUniversityRequestsRepository universityRequestsRepository, UserManager<User> userManager)
    {
        _mapper = mapper;
        _universityRequestsRepository = universityRequestsRepository;
        _userManager = userManager;
    }

    [HttpGet("my-university-requests")]
    [Authorize]
    public async Task<ActionResult<IEnumerable<GetMyUniversityRequestDTO>>> GetRequestsByUserId()
    {
        // Get the Firebase UID from HttpContext.Items (set by middleware)
        var firebaseUid = HttpContext.Items["FirebaseUid"] as string;
        Console.WriteLine("THIS IS THE FIREBASE ID");
        Console.WriteLine(firebaseUid);

        if (string.IsNullOrEmpty(firebaseUid))
            return Unauthorized();

        // Query your Identity DB for the user and roles
        var user = await _userManager.Users.FirstOrDefaultAsync(u => u.FireBaseUid == firebaseUid);

        if (user == null)
            return Unauthorized();

        // You can decide if this endpoint is for everyone logged-in or only admins
        // For "any authenticated user":
        var requests = await _universityRequestsRepository.GetUniversityRequestByUser(user.Id);
        var result = _mapper.Map<List<GetMyUniversityRequestDTO>>(requests);
        return Ok(result);
    }

    [HttpPost]
    [Authorize]
    public async Task<IActionResult> CreateRequest(UniversityRequestDTO universityRequestDTO)
    {
        var request = _mapper.Map<UniversityRequest>(universityRequestDTO);

        var firebaseUid = HttpContext.Items["FirebaseUid"] as string;
        User? user = null;
        if (!string.IsNullOrEmpty(firebaseUid))
        {
            user = await _userManager.Users.FirstOrDefaultAsync(u => u.FireBaseUid == firebaseUid);
        }
        request.UserId = user?.Id;

        await _universityRequestsRepository.AddAsync(request);

        return Ok(new { message = "University request submitted successfully." });
    }


    [HttpDelete("{id}")]
    [Authorize]
    public async Task<IActionResult> WithdrawRequest(int id)
    {
        var request = await _universityRequestsRepository.GetAsync(id);
        if (request == null)
        {
            return NotFound();
        }
        await _universityRequestsRepository.DeleteAsync(id);
        return NoContent();
    }
    private string? GetUserId()
    {
        return User.Claims.FirstOrDefault(c => c.Type == "uid")?.Value;
    }
    
    
}