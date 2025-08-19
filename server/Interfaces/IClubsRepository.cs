using RateMyCollegeClub.Models;
using RateMyCollegeClub.Models.Clubs;
using RateMyCollegeClub.Models.Reviews;
using RateMyCollegeClub.Utils;

namespace RateMyCollegeClub.Interfaces;

public interface IClubsRepository : IGenericRepository<Club>
{
    Task<List<Club>> GetClubDetails();
    Task<Club> GetIndividualClubDetails(int universityId, string slug);
    Task<Club?> GetIndividualClubDetails(int id);
    Task SaveChangesAsync();
    Task<HashSet<int>> GetBookmarkedClubIds(string userId);
    Task<List<Club>> GetPagedClubsAsync(int page, int pageSize, int universityId, string? search);
    Task<int> GetTotalClubCountAsync(int universityId, string? search);
    Task<PagedResult<Club>> GetPagedClubsForUniversity(int id, int page, int pageSize, string? search);
    Task<PaginatedReviewEntityResult> GetPaginatedReviewsForClub(int clubId, int page, int pageSize, string? userId);
    Task<Dictionary<int, int>> GetRatingDistributionForClub(int clubId);
    Task<decimal> GetAverageRatingForClub(int clubId);
    Task<CategoryAveragesDTO> GetCategoryAveragesForClubAsync(int clubId);
    Task<List<Club>> GetRecommendedClubsAsync(string userId, List<Tag> interests, List<SavedClub> savedClubs, int? schoolId);
    Task<List<Club>> GetPopularClubsAsync();
    Task<string> GenerateSlug(string name);
    Task<Club?> GetBySlugAsync(string slug);

}