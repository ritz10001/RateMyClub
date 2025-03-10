using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using RateMyCollegeClub.Models;

namespace RateMyCollegeClub.Data.Configurations;

public class ClubConfiguration : IEntityTypeConfiguration<Club>
{
    public void Configure(EntityTypeBuilder<Club> builder)
    {
        builder.HasData(
            new Club 
            {
                Id = 1, 
                Name = "Tech Robotics Association", 
                Description = "Robotics Club", 
                IsActive = true,
                ClubLocation = "Engineering Center Basement, Room 100",
                CategoryId = 1,
                UniversityId = 1
            },
            new Club 
            {
                Id = 2, 
                Name = "Google Development Student Club", 
                Description = "Software Engineering Club", 
                IsActive = true,
                ClubLocation = "Livermore Center, Room 101",
                CategoryId = 1,
                UniversityId = 1
            },
            new Club 
            {
                Id = 3, 
                Name = "Chess Club", 
                Description = "A club for playing chess", 
                IsActive = true,
                ClubLocation = "The SUB, Second floor, Room 237.",
                CategoryId = 2,
                UniversityId = 1
            }
        );
    }
}