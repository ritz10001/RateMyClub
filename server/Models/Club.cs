namespace RateMyCollegeClub.Models;

class Club {
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public int CategoryId { get; set; }
    public bool IsActive { get; set; }
    public string ClubLocation { get; set; } = string.Empty;
    public Category Category { get; set; }
    public virtual ICollection<Review> Reviews { get; set; }
    public virtual ICollection<SavedClub> SavedClubs { get; set; }

}