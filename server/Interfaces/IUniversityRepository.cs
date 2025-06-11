using RateMyCollegeClub.Models;
using System.Threading.Tasks;

namespace RateMyCollegeClub.Interfaces
{
    public interface IUniversityRepository : IGenericRepository<University>
    {
        Task<List<University>> GetUniversityDetails();
        Task<University> GetIndividualUniversityDetails(int id);
    }
}