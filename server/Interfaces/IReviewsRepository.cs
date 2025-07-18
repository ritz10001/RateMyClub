using RateMyCollegeClub.Models;

namespace RateMyCollegeClub.Interfaces;

public interface IReviewsRepository : IGenericRepository<Review>
{
    Task<List<Review>> GetReviewsByUserId(string userId);
    Task<ReviewFlag> FlagReviewAsync(ReviewFlag flag);
}