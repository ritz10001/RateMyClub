using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using RateMyCollegeClub.Interfaces;
using RateMyCollegeClub.Models;

namespace RateMyCollegeClub.Controllers;

[Route("api/[controller]")]
[ApiController]

public class TagController : ControllerBase
{
    private readonly IMapper _mapper;
    private readonly ITagsRepository _tagsRepository;

    public TagController(IMapper mapper, ITagsRepository tagsRepository)
    {
        _mapper = mapper;
        _tagsRepository = tagsRepository;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<GetTagDTO>>> GetAllTags()
    {
        Console.WriteLine("ENTERED");
        var tags = await _tagsRepository.GetAllAsync();
        foreach (var tag in tags)
        {
            Console.WriteLine(tag.Name);
        }
        var result = _mapper.Map<List<GetTagDTO>>(tags);
        return Ok(result);
    }
}

