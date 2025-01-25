using RateMyCollegeClub.Data;
using RateMyCollegeClub.Models;

namespace RateMyCollegeClub.Interfaces;

public interface ICategoriesRepository : IGenericRepository<Category> {
    public Task<Category> GetIndividualCategoryDetails(int id);
}