namespace RateMyCollegeClub.Models;

class Category {
    public int Id { get; set; }
    public string Name { get; set; }  
    public string Description { get; set; }
    public virtual ICollection<Club> Clubs { get; set; }

}