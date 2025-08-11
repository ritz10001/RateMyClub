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
using RateMyCollegeClub.Models.Universities;

namespace RateMyCollegeClub.Controllers;

[ApiController]
[Route("api/[controller]")]

public class AdminUniversityController : ControllerBase
{
    private readonly IMapper _mapper;
    private readonly IUniversityRepository _universityRepository;
    private readonly IUniversityRequestsRepository _universityRequestsRepository;
    private readonly UserManager<User> _userManager;
    public AdminUniversityController(IMapper mapper, IUniversityRepository universityRepository, IUniversityRequestsRepository universityRequestsRepository, UserManager<User> userManager)
    {
        _mapper = mapper;
        _universityRepository = universityRepository;
        _universityRequestsRepository = universityRequestsRepository;
        _userManager = userManager;
    }

    [HttpPost]
    [Authorize]
    public async Task<ActionResult<CreateUniversityDTO>> CreateUniversity(CreateUniversityDTO createUniversityDTO)
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
        var university = _mapper.Map<University>(createUniversityDTO);
        await _universityRepository.AddAsync(university);
        return Ok(university);
    }

    [HttpPut("{id}")]
    [Authorize]
    public async Task<IActionResult> UpdateUniversity(int id, UpdateUniversityDTO updateUniversityDTO)
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
    [Authorize]
    public async Task<IActionResult> DeleteUniversity(int id)
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
        var university = await _universityRepository.GetAsync(id);
        if (university == null)
        {
            return NotFound();
        }

        await _universityRepository.DeleteAsync(id);
        return NoContent();
    }
    private async Task<bool> UniversityExists(int id)
    {
        return await _universityRepository.Exists(id);
    }
    private async Task<bool> IsAdmin(User? user)
    {
        var roles = await _userManager.GetRolesAsync(user);
        return roles.Contains("Administrator");
    }

}