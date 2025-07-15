

using RateMyCollegeClub.Interfaces;
using server.Models;

public interface IReviewVoteRepository : IGenericRepository<ReviewVote>
{
    Task<ReviewVote> GetVoteByUserAndReviewAsync(string userId, int reviewId);
}