using AutoMapper;
using RateMyCollegeClub.Data;
using RateMyCollegeClub.Models;
using RateMyCollegeClub.Models.Categories;
using RateMyCollegeClub.Models.Clubs;
using RateMyCollegeClub.Models.Reviews;
using RateMyCollegeClub.Models.Users;

namespace RateMyCollegeClub.Configurations;

public class MapperConfig : Profile {
    public MapperConfig()
    {
        CreateMap<Club, CreateClubDTO>().ReverseMap();
        CreateMap<Club, GetClubDTO>().ReverseMap();
        CreateMap<Club, GetClubsDTO>().ReverseMap();
        CreateMap<Club, UpdateClubDTO>().ReverseMap();
        CreateMap<Club, ClubDTO>().ReverseMap();
        CreateMap<Review, CreateReviewDTO>().ReverseMap();
        CreateMap<Review, GetReviewDTO>().ReverseMap();
        CreateMap<Review, UpdateReviewDTO>().ReverseMap();
        CreateMap<Category, CreateCategoryDTO>().ReverseMap();
        CreateMap<Category, GetCategoryDTO>().ReverseMap();
        CreateMap<Category, GetCategoriesDTO>().ReverseMap();
        CreateMap<Category, UpdateCategoryDTO>().ReverseMap();
        CreateMap<User, UserDTO>().ReverseMap();
    }
}