using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using RateMyCollegeClub.Models;

namespace RateMyCollegeClub.Data.Configurations;

public class UniversityConfiguration : IEntityTypeConfiguration<University>
{
    public void Configure(EntityTypeBuilder<University> builder)
    {
        builder.HasData(
            new University
            {
                Id = 1,
                Name = "Texas Tech University",
                Location = "Lubbock, TX"
            },
            new University
            {
                Id = 2,
                Name = "University of Texas at Dallas",
                Location = "Dallas, TX"
            }
        );
    }
}