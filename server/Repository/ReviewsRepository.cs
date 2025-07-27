using AutoMapper;
using Microsoft.EntityFrameworkCore;
using RateMyCollegeClub.Data;
using RateMyCollegeClub.Interfaces;
using RateMyCollegeClub.Models;

namespace RateMyCollegeClub.Repository;

public class ReviewsRepository : GenericRepository<Review>, IReviewsRepository
{
    private readonly CollegeClubsDbContext _context;
    public ReviewsRepository(CollegeClubsDbContext context) : base(context)
    {
        _context = context;
    }
    public async Task<List<Review>> GetReviewsByUserId(string userId)
    {
        return await _context.Reviews
        .Include(r => r.Club)
        .Include(r => r.Club.University)
        .Where(r => r.UserId == userId)
        .ToListAsync();
    }
    public async Task<ReviewFlag> FlagReviewAsync(ReviewFlag flag)
    {
        await _context.ReviewFlags.AddAsync(flag);
        return flag;
    }

    public async Task<int> GetReviewCountAsync(int clubId)
    {
        return await _context.Reviews
        .Where(r => r.ClubId == clubId)
        .CountAsync();
    }

}