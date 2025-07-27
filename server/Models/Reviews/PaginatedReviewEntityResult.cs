using RateMyCollegeClub.Models;
using server.Models;

public class PaginatedReviewEntityResult
{
    public List<Review> Items { get; set; }
    public List<ReviewVote> UserVotes { get; set; }
    public int TotalCount { get; set; }
    public int Page { get; set; }
    public int PageSize { get; set; }
}
