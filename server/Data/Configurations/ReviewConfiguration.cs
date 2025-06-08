using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using RateMyCollegeClub.Models;

namespace RateMyCollegeClub.Data.Configurations;

public class ReviewConfiguration : IEntityTypeConfiguration<Review>
{
    public void Configure(EntityTypeBuilder<Review> builder)
    {
        builder.HasData(
            new Review
            {
                Id = 1,
                LeadershipRating = 2,
                InclusivityRating = 4,
                NetworkingRating = 3,
                SkillsDevelopmentRating = 5,
                Comment = "It's a good club overall. Friendly people in general.",
                ClubId = 1
            },
            new Review
            {
                Id = 2,
                LeadershipRating = 4,
                InclusivityRating = 5,
                NetworkingRating = 2,
                SkillsDevelopmentRating = 4,
                Comment = "Plenty of volunteering opportunities. One of the highlights about the club is the annual VEX U competitions.",
                ClubId = 1
            },
            new Review
            {
                Id = 3,
                LeadershipRating = 4,
                InclusivityRating = 2,
                NetworkingRating = 5,
                SkillsDevelopmentRating = 3,
                Comment = "The GDSC club has its ups and downs. Networking is one of its prime benefits.",
                ClubId = 2
            }
        );
    }
}