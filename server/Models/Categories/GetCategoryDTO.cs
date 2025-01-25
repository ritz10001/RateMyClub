using RateMyCollegeClub.Models.Clubs;

namespace RateMyCollegeClub.Models.Categories;

public class GetCategoryDTO : BaseCategoryDTO {
    public int Id { get; set; }
    public virtual ICollection<ClubDTO> Clubs { get; set; } = [];

}