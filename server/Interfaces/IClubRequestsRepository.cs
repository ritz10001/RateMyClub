using RateMyCollegeClub.Data;
using RateMyCollegeClub.Models;

namespace RateMyCollegeClub.Interfaces;

public interface IClubRequestsRepository : IGenericRepository<ClubRequest>
{
    Task<List<ClubRequest>> GetClubRequestsInformation();
    Task<List<ClubRequest>> GetClubRequestByUser(string userId);
}