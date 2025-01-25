using Microsoft.EntityFrameworkCore;
using RateMyCollegeClub.Data;
using RateMyCollegeClub.Interfaces;
using RateMyCollegeClub.Models;

namespace RateMyCollegeClub.Repository;

public class CategoriesRepository : GenericRepository<Category>, ICategoriesRepository {
    private readonly CollegeClubsDbContext _context;
    public CategoriesRepository(CollegeClubsDbContext context) : base(context)
    {
        _context = context;
    }

    public async Task<Category> GetIndividualCategoryDetails(int id){
        return await _context.Category
        .Include(q => q.Clubs)
        .FirstOrDefaultAsync(q => q.Id == id);
    }
}