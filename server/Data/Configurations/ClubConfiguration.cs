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
                Id = 7,
                Name = "Association for Computing Machinery", 
                Description = "", 
                IsActive = true,
                ClubLocation = "Engineering Center Basement, Room 100",
                CategoryId = 1,
                UniversityId = 1
            },
            new Club 
            {
                Id = 8,
                Name = "Society of Women Engineers", 
                Description = "Software Engineering Club", 
                IsActive = true,
                ClubLocation = "Livermore Center, Room 101",
                CategoryId = 1,
                UniversityId = 1
            },
            new Club 
            {
                Id = 9,
                Name = "Society of Hispanic Professional Engineers", 
                Description = "Promoting Hispanic engineers and scientists in higher education and professional careers", 
                IsActive = true,
                ClubLocation = "Whitacre College of Engineering, Room 205",
                CategoryId = 1,
                UniversityId = 1
            },
            new Club 
            {
                Id = 10,
                Name = "Tech Men's Club Volleyball", 
                Description = "Competitive club volleyball for male students", 
                IsActive = true,
                ClubLocation = "Recreation Center, Volleyball Courts",
                CategoryId = 2,
                UniversityId = 1
            },
            new Club 
            {
                Id = 11,
                Name = "Tech Climbing Club", 
                Description = "Rock climbing and bouldering club for all skill levels", 
                IsActive = true,
                ClubLocation = "Recreation Center Climbing Wall",
                CategoryId = 2,
                UniversityId = 1
            },
            new Club 
            {
                Id = 12,
                Name = "Hispanic Student Society", 
                Description = "Celebrating Hispanic culture and heritage at Texas Tech", 
                IsActive = true,
                ClubLocation = "Student Union Building, Room 205",
                CategoryId = 3,
                UniversityId = 1
            },
            new Club 
            {
                Id = 13,
                Name = "Korean Student Association", 
                Description = "Promoting Korean culture and supporting Korean students at TTU", 
                IsActive = true,
                ClubLocation = "International Cultural Center",
                CategoryId = 3,
                UniversityId = 1
            },
            new Club 
            {
                Id = 14,
                Name = "American Red Cross Society at Tech", 
                Description = "Community service through American Red Cross initiatives", 
                IsActive = true,
                ClubLocation = "Student Engagement Office, SUB 201",
                CategoryId = 4,
                UniversityId = 1
            },
            new Club 
            {
                Id = 15,
                Name = "Raiders Helping Others", 
                Description = "Student organization focused on community service and volunteer work", 
                IsActive = true,
                ClubLocation = "Community Service Center",
                CategoryId = 4,
                UniversityId = 1
            },
            new Club 
            {
                Id = 16,
                Name = "Super Smash Bros Club", 
                Description = "Competitive and casual Super Smash Bros gaming community", 
                IsActive = true,
                ClubLocation = "Student Union Building, Game Room",
                CategoryId = 5,
                UniversityId = 1
            },
            new Club 
            {
                Id = 17,
                Name = "Tech Gaming Club", 
                Description = "Board games, video games, and tabletop gaming community", 
                IsActive = true,
                ClubLocation = "Student Union Building, Recreation Area",
                CategoryId = 5,
                UniversityId = 1
            },
            new Club 
            {
                Id = 18,
                Name = "Daily Toreador", 
                Description = "Texas Tech's student newspaper providing campus news and information", 
                IsActive = true,
                ClubLocation = "Student Media Building",
                CategoryId = 6,
                UniversityId = 1
            },
            new Club 
            {
                Id = 19,
                Name = "Tech Advertising Federation", 
                Description = "Student organization for advertising and marketing professionals", 
                IsActive = true,
                ClubLocation = "College of Media & Communication",
                CategoryId = 6,
                UniversityId = 1
            },
            new Club 
            {
                Id = 20,
                Name = "Dr. Bernard Harris Pre-Medical Society", 
                Description = "Supporting pre-medical students in their journey to medical school", 
                IsActive = true,
                ClubLocation = "Health Sciences Center, Room 3010",
                CategoryId = 7,
                UniversityId = 1
            },
            new Club 
            {
                Id = 21,
                Name = "Rawls College of Business Ambassadors", 
                Description = "Student ambassadors representing the Rawls College of Business", 
                IsActive = true,
                ClubLocation = "Rawls College of Business, Room 256",
                CategoryId = 7,
                UniversityId = 1
            },
            new Club 
            {
                Id = 22,
                Name = "Goin' Band Student Association", 
                Description = "Supporting the world's largest college marching band", 
                IsActive = true,
                ClubLocation = "School of Music, Band Hall",
                CategoryId = 9,
                UniversityId = 1
            },
            new Club 
            {
                Id = 23,
                Name = "Tech Kahaani Bollywood Dance Team", 
                Description = "Bollywood dance team celebrating South Asian culture through dance", 
                IsActive = true,
                ClubLocation = "Recreation Center, Dance Studio",
                CategoryId = 9,
                UniversityId = 1
            },
            new Club 
            {
                Id = 24,
                Name = "Tech College Republicans", 
                Description = "Campus organization for Republican students and conservative politics", 
                IsActive = true,
                ClubLocation = "Political Science Building, Room 113",
                CategoryId = 10,
                UniversityId = 1
            },
            new Club 
            {
                Id = 25,
                Name = "Baptist Student Ministry", 
                Description = "Faith-based community for Baptist students at Texas Tech", 
                IsActive = true,
                ClubLocation = "Baptist Student Center, 13th & University",
                CategoryId = 11,
                UniversityId = 1
            }
        );
    }
}