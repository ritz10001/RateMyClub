using Microsoft.AspNetCore.Mvc;
using RateMyCollegeClub.Models;
using RateMyCollegeClub.Models.SavedClubs;

namespace RateMyCollegeClub.Interfaces;

public interface ISavedClubsRepository : IGenericRepository<SavedClub>
{
    public Task<List<SavedClub>> GetSavedClubDetails(string userId);
    public Task<bool> IsBookmarked(int clubId, string userId);
    public Task<SavedClub?> GetSavedClubById(int clubId, string userId);
}

