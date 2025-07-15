
using Microsoft.EntityFrameworkCore;
using RateMyCollegeClub.Data;
using server.Models;

namespace RateMyCollegeClub.Repository;

public class ReviewVoteRepository : GenericRepository<ReviewVote>, IReviewVoteRepository
{
    private readonly CollegeClubsDbContext _context;
    public ReviewVoteRepository(CollegeClubsDbContext context) : base(context)
    {
        _context = context;
    }
    public async Task<List<ReviewVote>> GetVotesByUserForReviewsAsync(string userId, List<int> reviewIds)
    {
        return await _context.ReviewVotes
            .Where(v => v.UserId == userId && reviewIds.Contains(v.ReviewId))
            .ToListAsync();
    }

    public async Task<ReviewVote?> GetVoteByUserAndReviewAsync(string userId, int reviewId)
    {
        return await _context.ReviewVotes
        .FirstOrDefaultAsync(v => v.UserId == userId && v.ReviewId == reviewId);
    }
}