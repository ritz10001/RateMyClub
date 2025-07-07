using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RateMyCollegeClub.Data;
using RateMyCollegeClub.Interfaces;
using RateMyCollegeClub.Models;
using RateMyCollegeClub.Models.Categories;
using RateMyCollegeClub.Models.Universities;

namespace RateMyCollegeClub.Controllers;

[Route("api/[controller]")]
[ApiController]

public class UniversityController : ControllerBase
{
    private readonly IMapper _mapper;
    private readonly IUniversityRepository _universityRepository;
    public UniversityController(IMapper mapper, IUniversityRepository universityRepository)
    {
        _mapper = mapper;
        _universityRepository = universityRepository;
    }

    [HttpGet]
    [Route("all-colleges")]
    public async Task<ActionResult<IEnumerable<GetUniversitiesDTO>>> GetUniversities()
    {
        var universities = await _universityRepository.GetUniversityDetails();
        var universitiesDTO = _mapper.Map<List<GetUniversitiesDTO>>(universities);
        return Ok(universitiesDTO);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<GetUniversityDTO>> GetUniversity(int id)
    {
        var university = await _universityRepository.GetIndividualUniversityDetails(id);

        if (university is null)
        {
            return NotFound();
        }

        var universityDTO = _mapper.Map<GetUniversityDTO>(university);

        return Ok(universityDTO);
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

    [HttpPut("{id}")]
    [Authorize(Roles = "Administrator")]
    public async Task<IActionResult> UpdateUniversity(int id, UpdateUniversityDTO updateUniversityDTO)
    {
        if (id != updateUniversityDTO.Id)
        {
            return BadRequest("University ID mismatch.");
        }

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
    
    private async Task<bool> UniversityExists(int id)
    {
        return await _universityRepository.Exists(id);
    }
}