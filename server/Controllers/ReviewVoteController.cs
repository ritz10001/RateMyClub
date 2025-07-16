
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
    private readonly IReviewsRepository _reviewsRepository;
    public ReviewVoteController(IReviewVoteRepository reviewVoteRepository, IReviewsRepository reviewsRepository)
    {
        _reviewVoteRepository = reviewVoteRepository;
        _reviewsRepository = reviewsRepository;
    }

    [HttpPost]
    [Authorize(Roles = "User, Administrator")]
    public async Task<IActionResult> Vote([FromBody] ReviewVoteDTO reviewVoteDTO)
    {
        var userId = GetUserId();
        if (string.IsNullOrEmpty(userId))
        {
            return Unauthorized();
        }

        var existingVote = await _reviewVoteRepository.GetVoteByUserAndReviewAsync(userId, reviewVoteDTO.ReviewId);
        var review = await _reviewsRepository.GetAsync(reviewVoteDTO.ReviewId);
        
        if (review == null)
        {
            return NotFound("Review not found");
        }

        int scoreChange = 0;
        int newVoteValue = reviewVoteDTO.Value;

        if (existingVote == null)
        {
            if (newVoteValue != 0)
            {
                var vote = new ReviewVote
                {
                    ReviewId = reviewVoteDTO.ReviewId,
                    UserId = userId,
                    Value = newVoteValue
                };
                await _reviewVoteRepository.AddAsync(vote);
                scoreChange = newVoteValue;
            }
        }
        else
        {
            if (newVoteValue == 0)
            {
                scoreChange = -existingVote.Value;
                await _reviewVoteRepository.DeleteAsync(existingVote.Id);
            }
            else if (existingVote.Value != newVoteValue)
            {
                scoreChange = newVoteValue - existingVote.Value;
                existingVote.Value = newVoteValue;
                await _reviewVoteRepository.UpdateAsync(existingVote);
            }
        }

        review.NetScore += scoreChange;
        await _reviewsRepository.UpdateAsync(review);

        // Return the exact values the frontend expects
        return Ok(new { 
            newVoteValue = newVoteValue, // The vote value we stored
            newNetScore = review.NetScore // The new total score
        });
    }
        
    private string? GetUserId()
    {
        return User.Claims.FirstOrDefault(c => c.Type == "uid")?.Value;
    }
}