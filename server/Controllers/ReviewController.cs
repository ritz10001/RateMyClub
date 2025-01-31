using System.ComponentModel;
using System.Diagnostics;
using System.Security.Claims;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
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

public class ReviewController : ControllerBase {
    private readonly IMapper _mapper;
    private readonly IReviewsRepository _reviewsRepository;

    public ReviewController(IMapper mapper, IReviewsRepository reviewsRepository)
    {
        _mapper = mapper;
        _reviewsRepository = reviewsRepository;
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Review>> GetReview(int id) {
        var review = await _reviewsRepository.GetAsync(id);
        
        if(review is null){
            return NotFound();
        }
        return Ok(review);
    }

    [HttpPost]
    [Authorize]
    public async Task<ActionResult<CreateReviewDTO>> CreateReview(CreateReviewDTO createReviewDTO) {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        Console.WriteLine("-----------------------------------------------------");
        Console.WriteLine("HERE IS THE USER ID");
        Console.WriteLine(userId);
        if (userId == null) {
            return Unauthorized();
        }

        var review = _mapper.Map<Review>(createReviewDTO);
        review.UserId = userId;

        await _reviewsRepository.AddAsync(review);
        return CreatedAtAction("GetReview", new {id = review.Id}, review);
    }

    [HttpDelete("{id}")]
    [Authorize]
    public async Task<IActionResult> DeleteReview(int id){
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if(userId == null){
            return Unauthorized();
        }
        var review = await _reviewsRepository.GetAsync(id);

        if(review is null){
            return NotFound();
        }
        if(review.UserId != userId){
            return Forbid();
        }

        await _reviewsRepository.DeleteAsync(id);

        return NoContent();
    }

    [HttpPut("{id}")]
    [Authorize]
    public async Task<IActionResult> UpdateReview(int id, UpdateReviewDTO updateReviewDTO){
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if(userId == null){
            return Unauthorized();
        }
        var review = await _reviewsRepository.GetAsync(id);

        if(review is null){
            return NotFound();
        }
        if(review.UserId != userId){
            return Forbid();
        }

        _mapper.Map(updateReviewDTO, review);
        
        try{
            await _reviewsRepository.UpdateAsync(review);
        }
        catch(DbUpdateConcurrencyException){
            if(!await ReviewExists(id)){
                return NotFound();
            }
            else{
                throw;
            }
        }

        return NoContent();
    }

    private async Task<bool> ReviewExists(int id){
        return await _reviewsRepository.Exists(id);
    }

}
