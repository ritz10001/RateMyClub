using Microsoft.EntityFrameworkCore;
using RateMyCollegeClub.Models;
using Microsoft.EntityFrameworkCore.Diagnostics;
using System.Diagnostics;

namespace RateMyCollegeClub.Data;

public class CollegeClubsDbContext : DbContext{
    public CollegeClubsDbContext(DbContextOptions options) : base(options)
    {
        
    }
    public DbSet<Club> Clubs { get; set; }
    public DbSet<Category> Category { get; set; }
    public DbSet<Review> Reviews { get; set; }
    public DbSet<SavedClub> SavedClubs { get; set; }
    public DbSet<University> University { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        optionsBuilder.ConfigureWarnings(warnings => {
            warnings.Ignore(RelationalEventId.PendingModelChangesWarning);
        });
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        modelBuilder.Entity<Category>().HasData(
            new Category
            {
                Id = 1,
                Name = "Technology",
                Description = "Clubs related to technology. Includes Computer Science, Computer and Electrical Engineering."
            },
            new Category
            {
                Id = 2,
                Name = "Sports",
                Description = "Clubs related to Sports. Includes physical and mental sports."
            }
        );
        modelBuilder.Entity<Club>().HasData(
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
        modelBuilder.Entity<Review>().HasData(
            new Review
            {
                Id = 1,
                LeadershipRating = 2,
                InclusivityRating = 4,
                NetworkingRating = 3,
                SkillsDevelopmentRating = 5,
                OverallRating = 4,
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
                OverallRating = 4,
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
                OverallRating = 3,
                Comment = "The GDSC club has its ups and downs. Networking is one of its prime benefits.",
                ClubId = 2
            }
        );
        modelBuilder.Entity<University>().HasData(
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