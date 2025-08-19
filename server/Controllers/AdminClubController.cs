using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RateMyCollegeClub.Data;
using RateMyCollegeClub.Interfaces;
using RateMyCollegeClub.Models;
using RateMyCollegeClub.Models.Clubs;
using RateMyCollegeClub.Models.Requests;
using RateMyCollegeClub.Models.Requests.ClubRequests;
using RateMyCollegeClub.Models.Universities;

namespace RateMyCollegeClub.Controllers;

[ApiController]
[Route("api/[controller]")]

public class AdminClubController : ControllerBase
{
    private readonly IMapper _mapper;
    private readonly IClubsRepository _clubsRepository;
    private readonly ITagsRepository _tagsRepository;
    private readonly IClubRequestsRepository _clubRequestsRepository;
    private readonly UserManager<User> _userManager;

    public AdminClubController(IMapper mapper, IClubsRepository clubsRepository, ITagsRepository tagsRepository, IClubRequestsRepository clubRequestsRepository, UserManager<User> userManager)
    {
        _mapper = mapper;
        _clubsRepository = clubsRepository;
        _tagsRepository = tagsRepository;
        _clubRequestsRepository = clubRequestsRepository;
        _userManager = userManager;
    }

    [HttpPost]
    [Authorize]
    public async Task<ActionResult<CreateClubDTO>> CreateClub(CreateClubDTO createClubDTO)
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
        var club = _mapper.Map<Club>(createClubDTO);
        if (createClubDTO.TagIds != null && createClubDTO.TagIds.Any())
        {
            var tags = await _tagsRepository.GetTagsByIdsAsync(createClubDTO.TagIds);
            club.Tags = tags;
        }
        var slug = await _clubsRepository.GenerateSlug(club.Name);
        var exists = await _clubsRepository.GetBySlugAsync(slug);
        if (exists != null)
        {
            return Conflict("A club with this slug already exists.");
        }
        club.Slug = slug;
        await _clubsRepository.AddAsync(club);
        return Ok();
    }
    [HttpDelete("{id}")]
    [Authorize]
    public async Task<IActionResult> DeleteClub(int id)
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
        var club = await _clubsRepository.GetAsync(id);

        if (club is null)
        {
            return NotFound();
        }

        await _clubsRepository.DeleteAsync(id);

        return NoContent();
    }

    [HttpPut("{id}")]
    [Authorize]
    public async Task<IActionResult> UpdateClub(int id, UpdateClubDTO updateClubDTO)
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

        var club = await _clubsRepository.GetIndividualClubDetails(id);

        if (club is null)
        {
            return NotFound();
        }

        club.Tags.Clear();

        if (updateClubDTO.TagIds != null && updateClubDTO.TagIds.Any())
        {
            var tags = await _tagsRepository.GetTagsByIdsAsync(updateClubDTO.TagIds);
            foreach (var tag in tags)
            {
                club.Tags.Add(tag);
            }
        }

        _mapper.Map(updateClubDTO, club);

        try
        {
            await _clubsRepository.UpdateAsync(club);
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!await ClubExists(id))
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

    [HttpPatch("{id}")]
    [Authorize]
    public async Task<IActionResult> PatchClub(int id, [FromBody] PatchClubDTO patchClubDTO)
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
        var club = await _clubsRepository.GetAsync(id);
        if (club is null) return NotFound();
        if (patchClubDTO.Name != null) club.Name = patchClubDTO.Name;
        if (patchClubDTO.Description != null) club.Description = patchClubDTO.Description;
        if (patchClubDTO.ClubLocation != null) club.ClubLocation = patchClubDTO.ClubLocation;
        if (patchClubDTO.IsActive.HasValue) club.IsActive = patchClubDTO.IsActive.Value;
        if (patchClubDTO.CategoryId.HasValue) club.CategoryId = patchClubDTO.CategoryId.Value;
        if (patchClubDTO.LogoUrl != null) club.LogoUrl = patchClubDTO.LogoUrl;
        if (patchClubDTO.TagIds != null)
        {
            // Clear old tags and add new ones, or whatever your tag logic is
            club.Tags.Clear();
            foreach (var tagId in patchClubDTO.TagIds)
            {
                var tag = await _tagsRepository.GetAsync(tagId);
                if (tag == null)
                {
                    return BadRequest($"Tag with ID {tagId} not found.");
                }
                club.Tags.Add(tag);
            }
        }
        await _clubsRepository.SaveChangesAsync();
        return NoContent();
    }
    private async Task<bool> ClubExists(int id)
    {
        return await _clubsRepository.Exists(id);
    }
    private async Task<bool> IsAdmin(User? user)
    {
        var roles = await _userManager.GetRolesAsync(user);
        return roles.Contains("Administrator");
    }

}