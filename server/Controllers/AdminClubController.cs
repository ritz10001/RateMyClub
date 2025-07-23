using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
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

    public AdminClubController(IMapper mapper, IClubsRepository clubsRepository, ITagsRepository tagsRepository, IClubRequestsRepository clubRequestsRepository)
    {
        _mapper = mapper;
        _clubsRepository = clubsRepository;
        _tagsRepository = tagsRepository;
        _clubRequestsRepository = clubRequestsRepository;
    }

    [HttpPost]
    [Authorize(Roles = "Administrator")]
    public async Task<ActionResult<CreateClubDTO>> CreateClub(CreateClubDTO createClubDTO)
    {

        var club = _mapper.Map<Club>(createClubDTO);
        if (createClubDTO.TagIds != null && createClubDTO.TagIds.Any())
        {
            var tags = await _tagsRepository.GetTagsByIdsAsync(createClubDTO.TagIds);
            club.Tags = tags;
        }
        await _clubsRepository.AddAsync(club);
        return Ok();
    }

    [HttpPut("{id}")]
    [Authorize(Roles = "Administrator")]
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

}