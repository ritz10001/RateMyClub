using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using RateMyCollegeClub.Interfaces;
using RateMyCollegeClub.Models;
using RateMyCollegeClub.Models.Universities;

namespace RateMyCollegeClub.Controllers;

[ApiController]
[Route("api/[controller]")]

public class AdminUniversityController : ControllerBase
{
    private readonly IMapper _mapper;
    private readonly IUniversityRepository _universityRepository;
    public AdminUniversityController(IMapper mapper, IUniversityRepository universityRepository)
    {
        _mapper = mapper;
        _universityRepository = universityRepository;
    }

    [HttpPost]
    [Authorize(Roles = "Administrator")]
    public async Task<ActionResult<CreateUniversityDTO>> CreateUniversity(CreateUniversityDTO createUniversityDTO)
    {
        var university = _mapper.Map<University>(createUniversityDTO);
        await _universityRepository.AddAsync(university);
        return Ok(university);
    }

}