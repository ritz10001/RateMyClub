using AutoMapper;
using Microsoft.AspNetCore.Http;
using RateMyCollegeClub.Models;
using RateMyCollegeClub.Models.Clubs;

public class CurrentUserVoteResolver : IValueResolver<Review, GetReviewDTO, int>
{
    private readonly IHttpContextAccessor _httpContextAccessor;

    public CurrentUserVoteResolver(IHttpContextAccessor httpContextAccessor)
    {
        _httpContextAccessor = httpContextAccessor;
    }

    public int Resolve(Review source, GetReviewDTO destination, int destMember, ResolutionContext context)
    {
        var userId = _httpContextAccessor.HttpContext?.User?
            .FindFirst(c => c.Type == "uid")?.Value;
        
        if (string.IsNullOrEmpty(userId))
            return 0;

        return source.Votes?.FirstOrDefault(v => v.UserId == userId)?.Value ?? 0;
    }
}