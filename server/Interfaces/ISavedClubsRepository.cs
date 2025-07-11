using Microsoft.AspNetCore.Mvc;
using RateMyCollegeClub.Models;
using RateMyCollegeClub.Models.SavedClubs;

namespace RateMyCollegeClub.Interfaces;

public interface ISavedClubsRepository : IGenericRepository<SavedClub>
{
    public Task<List<SavedClub>> GetSavedClubDetails(string userId);
}

