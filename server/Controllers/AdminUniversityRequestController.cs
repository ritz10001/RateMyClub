using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RateMyCollegeClub.Data;
using RateMyCollegeClub.Interfaces;
using RateMyCollegeClub.Models;
using RateMyCollegeClub.Models.Requests;
using RateMyCollegeClub.Models.Requests.UniversityRequests;
using RateMyCollegeClub.Repository;

namespace RateMyCollegeClub.Controllers;

[ApiController]
[Route("api/[controller]")]

public class AdminUniversityRequestController : ControllerBase
{
    private readonly IMapper _mapper;
    private readonly IUniversityRequestsRepository _universityRequestsRepository;
    private readonly UserManager<User> _userManager;
    public AdminUniversityRequestController(IMapper mapper, IUniversityRequestsRepository universityRequestsRepository, UserManager<User> userManager)
    {
        _mapper = mapper;
        _universityRequestsRepository = universityRequestsRepository;
        _userManager = userManager;
    }

    [HttpGet]
    [Authorize]
    public async Task<ActionResult<IEnumerable<GetUniversityRequestsDTO>>> GetPendingRequests()
    {
        var firebaseUid = HttpContext.Items["FirebaseUid"] as string;
        User? user = null;
        if (!string.IsNullOrEmpty(firebaseUid))
        {
            user = await _userManager.Users.FirstOrDefaultAsync(u => u.FireBaseUid == firebaseUid);
        }
        if (user == null || !await IsAdmin(user))
        {
            return Unauthorized();
        }
        var requests = await _universityRequestsRepository.GetUniversityRequestsInformation();
        var pendingRequests = requests.Where(r => r.RequestStatus == RequestStatus.Pending).ToList();
        var result = _mapper.Map<List<GetUniversityRequestsDTO>>(pendingRequests);
        return Ok(result);
    }

    [HttpPut("edit-request/{id}")]
    [Authorize]
    public async Task<IActionResult> EditUniversityRequest(int id, [FromBody] EditUniversityRequestDTO dto)
    {
        var firebaseUid = HttpContext.Items["FirebaseUid"] as string;
        User? user = null;
        if (!string.IsNullOrEmpty(firebaseUid))
        {
            user = await _userManager.Users.FirstOrDefaultAsync(u => u.FireBaseUid == firebaseUid);
        }
        if (user == null || !await IsAdmin(user))
        {
            return Unauthorized();
        }
        var request = await _universityRequestsRepository.GetAsync(id);
        if (request == null) return NotFound();

        request.UniversityName = dto.UniversityName;
        request.Location = dto.Location;
        request.OfficialWebsite = dto.OfficialWebsite;

        await _universityRequestsRepository.UpdateAsync(request);
        return NoContent();
    }

    [HttpPut("{id}/status")]
    [Authorize]
    public async Task<IActionResult> UpdateUniversityRequestStatus(int id, [FromBody] UpdateUniversityRequestStatusDTO dto)
    {
        var firebaseUid = HttpContext.Items["FirebaseUid"] as string;
        User? user = null;
        if (!string.IsNullOrEmpty(firebaseUid))
        {
            user = await _userManager.Users.FirstOrDefaultAsync(u => u.FireBaseUid == firebaseUid);
        }
        if (user == null || !await IsAdmin(user))
        {
            return Unauthorized();
        }
        var request = await _universityRequestsRepository.GetAsync(id);
        if (request == null) return NotFound();

        if ((int)dto.Status == 1)
        {
            request.RequestStatus = RequestStatus.Approved;
        }
        else
        {
            request.RequestStatus = RequestStatus.Rejected;
            request.RejectionReason = dto.RejectionReason;
        }
        Console.WriteLine($"Status: {dto.Status}, RejectionReason: {dto.RejectionReason}");
        await _universityRequestsRepository.UpdateAsync(request);
        return NoContent();
    }

    private async Task<bool> IsAdmin(User? user)
    {
        var roles = await _userManager.GetRolesAsync(user);
        return roles.Contains("Administrator");
    }

}