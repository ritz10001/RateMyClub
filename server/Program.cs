using Microsoft.EntityFrameworkCore;
using RateMyCollegeClub.Configurations;
using RateMyCollegeClub.Data;
using RateMyCollegeClub.Interfaces;
using RateMyCollegeClub.Repository;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

var connectionString = builder.Configuration.GetConnectionString("CollegeClubsDbConnectionString");
builder.Services.AddDbContext<CollegeClubsDbContext>(options => {
    options.UseSqlServer(connectionString);
});

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();  // Adding Swagger support

builder.Services.AddCors(options => {
    options.AddPolicy("AllowAll", b => b.AllowAnyHeader().AllowAnyOrigin().AllowAnyMethod());
});


builder.Services.AddAutoMapper(typeof(MapperConfig));
builder.Services.AddScoped(typeof(IGenericRepository<>), typeof(GenericRepository<>));
builder.Services.AddScoped<IClubsRepository, ClubsRepository>();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();  // Middleware to generate Swagger JSON
    app.UseSwaggerUI();  // Middleware to serve the Swagger UI
}

app.UseHttpsRedirection();

app.UseCors("AllowAll");

app.UseAuthorization();

app.MapControllers();

app.Run();
