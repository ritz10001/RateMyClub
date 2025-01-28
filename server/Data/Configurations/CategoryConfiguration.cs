using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using RateMyCollegeClub.Models;

public class CategoryConfiguration : IEntityTypeConfiguration<Category>
{
    public void Configure(EntityTypeBuilder<Category> builder)
    {
        builder.HasData(
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
    }
}