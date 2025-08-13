using AutoMapper;
using RateMyCollegeClub.Data;
using RateMyCollegeClub.Models;
using RateMyCollegeClub.Models.Categories;
using RateMyCollegeClub.Models.Clubs;
using RateMyCollegeClub.Models.Requests;
using RateMyCollegeClub.Models.Reviews;
using RateMyCollegeClub.Models.SavedClubs;
using RateMyCollegeClub.Models.Universities;
using RateMyCollegeClub.Models.Users;
using server.Models;

namespace RateMyCollegeClub.Configurations;

public class MapperConfig : Profile {
    public MapperConfig()
    {
        CreateMap<Club, CreateClubDTO>().ReverseMap();
        CreateMap<Club, GetClubDTO>()
        .ForMember(dest => dest.CategoryName, opt => opt.MapFrom(src => src.Category.Name))
        .ForMember(dest => dest.UniversityName, opt => opt.MapFrom(src => src.University.Name))
        .ForMember(dest => dest.AverageRating, opt => opt.MapFrom(src => src.Reviews.Any() ? src.Reviews.Average(r => r.OverallRating) : 0))
        .ForMember(dest => dest.ReviewCount, opt => opt.MapFrom(src => src.Reviews.Count))
        .ReverseMap();
        CreateMap<Club, GetClubsDTO>()
        .ForMember(dest => dest.ReviewCount, opt => opt.MapFrom(src => src.Reviews.Count))
        .ForMember(dest => dest.Tags, opt => opt.MapFrom(src => src.Tags.Select(t => t.Name).ToList()))
        .ForMember(dest => dest.UniversityName, opt => opt.MapFrom(src => src.University.Name))
        .ForMember(dest => dest.CategoryName, opt => opt.MapFrom(src => src.Category.Name))
        .ForMember(dest => dest.AverageRating, opt => opt.MapFrom(src => src.Reviews.Count != 0
            ? Math.Round(src.Reviews.Average(r => r.OverallRating), 1)
            : 0))
        .ReverseMap();
        CreateMap<Club, UpdateClubDTO>().ReverseMap();
        CreateMap<Club, ClubDTO>().ReverseMap();
        CreateMap<Club, GetRecommendedClubsDTO>()
        .ForMember(dest => dest.AverageRating, opt => opt.MapFrom(src => src.Reviews.Count != 0
            ? Math.Round(src.Reviews.Average(r => r.OverallRating), 1)
            : 0))
        .ForMember(dest => dest.CategoryName, opt => opt.MapFrom(src => src.Category.Name))
        .ForMember(dest => dest.ReviewCount, opt => opt.MapFrom(src => src.Reviews.Count))
        .ForMember(dest => dest.UniversityName, opt => opt.MapFrom(src => src.University.Name))
        .ReverseMap();
        CreateMap<Review, CreateReviewDTO>().ReverseMap();
        CreateMap<Review, GetReviewDTO>()
        .ForMember(dest => dest.UserDisplayName, opt => opt.MapFrom(src => src.User != null ? $"{src.User.FirstName} {src.User.LastName}" : "Unknown User"))
        .ForMember(dest => dest.NetScore, opt => opt.MapFrom(src => src.NetScore))
        .ForMember(dest => dest.CurrentUserVote, opt => opt.Ignore())
        .ReverseMap();
        CreateMap<Review, GetReviewsDTO>().ReverseMap();
        CreateMap<Review, GetMyReviewsDTO>()
        .ForMember(dest => dest.ClubName, opt => opt.MapFrom(src => src.Club.Name))
        .ForMember(dest => dest.UniversityId, opt => opt.MapFrom(src => src.Club.University.Id))
        .ForMember(dest => dest.UniversityName, opt => opt.MapFrom(src => src.Club.University.Name))
        .ForMember(dest => dest.OverallRating, opt => opt.MapFrom(src => src.OverallRating))
        .ForMember(dest => dest.Comment, opt => opt.MapFrom(src => src.Comment))
        .ForMember(dest => dest.CreatedAt, opt => opt.MapFrom(src => src.CreatedAt));

        CreateMap<Review, UpdateReviewDTO>().ReverseMap();
        CreateMap<Category, CreateCategoryDTO>().ReverseMap();
        CreateMap<Category, GetCategoryDTO>().ReverseMap();
        CreateMap<Category, GetCategoriesDTO>().ReverseMap();
        CreateMap<Category, UpdateCategoryDTO>().ReverseMap();
        CreateMap<User, UserDTO>().ReverseMap();
        CreateMap<University, GetUniversityDTO>()
        .ReverseMap();
        CreateMap<University, CreateUniversityDTO>().ReverseMap();
        CreateMap<University, GetUniversitiesDTO>()
        .ForMember(dest => dest.ClubsCount, opt => opt.MapFrom(src => src.Clubs.Count))
        .ForMember(dest => dest.ReviewCount, opt => opt.MapFrom(src => src.Clubs.Sum(c => c.Reviews.Count)))
        .ReverseMap();
        CreateMap<University, UpdateUniversityDTO>().ReverseMap();
        CreateMap<SavedClub, SavedClubsDTO>()
        .ForMember(dest => dest.ClubName, opt => opt.MapFrom(src => src.Club.Name))
        .ForMember(dest => dest.CategoryName, opt => opt.MapFrom(src => src.Club.Category.Name))
        .ForMember(dest => dest.Description, opt => opt.MapFrom(src => src.Club.Description))
        .ForMember(dest => dest.UniversityId, opt => opt.MapFrom(src => src.Club.UniversityId))
        .ForMember(dest => dest.UniversityName, opt => opt.MapFrom(src => src.Club.University.Name))
        .ForMember(dest => dest.Tags, opt => opt.MapFrom(src => src.Club.Tags.Select(t => t.Name).ToList()))
        .ForMember(dest => dest.AverageRating, opt => opt.MapFrom(src =>
        src.Club.Reviews.Any()
            ? (double)src.Club.Reviews
                .Average(r => (r.LeadershipRating +
                             r.InclusivityRating +
                             r.NetworkingRating +
                             r.SkillsDevelopmentRating) / 4.0m)
            : 0))
        .ForMember(dest => dest.ReviewCount, opt => opt.MapFrom(src => src.Club.Reviews.Count))
        .ReverseMap();
        CreateMap<Tag, GetTagDTO>().ReverseMap();
        CreateMap<ClubRequest, GetClubRequestsDTO>()
        .ForMember(dest => dest.FullName, opt => opt.MapFrom(src => src.User.FirstName + " " + src.User.LastName))
        .ForMember(dest => dest.RequestedBy, opt => opt.MapFrom(src => src.User!.UserName)) // or .Email, depends on your User class
        .ForMember(dest => dest.UniversityName, opt => opt.MapFrom(src => src.University.Name))
        .ForMember(dest => dest.Category, opt => opt.MapFrom(src => src.Category.Name))
        .ForMember(dest => dest.Status, opt => opt.MapFrom(src => src.RequestStatus.ToString()));
        CreateMap<ClubRequest, ClubRequestDTO>().ReverseMap();
        CreateMap<ClubRequest, GetMyClubRequestsDTO>()
        .ForMember(dest => dest.UniversityName, opt => opt.MapFrom(src => src.University.Name))
        .ForMember(dest => dest.Category, opt => opt.MapFrom(src => src.Category.Name))
        .ForMember(dest => dest.Status, opt => opt.MapFrom(src => src.RequestStatus))
        .ReverseMap();
        CreateMap<UniversityRequest, UniversityRequestDTO>().ReverseMap(); // or .Email, depends on your User class
        CreateMap<UniversityRequest, GetUniversityRequestsDTO>()
        .ForMember(dest => dest.FullName, opt => opt.MapFrom(src => src.User.FirstName + " " + src.User.LastName))
        .ForMember(dest => dest.RequestedBy, opt => opt.MapFrom(src => src.User!.UserName))
        .ForMember(dest => dest.Status, opt => opt.MapFrom(src => src.RequestStatus.ToString()))
        .ReverseMap();
        CreateMap<UniversityRequest, GetMyUniversityRequestDTO>()
        .ForMember(dest => dest.Status, opt => opt.MapFrom(src => src.RequestStatus))
        .ReverseMap();
    }
}