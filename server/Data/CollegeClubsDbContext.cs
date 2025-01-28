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
        modelBuilder.ApplyConfiguration(new RoleConfiguration());
        modelBuilder.ApplyConfiguration(new CategoryConfiguration());
        modelBuilder.ApplyConfiguration(new ReviewConfiguration());
        modelBuilder.ApplyConfiguration(new ClubConfiguration());
        modelBuilder.ApplyConfiguration(new UniversityConfiguration());
    } 

}