using RateMyCollegeClub.Models;

namespace RateMyCollegeClub.Interfaces;

public interface IClubsRepository : IGenericRepository<Club>
{
    Task<List<Club>> GetClubDetails();
    Task<Club> GetIndividualClubDetails(int id);
    Task SaveChangesAsync();
    Task<HashSet<int>> GetBookmarkedClubIds(string userId);
    // Task<List<Club>> GetClubsByFilters(List<string> tags);
}