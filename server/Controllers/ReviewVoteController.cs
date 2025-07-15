
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RateMyCollegeClub.Data;
using RateMyCollegeClub.Interfaces;
using RateMyCollegeClub.Models;
using server.Models;

namespace server.Controllers;

[Route("api/[controller]")]
[ApiController]

public class ReviewVoteController : ControllerBase
{
    private readonly IReviewVoteRepository _reviewVoteRepository;
    public ReviewVoteController(IReviewVoteRepository reviewVoteRepository)
    {
        _reviewVoteRepository = reviewVoteRepository;
    }
    public async Task<IActionResult> Vote([FromBody] ReviewVoteDTO reviewVoteDTO)
    {
        var userId = GetUserId();
        var existingVote = await _reviewVoteRepository.GetVoteByUserAndReviewAsync(userId, reviewVoteDTO.ReviewId);

        if (existingVote == null)
        {
            var vote = new ReviewVote
            {
                ReviewId = reviewVoteDTO.ReviewId,
                UserId = userId,
                Value = reviewVoteDTO.Value
            };
            await _reviewVoteRepository.DeleteAsync(vote.Id);
        }
        else
        {
            // Update or cancel vote
            if (reviewVoteDTO.Value == 0)
            {
                await _reviewVoteRepository.DeleteAsync(existingVote.Id);
            }
            else
            {
                existingVote.Value = reviewVoteDTO.Value;
            }
        }
        return Ok();
    }
    
    private string? GetUserId()
    {
        return User.Claims.FirstOrDefault(c => c.Type == "uid")?.Value;
    }
}