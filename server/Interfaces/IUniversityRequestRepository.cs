using RateMyCollegeClub.Data;
using RateMyCollegeClub.Models;
using RateMyCollegeClub.Models.Requests;

namespace RateMyCollegeClub.Interfaces;

public interface IUniversityRequestsRepository : IGenericRepository<UniversityRequest>
{
    Task<List<UniversityRequest>> GetUniversityRequestsInformation(); 
}