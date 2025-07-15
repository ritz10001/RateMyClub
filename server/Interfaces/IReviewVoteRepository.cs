

using RateMyCollegeClub.Interfaces;
using server.Models;

public interface IReviewVoteRepository : IGenericRepository<ReviewVote>
{
    Task<ReviewVote> GetVoteByUserAndReviewAsync(string userId, int reviewId);
    Task<List<ReviewVote>> GetVotesByUserForReviewsAsync(string userId, List<int> reviewIds);
}