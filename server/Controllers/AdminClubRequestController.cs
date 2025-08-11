using System.Text.Json;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RateMyCollegeClub.Data;
using RateMyCollegeClub.Interfaces;
using RateMyCollegeClub.Models;
using RateMyCollegeClub.Models.Requests;
using RateMyCollegeClub.Models.Requests.ClubRequests;
using RateMyCollegeClub.Repository;

namespace RateMyCollegeClub.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AdminClubRequestController : ControllerBase
{
    private readonly IMapper _mapper;
    private readonly IClubRequestsRepository _clubRequestsRepository;
    private readonly ITagsRepository _tagsRepository;
    private readonly UserManager<User> _userManager;

    public AdminClubRequestController(IMapper mapper, IClubRequestsRepository clubRequestsRepository, ITagsRepository tagsRepository, UserManager<User> userManager)
    {
        _mapper = mapper;
        _clubRequestsRepository = clubRequestsRepository;
        _tagsRepository = tagsRepository;
        _userManager = userManager;
    }

    [HttpGet]
    [Authorize]
    public async Task<ActionResult<IEnumerable<GetClubRequestsDTO>>> GetPendingRequests()
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
        var requests = await _clubRequestsRepository.GetClubRequestsInformation();
        var pendingRequests = requests.Where(r => r.RequestStatus == RequestStatus.Pending).ToList();
        var result = _mapper.Map<List<GetClubRequestsDTO>>(pendingRequests);

        for (int i = 0; i < pendingRequests.Count; i++)
        {
            var request = pendingRequests[i];
            var dto = result[i];

            List<int> tagIds = [];

            if (!string.IsNullOrEmpty(request.TagIdsJson))
            {
                tagIds = JsonSerializer.Deserialize<List<int>>(request.TagIdsJson) ?? [];
            }

            var tags = await _tagsRepository.GetTagsByIdsAsync(tagIds);
            var tagDTOs = _mapper.Map<List<GetTagDTO>>(tags);
            dto.Tags = tagDTOs;
        }
        return Ok(result);
    }

    [HttpPut("{id}/status")]
    [Authorize]
    public async Task<IActionResult> UpdateRequestStatus(int id, [FromBody] UpdateClubRequestStatusDTO dto)
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
        var request = await _clubRequestsRepository.GetAsync(id);
        if (request == null)
            return NotFound("Club request not found.");

        request.RequestStatus = dto.Status;

        if (dto.Status == RequestStatus.Rejected)
        {
            request.RejectionReason = string.IsNullOrWhiteSpace(dto.RejectionReason)
                ? "No reason provided"
                : dto.RejectionReason;
        }
        else
        {
            request.RejectionReason = null;
        }

        await _clubRequestsRepository.UpdateAsync(request);
        return NoContent();
    }

    [HttpPut("edit-request/{id}")]
    [Authorize]
    public async Task<IActionResult> EditClubRequest(int id, [FromBody] EditClubRequestDTO dto)
    {
        var request = await _clubRequestsRepository.GetAsync(id);
        if (request == null)
            return NotFound("Club request not found.");

        request.Name = dto.Name;
        request.Description = dto.Description;

        await _clubRequestsRepository.UpdateAsync(request);
        return NoContent();
    }
    private async Task<bool> IsAdmin(User? user)
    {
        var roles = await _userManager.GetRolesAsync(user);
        return roles.Contains("Administrator");
    }

}
