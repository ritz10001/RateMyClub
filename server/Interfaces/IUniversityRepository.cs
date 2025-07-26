using RateMyCollegeClub.Data;
using RateMyCollegeClub.Models;
using RateMyCollegeClub.Models.Requests;

namespace RateMyCollegeClub.Interfaces;

public interface IUniversityRepository : IGenericRepository<University>
{
    Task<List<University>> GetUniversityDetails();
    Task<University> GetIndividualUniversityDetails(int id);
    Task<List<University>> SearchByNameAsync(string query);
    Task<List<University>> GetPagedUniversitiesAsync(int page, int pageSize, string? search);
    Task<int> GetTotalUniversityCountAsync(string? search);
}