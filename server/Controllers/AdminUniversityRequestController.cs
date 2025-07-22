using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
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
    public AdminUniversityRequestController(IMapper mapper, IUniversityRequestsRepository universityRequestsRepository)
    {
        _mapper = mapper;
        _universityRequestsRepository = universityRequestsRepository;
    }

    [HttpGet]
    [Authorize(Roles = "Administrator")]
    public async Task<ActionResult<IEnumerable<GetUniversityRequestsDTO>>> GetPendingRequests()
    {
        var requests = await _universityRequestsRepository.GetUniversityRequestsInformation();
        var pendingRequests = requests.Where(r => r.RequestStatus == RequestStatus.Pending).ToList();
        var result = _mapper.Map<List<GetUniversityRequestsDTO>>(pendingRequests);
        return Ok(result);
    }

    [HttpPut("{id}/status")]
    [Authorize(Roles = "Administrator")]
    public async Task<IActionResult> UpdateRequestStatus(int id, [FromBody] UpdateUniversityRequestStatusDTO updateUniversityRequestStatusDTO)
    {
        var request = await _universityRequestsRepository.GetAsync(id);
        if (request == null)
        {
            return NotFound("University request not found.");
        }

        request.RequestStatus = updateUniversityRequestStatusDTO.Status;

        if (updateUniversityRequestStatusDTO.Status == RequestStatus.Rejected)
        {
            request.RejectionReason = updateUniversityRequestStatusDTO.RejectionReason ?? "No reason provided";
        }
        else
        {
            request.RejectionReason = null;
        }
        await _universityRequestsRepository.UpdateAsync(request);
        return NoContent();
    }
}