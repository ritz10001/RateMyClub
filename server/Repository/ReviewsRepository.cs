using AutoMapper;
using RateMyCollegeClub.Data;
using RateMyCollegeClub.Interfaces;
using RateMyCollegeClub.Models;

namespace RateMyCollegeClub.Repository;

public class ReviewsRepository : GenericRepository<Review>, IReviewsRepository {
    private readonly CollegeClubsDbContext _context;
    public ReviewsRepository(CollegeClubsDbContext context) : base(context)
    {        
        _context = context;
    }
}