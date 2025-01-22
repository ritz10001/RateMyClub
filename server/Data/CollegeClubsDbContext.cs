using Microsoft.EntityFrameworkCore;

namespace RateMyCollegeClub.Data;

class CollegeClubsDbContext : DbContext{
    public CollegeClubsDbContext(DbContextOptions options) : base(options)
    {
        
    }
}