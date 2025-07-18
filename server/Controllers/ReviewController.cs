using System.ComponentModel;
using System.Diagnostics;
using System.Security.Claims;
using System.Text;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RateMyCollegeClub.Data;
using RateMyCollegeClub.Interfaces;
using RateMyCollegeClub.Models;
using RateMyCollegeClub.Models.Clubs;
using RateMyCollegeClub.Models.Reviews;

namespace RateMyCollegeClub.Controllers;

[Route("api/[controller]")]
[ApiController]

public class ReviewController : ControllerBase
{
    private readonly IMapper _mapper;
    private readonly IReviewsRepository _reviewsRepository;
    private readonly UserManager<User> _userManager;

    public ReviewController(IMapper mapper, IReviewsRepository reviewsRepository)
    {
        _mapper = mapper;
        _reviewsRepository = reviewsRepository;
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Review>> GetReview(int id)
    {
        Console.WriteLine("ENTERED GET ENDPOINT");
        var review = await _reviewsRepository.GetAsync(id);

        if (review is null)
        {
            return NotFound();
        }
        return Ok(review);
    }

    [HttpGet("mine")]
    public async Task<ActionResult<IEnumerable<GetMyReviewsDTO>>> GetMyReviews()
    {
        var userId = GetUserId();
        var reviews = await _reviewsRepository.GetReviewsByUserId(userId);
        var reviewDTOs = _mapper.Map<List<GetMyReviewsDTO>>(reviews);
        return Ok(reviewDTOs);
    }

    [HttpPost]
    // [Authorize(Roles = "User, Administrator")]
    public async Task<ActionResult<CreateReviewDTO>> CreateReview(CreateReviewDTO createReviewDTO)
    {
        var userId = GetUserId();

        var review = _mapper.Map<Review>(createReviewDTO);
        review.UserId = userId;

        await _reviewsRepository.AddAsync(review);
        return CreatedAtAction("GetReview", new { id = review.Id }, review);
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "User, Administrator")]
    public async Task<IActionResult> DeleteReview(int id)
    {
        var review = await _reviewsRepository.GetAsync(id);

        if (review is null)
        {
            return NotFound();
        }

        var userId = GetUserId();

        if (string.IsNullOrEmpty(userId))
        {
            return Unauthorized();
        }
        var isAdmin = GetUserRoles().Contains("Administrator");

        if (review.UserId != userId && !isAdmin)
        {
            return Forbid();
        }

        await _reviewsRepository.DeleteAsync(id);

        return NoContent();
    }

    [HttpPut("{id}")]
    [Authorize(Roles = "User, Administrator")]
    public async Task<IActionResult> UpdateReview(int id, UpdateReviewDTO updateReviewDTO)
    {
        Console.WriteLine("--------------------------------------");
        Console.WriteLine("ENTERED THIS METHOD");
        Console.WriteLine("--------------------------------------");
        var review = await _reviewsRepository.GetAsync(id);

        if (review is null)
        {
            return NotFound();
        }

        var userId = GetUserId();

        foreach (var claim in User.Claims)
        {
            Console.WriteLine($"Claim type: {claim.Type}, value: {claim.Value}");
        }

        var roles = User.FindAll(ClaimTypes.Role).Select(c => c.Value);
        Console.WriteLine("Roles found:");
        foreach (var r in roles)
        {
            Console.WriteLine(r);
        }

        if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized();
            }

        var isAdmin = GetUserRoles().Contains("Administrator");

        if (review.UserId != userId && !isAdmin)
        {
            return Forbid();
        }

        _mapper.Map(updateReviewDTO, review);

        try
        {
            await _reviewsRepository.UpdateAsync(review);
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!await ReviewExists(id))
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

    [HttpPost("{id}/flag")]
    public async Task<IActionResult> FlagReview(int id, FlagReviewDTO flagReviewDTO)
    {
        var userId = GetUserId();
        var review = await _reviewsRepository.GetAsync(id);
        if (review == null)
        {
            return NotFound("Review not found");
        }
        var flag = new ReviewFlag
        {
            ReviewId = id,
            UserId = userId,
            Reason = flagReviewDTO.Reason
        };

        await _reviewsRepository.FlagReviewAsync(flag);
        return Ok();
    }

    private async Task<bool> ReviewExists(int id)
    {
        return await _reviewsRepository.Exists(id);
    }

    private string? GetUserId()
    {
        return User.Claims.FirstOrDefault(c => c.Type == "uid")?.Value;
    }
    private List<string> GetUserRoles() {
        var roles = User.Claims.Where(c => c.Type == ClaimTypes.Role).Select(c => c.Value).ToList();
        return roles;
    }

}
