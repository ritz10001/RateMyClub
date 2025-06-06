using Microsoft.EntityFrameworkCore;
using RateMyCollegeClub.Models;
using Microsoft.EntityFrameworkCore.Diagnostics;
using System.Diagnostics;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using RateMyCollegeClub.Data.Configurations;

namespace RateMyCollegeClub.Data;

public class CollegeClubsDbContext : IdentityDbContext<User> {
    public CollegeClubsDbContext(DbContextOptions options) : base(options)
    {
        
    }
    public DbSet<Club> Clubs { get; set; }
    public DbSet<Category> Categories { get; set; }
    public DbSet<Review> Reviews { get; set; }
    public DbSet<SavedClub> SavedClubs { get; set; }
    public DbSet<University> Universities { get; set; }
    public DbSet<UniversityRequest> UniversityRequests { get; set; }
    public DbSet<ClubRequest> ClubRequests { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        modelBuilder.ApplyConfiguration(new RoleConfiguration());
        modelBuilder.ApplyConfiguration(new CategoryConfiguration());
        modelBuilder.ApplyConfiguration(new ReviewConfiguration());
        modelBuilder.ApplyConfiguration(new ClubConfiguration());
        modelBuilder.ApplyConfiguration(new UniversityConfiguration());
    } 

}