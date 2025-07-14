public class PatchClubDTO
{
    public string? Name { get; set; }
    public string? Description { get; set; }
    public string? ClubLocation { get; set; }
    public bool? IsActive { get; set; }
    public int? CategoryId { get; set; }
    public string? LogoUrl { get; set; }
    public List<int>? TagIds { get; set; }
}
