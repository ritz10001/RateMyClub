using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace server.Migrations
{
    /// <inheritdoc />
    public partial class AddedWebsiteToUnis : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "97a694e6-b31b-47b2-af5b-1032a2a9faa3");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "efaae663-bffc-4306-b625-08c5ca9a5ee2");

            migrationBuilder.AddColumn<string>(
                name: "OfficialWebsite",
                table: "Universities",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[,]
                {
                    { "3c5a5197-ae98-4e4e-b69b-b73f928395ca", null, "User", "USER" },
                    { "96bdcc7e-553b-4c40-b2f5-d51e5cec837a", null, "Administrator", "ADMINISTRATOR" }
                });

            migrationBuilder.UpdateData(
                table: "Clubs",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2025, 7, 22, 22, 26, 26, 105, DateTimeKind.Utc).AddTicks(9325));

            migrationBuilder.UpdateData(
                table: "Clubs",
                keyColumn: "Id",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2025, 7, 22, 22, 26, 26, 105, DateTimeKind.Utc).AddTicks(9337));

            migrationBuilder.UpdateData(
                table: "Clubs",
                keyColumn: "Id",
                keyValue: 3,
                column: "CreatedAt",
                value: new DateTime(2025, 7, 22, 22, 26, 26, 105, DateTimeKind.Utc).AddTicks(9339));

            migrationBuilder.UpdateData(
                table: "Reviews",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2025, 7, 22, 22, 26, 26, 105, DateTimeKind.Utc).AddTicks(9202));

            migrationBuilder.UpdateData(
                table: "Reviews",
                keyColumn: "Id",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2025, 7, 22, 22, 26, 26, 105, DateTimeKind.Utc).AddTicks(9210));

            migrationBuilder.UpdateData(
                table: "Reviews",
                keyColumn: "Id",
                keyValue: 3,
                column: "CreatedAt",
                value: new DateTime(2025, 7, 22, 22, 26, 26, 105, DateTimeKind.Utc).AddTicks(9212));

            migrationBuilder.UpdateData(
                table: "Universities",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreatedAt", "OfficialWebsite" },
                values: new object[] { new DateTime(2025, 7, 22, 22, 26, 26, 105, DateTimeKind.Utc).AddTicks(9444), "" });

            migrationBuilder.UpdateData(
                table: "Universities",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "CreatedAt", "OfficialWebsite" },
                values: new object[] { new DateTime(2025, 7, 22, 22, 26, 26, 105, DateTimeKind.Utc).AddTicks(9450), "" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "3c5a5197-ae98-4e4e-b69b-b73f928395ca");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "96bdcc7e-553b-4c40-b2f5-d51e5cec837a");

            migrationBuilder.DropColumn(
                name: "OfficialWebsite",
                table: "Universities");

            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[,]
                {
                    { "97a694e6-b31b-47b2-af5b-1032a2a9faa3", null, "User", "USER" },
                    { "efaae663-bffc-4306-b625-08c5ca9a5ee2", null, "Administrator", "ADMINISTRATOR" }
                });

            migrationBuilder.UpdateData(
                table: "Clubs",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2025, 7, 19, 2, 20, 18, 759, DateTimeKind.Utc).AddTicks(3230));

            migrationBuilder.UpdateData(
                table: "Clubs",
                keyColumn: "Id",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2025, 7, 19, 2, 20, 18, 759, DateTimeKind.Utc).AddTicks(3239));

            migrationBuilder.UpdateData(
                table: "Clubs",
                keyColumn: "Id",
                keyValue: 3,
                column: "CreatedAt",
                value: new DateTime(2025, 7, 19, 2, 20, 18, 759, DateTimeKind.Utc).AddTicks(3241));

            migrationBuilder.UpdateData(
                table: "Reviews",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2025, 7, 19, 2, 20, 18, 759, DateTimeKind.Utc).AddTicks(3115));

            migrationBuilder.UpdateData(
                table: "Reviews",
                keyColumn: "Id",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2025, 7, 19, 2, 20, 18, 759, DateTimeKind.Utc).AddTicks(3121));

            migrationBuilder.UpdateData(
                table: "Reviews",
                keyColumn: "Id",
                keyValue: 3,
                column: "CreatedAt",
                value: new DateTime(2025, 7, 19, 2, 20, 18, 759, DateTimeKind.Utc).AddTicks(3122));

            migrationBuilder.UpdateData(
                table: "Universities",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2025, 7, 19, 2, 20, 18, 759, DateTimeKind.Utc).AddTicks(3334));

            migrationBuilder.UpdateData(
                table: "Universities",
                keyColumn: "Id",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2025, 7, 19, 2, 20, 18, 759, DateTimeKind.Utc).AddTicks(3341));
        }
    }
}
