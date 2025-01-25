using AutoMapper;
using RateMyCollegeClub.Models;
using RateMyCollegeClub.Models.Clubs;
using RateMyCollegeClub.Models.Reviews;

namespace RateMyCollegeClub.Configurations;

public class MapperConfig : Profile {
    public MapperConfig()
    {
        CreateMap<Club, CreateClubDTO>().ReverseMap();
        CreateMap<Club, GetClubDTO>().ReverseMap();
        CreateMap<Club, GetClubsDTO>().ReverseMap();
        CreateMap<Club, UpdateClubDTO>().ReverseMap();
        CreateMap<Review, GetReviewDTO>().ReverseMap();
        CreateMap<Review, CreateReviewDTO>().ReverseMap();
        CreateMap<Review, UpdateReviewDTO>().ReverseMap();
    }
}