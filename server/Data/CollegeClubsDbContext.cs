using Microsoft.EntityFrameworkCore;
using RateMyCollegeClub.Models;
using Microsoft.EntityFrameworkCore.Diagnostics;
using System.Diagnostics;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using RateMyCollegeClub.Data.Configurations;
using System.Text.Json;
using server.Models;

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
    public DbSet<Tag> Tags { get; set; }
    public DbSet<ReviewVote> ReviewVotes { get; set; }
    public DbSet<ReviewFlag> ReviewFlags { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        modelBuilder.Entity<Club>()
        .HasMany(cr => cr.Tags)
        .WithMany(t => t.Clubs)
        .UsingEntity(j => j.ToTable("ClubTag"));
        modelBuilder.Entity<User>()
        .HasMany(u => u.Tags)
        .WithMany(t => t.Users)
        .UsingEntity(j => j.ToTable("UserTag"));
        modelBuilder.Entity<SavedClub>()
        .HasOne(sc => sc.Club)
        .WithMany()
        .HasForeignKey(sc => sc.ClubId);
        modelBuilder.ApplyConfiguration(new RoleConfiguration());
        modelBuilder.ApplyConfiguration(new CategoryConfiguration());
        modelBuilder.ApplyConfiguration(new ReviewConfiguration());
        modelBuilder.ApplyConfiguration(new ClubConfiguration());
        modelBuilder.ApplyConfiguration(new UniversityConfiguration());

    } 

}