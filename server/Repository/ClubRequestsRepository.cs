using Microsoft.EntityFrameworkCore;
using RateMyCollegeClub.Data;
using RateMyCollegeClub.Interfaces;
using RateMyCollegeClub.Models;

namespace RateMyCollegeClub.Repository;

public class ClubRequestsRepository : GenericRepository<ClubRequest>, IClubRequestsRepository
{
    private readonly CollegeClubsDbContext _context;
    public ClubRequestsRepository(CollegeClubsDbContext context) : base(context)
    {
        _context = context;
    }
}