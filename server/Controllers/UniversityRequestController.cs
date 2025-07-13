using System.Text.Json;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
using RateMyCollegeClub.Data;
using RateMyCollegeClub.Interfaces;
using RateMyCollegeClub.Models;
using RateMyCollegeClub.Models.Requests;
using RateMyCollegeClub.Models.Users;

namespace RateMyCollegeClub.Controllers;

[Route("api/[controller]")]
[ApiController]

public class UniversityRequestController : ControllerBase
{
    private readonly IMapper _mapper;
    private readonly IUniversityRequestsRepository _universityRequestsRepository;
    public UniversityRequestController(IMapper mapper, IUniversityRequestsRepository universityRequestsRepository)
    {
        _mapper = mapper;
        _universityRequestsRepository = universityRequestsRepository;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<GetUniversityRequestDTO>>> GetAllRequests()
    {
        var requests = await _universityRequestsRepository.GetUniversityRequestsInformation();
        var result = _mapper.Map<List<GetUniversityRequestDTO>>(requests);
        return Ok(result);
    }
    [HttpPost]
    public async Task<IActionResult> CreateRequest(UniversityRequestDTO universityRequestDTO)
    {
        var request = _mapper.Map<UniversityRequest>(universityRequestDTO);
        request.UserId = GetUserId();
        await _universityRequestsRepository.AddAsync(request);
        return Ok(request);
    }
    private string? GetUserId()
    {
        return User.Claims.FirstOrDefault(c => c.Type == "uid")?.Value;
    }
    
    
}