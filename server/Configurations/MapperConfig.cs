using AutoMapper;
using RateMyCollegeClub.Models;
using RateMyCollegeClub.Models.Clubs;

namespace RateMyCollegeClub.Configurations;

public class MapperConfig : Profile {
    public MapperConfig()
    {
        CreateMap<Club, CreateClubDTO>().ReverseMap();
        CreateMap<Club, GetClubDTO>().ReverseMap();
        CreateMap<Club, GetClubsDTO>().ReverseMap();
        CreateMap<Club, UpdateClubDTO>().ReverseMap();
        CreateMap<Review, ReviewDTO>().ReverseMap();
    }
}