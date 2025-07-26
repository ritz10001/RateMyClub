using RateMyCollegeClub.Models;
using RateMyCollegeClub.Utils;

namespace RateMyCollegeClub.Interfaces;

public interface IClubsRepository : IGenericRepository<Club>
{
    Task<List<Club>> GetClubDetails();
    Task<Club> GetIndividualClubDetails(int id);
    Task SaveChangesAsync();
    Task<HashSet<int>> GetBookmarkedClubIds(string userId);
    Task<List<Club>> GetPagedClubsAsync(int page, int pageSize, int universityId, string? search);
    Task<int> GetTotalClubCountAsync(int universityId, string? search);
    Task<PagedResult<Club>> GetPagedClubsForUniversity(int id, int page, int pageSize, string? search);
}