

using RateMyCollegeClub.Models;

public static class RatingDistributionService
{
    public static Dictionary<int, int> Calculate(IEnumerable<Review> reviews)
    {
        var distribution = new Dictionary<int, int>
        {
            { 1, 0 },
            { 2, 0 },
            { 3, 0 },
            { 4, 0 },
            { 5, 0 }
        };

        foreach (var review in reviews)
        {
            var roundedRating = (int)Math.Round(review.OverallRating);
            distribution[roundedRating]++;
        }

        return distribution;
    }
}