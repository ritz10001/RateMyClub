using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace server.Migrations
{
    /// <inheritdoc />
    public partial class InitialSeeding : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData(
                table: "Category",
                columns: new[] { "Id", "Description", "Name" },
                values: new object[,]
                {
                    { 1, "Clubs related to technology. Includes Computer Science, Computer and Electrical Engineering.", "Technology" },
                    { 2, "Clubs related to Sports. Includes physical and mental sports.", "Sports" }
                });

            migrationBuilder.InsertData(
                table: "Clubs",
                columns: new[] { "Id", "CategoryId", "ClubLocation", "CreatedAt", "Description", "IsActive", "Name" },
                values: new object[,]
                {
                    { 1, 1, "Engineering Center Basement, Room 100", new DateTime(2025, 1, 23, 21, 11, 22, 625, DateTimeKind.Utc).AddTicks(70), "Robotics Club", true, "Tech Robotics Association" },
                    { 2, 1, "Livermore Center, Room 101", new DateTime(2025, 1, 23, 21, 11, 22, 625, DateTimeKind.Utc).AddTicks(990), "Software Engineering Club", true, "Google Development Student Club" },
                    { 3, 2, "The SUB, Second floor, Room 237.", new DateTime(2025, 1, 23, 21, 11, 22, 625, DateTimeKind.Utc).AddTicks(992), "A club for playing chess", true, "Chess Club" }
                });

            migrationBuilder.InsertData(
                table: "Reviews",
                columns: new[] { "Id", "ClubId", "Comment", "CreatedAt", "InclusivityRating", "LeadershipRating", "NetworkingRating", "OverallRating", "SkillsDevelopmentRating" },
                values: new object[,]
                {
                    { 1, 1, "It's a good club overall. Friendly people in general.", new DateTime(2025, 1, 23, 21, 11, 22, 625, DateTimeKind.Utc).AddTicks(1523), 4, 2, 3, 4, 5 },
                    { 2, 1, "Plenty of volunteering opportunities. One of the highlights about the club is the annual VEX U competitions.", new DateTime(2025, 1, 23, 21, 11, 22, 625, DateTimeKind.Utc).AddTicks(2660), 5, 4, 2, 4, 4 },
                    { 3, 2, "The GDSC club has its ups and downs. Networking is one of its prime benefits.", new DateTime(2025, 1, 23, 21, 11, 22, 625, DateTimeKind.Utc).AddTicks(2662), 2, 4, 5, 3, 3 }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Clubs",
                keyColumn: "Id",
                keyValue: 3);

            migrationBuilder.DeleteData(
                table: "Reviews",
                keyColumn: "Id",
                keyValue: 1);

            migrationBuilder.DeleteData(
                table: "Reviews",
                keyColumn: "Id",
                keyValue: 2);

            migrationBuilder.DeleteData(
                table: "Reviews",
                keyColumn: "Id",
                keyValue: 3);

            migrationBuilder.DeleteData(
                table: "Category",
                keyColumn: "Id",
                keyValue: 2);

            migrationBuilder.DeleteData(
                table: "Clubs",
                keyColumn: "Id",
                keyValue: 1);

            migrationBuilder.DeleteData(
                table: "Clubs",
                keyColumn: "Id",
                keyValue: 2);

            migrationBuilder.DeleteData(
                table: "Category",
                keyColumn: "Id",
                keyValue: 1);
        }
    }
}
