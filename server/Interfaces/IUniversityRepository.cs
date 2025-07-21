using RateMyCollegeClub.Data;
using RateMyCollegeClub.Models;
using RateMyCollegeClub.Models.Requests;

namespace RateMyCollegeClub.Interfaces;

public interface IUniversityRepository : IGenericRepository<University>
{
    Task<List<University>> GetUniversityDetails();
    Task<University> GetIndividualUniversityDetails(int id);
    Task<List<University>> SearchByNameAsync(string query);
}