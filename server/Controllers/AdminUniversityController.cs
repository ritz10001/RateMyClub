using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RateMyCollegeClub.Interfaces;
using RateMyCollegeClub.Models;
using RateMyCollegeClub.Models.Requests;
using RateMyCollegeClub.Models.Requests.UniversityRequests;
using RateMyCollegeClub.Models.Universities;

namespace RateMyCollegeClub.Controllers;

[ApiController]
[Route("api/[controller]")]

public class AdminUniversityController : ControllerBase
{
    private readonly IMapper _mapper;
    private readonly IUniversityRepository _universityRepository;
    private readonly IUniversityRequestsRepository _universityRequestsRepository;
    public AdminUniversityController(IMapper mapper, IUniversityRepository universityRepository, IUniversityRequestsRepository universityRequestsRepository)
    {
        _mapper = mapper;
        _universityRepository = universityRepository;
        _universityRequestsRepository = universityRequestsRepository;
    }

    [HttpPost]
    [Authorize(Roles = "Administrator")]
    public async Task<ActionResult<CreateUniversityDTO>> CreateUniversity(CreateUniversityDTO createUniversityDTO)
    {
        var university = _mapper.Map<University>(createUniversityDTO);
        await _universityRepository.AddAsync(university);
        return Ok(university);
    }

    [HttpPut("{id}")]
    [Authorize(Roles = "Administrator")]
    public async Task<IActionResult> UpdateUniversity(int id, UpdateUniversityDTO updateUniversityDTO)
    {
        var university = await _universityRepository.GetAsync(id);
        if (university == null)
        {
            return NotFound();
        }

        _mapper.Map(updateUniversityDTO, university);

        try
        {
            await _universityRepository.UpdateAsync(university);
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!await UniversityExists(id))
            {
                return NotFound();
            }
            else
            {
                throw;
            }
        }
        return NoContent();
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "Administrator")]
    public async Task<IActionResult> DeleteUniversity(int id)
    {
        var university = await _universityRepository.GetAsync(id);
        if (university == null)
        {
            return NotFound();
        }

        await _universityRepository.DeleteAsync(id);
        return NoContent();
    }

    [HttpPut("edit-request/{id}")]
    [Authorize(Roles = "Administrator")]
    public async Task<IActionResult> EditUniversityRequest(int id, [FromBody] EditUniversityRequestDTO dto)
    {
        var request = await _universityRequestsRepository.GetAsync(id);
        if (request == null) return NotFound();

        request.UniversityName = dto.UniversityName;
        request.Location = dto.Location;
        request.OfficialWebsite = dto.OfficialWebsite;

        await _universityRequestsRepository.UpdateAsync(request);
        return NoContent();
    }

    private string GetUserId()
    {
        return User.Claims.FirstOrDefault(c => c.Type == "uid")?.Value ?? string.Empty;
    }
    private async Task<bool> UniversityExists(int id)
    {
        return await _universityRepository.Exists(id);
    }

}