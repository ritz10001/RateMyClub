using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace server.Migrations
{
    /// <inheritdoc />
    public partial class AddOverallRatingToReviews : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "27be65c8-e41f-4714-9a57-e042f639233f");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "67b90de7-28e4-489e-9584-c94b1bb76d9b");

            migrationBuilder.AddColumn<decimal>(
                name: "OverallRating",
                table: "Reviews",
                type: "decimal(18,2)",
                maxLength: 1000,
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[,]
                {
                    { "2e995e06-6860-4d61-b855-9c892be77627", null, "User", "USER" },
                    { "6ba32440-77a0-4a06-91e9-d727c506a158", null, "Administrator", "ADMINISTRATOR" }
                });

            migrationBuilder.UpdateData(
                table: "Clubs",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2025, 7, 26, 4, 41, 31, 839, DateTimeKind.Utc).AddTicks(2452));

            migrationBuilder.UpdateData(
                table: "Clubs",
                keyColumn: "Id",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2025, 7, 26, 4, 41, 31, 839, DateTimeKind.Utc).AddTicks(2461));

            migrationBuilder.UpdateData(
                table: "Clubs",
                keyColumn: "Id",
                keyValue: 3,
                column: "CreatedAt",
                value: new DateTime(2025, 7, 26, 4, 41, 31, 839, DateTimeKind.Utc).AddTicks(2463));

            migrationBuilder.UpdateData(
                table: "Reviews",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreatedAt", "OverallRating" },
                values: new object[] { new DateTime(2025, 7, 26, 4, 41, 31, 839, DateTimeKind.Utc).AddTicks(2240), 0m });

            migrationBuilder.UpdateData(
                table: "Reviews",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "CreatedAt", "OverallRating" },
                values: new object[] { new DateTime(2025, 7, 26, 4, 41, 31, 839, DateTimeKind.Utc).AddTicks(2249), 0m });

            migrationBuilder.UpdateData(
                table: "Reviews",
                keyColumn: "Id",
                keyValue: 3,
                columns: new[] { "CreatedAt", "OverallRating" },
                values: new object[] { new DateTime(2025, 7, 26, 4, 41, 31, 839, DateTimeKind.Utc).AddTicks(2251), 0m });

            migrationBuilder.UpdateData(
                table: "Universities",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2025, 7, 26, 4, 41, 31, 839, DateTimeKind.Utc).AddTicks(2574));

            migrationBuilder.UpdateData(
                table: "Universities",
                keyColumn: "Id",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2025, 7, 26, 4, 41, 31, 839, DateTimeKind.Utc).AddTicks(2580));
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "2e995e06-6860-4d61-b855-9c892be77627");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "6ba32440-77a0-4a06-91e9-d727c506a158");

            migrationBuilder.DropColumn(
                name: "OverallRating",
                table: "Reviews");

            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[,]
                {
                    { "27be65c8-e41f-4714-9a57-e042f639233f", null, "User", "USER" },
                    { "67b90de7-28e4-489e-9584-c94b1bb76d9b", null, "Administrator", "ADMINISTRATOR" }
                });

            migrationBuilder.UpdateData(
                table: "Clubs",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2025, 7, 23, 3, 1, 52, 51, DateTimeKind.Utc).AddTicks(6330));

            migrationBuilder.UpdateData(
                table: "Clubs",
                keyColumn: "Id",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2025, 7, 23, 3, 1, 52, 51, DateTimeKind.Utc).AddTicks(6344));

            migrationBuilder.UpdateData(
                table: "Clubs",
                keyColumn: "Id",
                keyValue: 3,
                column: "CreatedAt",
                value: new DateTime(2025, 7, 23, 3, 1, 52, 51, DateTimeKind.Utc).AddTicks(6346));

            migrationBuilder.UpdateData(
                table: "Reviews",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2025, 7, 23, 3, 1, 52, 51, DateTimeKind.Utc).AddTicks(6210));

            migrationBuilder.UpdateData(
                table: "Reviews",
                keyColumn: "Id",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2025, 7, 23, 3, 1, 52, 51, DateTimeKind.Utc).AddTicks(6218));

            migrationBuilder.UpdateData(
                table: "Reviews",
                keyColumn: "Id",
                keyValue: 3,
                column: "CreatedAt",
                value: new DateTime(2025, 7, 23, 3, 1, 52, 51, DateTimeKind.Utc).AddTicks(6220));

            migrationBuilder.UpdateData(
                table: "Universities",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2025, 7, 23, 3, 1, 52, 51, DateTimeKind.Utc).AddTicks(6453));

            migrationBuilder.UpdateData(
                table: "Universities",
                keyColumn: "Id",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2025, 7, 23, 3, 1, 52, 51, DateTimeKind.Utc).AddTicks(6460));
        }
    }
}
