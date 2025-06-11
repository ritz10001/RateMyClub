using AutoMapper;
using RateMyCollegeClub.Data;
using RateMyCollegeClub.Models;
using RateMyCollegeClub.Models.Categories;
using RateMyCollegeClub.Models.Clubs;
using RateMyCollegeClub.Models.Reviews;
using RateMyCollegeClub.Models.Universities;
using RateMyCollegeClub.Models.Users;

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
        .ForMember(dest => dest.UniversityName, opt => opt.MapFrom(src => src.University.Name))
        .ForMember(dest => dest.CategoryName, opt => opt.MapFrom(src => src.Category.Name))
        .ForMember(dest => dest.AverageRating, opt => opt.MapFrom(src => src.Reviews.Count != 0 
            ? Math.Round(src.Reviews.Average(r => r.OverallRating), 1) 
            : 0))
        .ReverseMap();
        CreateMap<Club, UpdateClubDTO>().ReverseMap();
        CreateMap<Club, ClubDTO>().ReverseMap();
        CreateMap<Review, CreateReviewDTO>().ReverseMap();
        CreateMap<Review, GetReviewDTO>()
        .ForMember(dest => dest.UserDisplayName, opt => opt.MapFrom(src => src.User != null ? $"{src.User.FirstName} {src.User.LastName}" : "Unknown User"))
        .ReverseMap();
        CreateMap<Review, UpdateReviewDTO>().ReverseMap();
        CreateMap<Category, CreateCategoryDTO>().ReverseMap();
        CreateMap<Category, GetCategoryDTO>().ReverseMap();
        CreateMap<Category, GetCategoriesDTO>().ReverseMap();
        CreateMap<Category, UpdateCategoryDTO>().ReverseMap();
        CreateMap<User, UserDTO>().ReverseMap();
        CreateMap<University, GetUniversityDTO>()
        .ReverseMap();
        CreateMap<University, GetUniversitiesDTO>()
        .ForMember(dest => dest.ClubsCount, opt => opt.MapFrom(src => src.Clubs.Count))
        .ReverseMap();
    }
}