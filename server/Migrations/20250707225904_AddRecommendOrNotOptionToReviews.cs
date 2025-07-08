using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace server.Migrations
{
    /// <inheritdoc />
    public partial class AddRecommendOrNotOptionToReviews : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "2f81923c-f26f-4f3b-b53d-14b7766e8436");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "7d519765-0fc3-426d-8b48-24a454558ea1");

            migrationBuilder.AddColumn<string>(
                name: "Recommend",
                table: "Reviews",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[,]
                {
                    { "98208871-4892-47f4-9241-7f344937cced", null, "Administrator", "ADMINISTRATOR" },
                    { "b1344a1d-75bb-4329-8d44-b553aaca4f3a", null, "User", "USER" }
                });

            migrationBuilder.UpdateData(
                table: "Clubs",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2025, 7, 7, 22, 59, 4, 444, DateTimeKind.Utc).AddTicks(4330));

            migrationBuilder.UpdateData(
                table: "Clubs",
                keyColumn: "Id",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2025, 7, 7, 22, 59, 4, 444, DateTimeKind.Utc).AddTicks(4344));

            migrationBuilder.UpdateData(
                table: "Clubs",
                keyColumn: "Id",
                keyValue: 3,
                column: "CreatedAt",
                value: new DateTime(2025, 7, 7, 22, 59, 4, 444, DateTimeKind.Utc).AddTicks(4347));

            migrationBuilder.UpdateData(
                table: "Reviews",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreatedAt", "Recommend" },
                values: new object[] { new DateTime(2025, 7, 7, 22, 59, 4, 444, DateTimeKind.Utc).AddTicks(4216), "" });

            migrationBuilder.UpdateData(
                table: "Reviews",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "CreatedAt", "Recommend" },
                values: new object[] { new DateTime(2025, 7, 7, 22, 59, 4, 444, DateTimeKind.Utc).AddTicks(4222), "" });

            migrationBuilder.UpdateData(
                table: "Reviews",
                keyColumn: "Id",
                keyValue: 3,
                columns: new[] { "CreatedAt", "Recommend" },
                values: new object[] { new DateTime(2025, 7, 7, 22, 59, 4, 444, DateTimeKind.Utc).AddTicks(4224), "" });

            migrationBuilder.UpdateData(
                table: "Universities",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2025, 7, 7, 22, 59, 4, 444, DateTimeKind.Utc).AddTicks(4624));

            migrationBuilder.UpdateData(
                table: "Universities",
                keyColumn: "Id",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2025, 7, 7, 22, 59, 4, 444, DateTimeKind.Utc).AddTicks(4629));
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "98208871-4892-47f4-9241-7f344937cced");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "b1344a1d-75bb-4329-8d44-b553aaca4f3a");

            migrationBuilder.DropColumn(
                name: "Recommend",
                table: "Reviews");

            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[,]
                {
                    { "2f81923c-f26f-4f3b-b53d-14b7766e8436", null, "Administrator", "ADMINISTRATOR" },
                    { "7d519765-0fc3-426d-8b48-24a454558ea1", null, "User", "USER" }
                });

            migrationBuilder.UpdateData(
                table: "Clubs",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2025, 7, 7, 3, 23, 2, 310, DateTimeKind.Utc).AddTicks(2060));

            migrationBuilder.UpdateData(
                table: "Clubs",
                keyColumn: "Id",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2025, 7, 7, 3, 23, 2, 310, DateTimeKind.Utc).AddTicks(2071));

            migrationBuilder.UpdateData(
                table: "Clubs",
                keyColumn: "Id",
                keyValue: 3,
                column: "CreatedAt",
                value: new DateTime(2025, 7, 7, 3, 23, 2, 310, DateTimeKind.Utc).AddTicks(2074));

            migrationBuilder.UpdateData(
                table: "Reviews",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2025, 7, 7, 3, 23, 2, 310, DateTimeKind.Utc).AddTicks(1874));

            migrationBuilder.UpdateData(
                table: "Reviews",
                keyColumn: "Id",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2025, 7, 7, 3, 23, 2, 310, DateTimeKind.Utc).AddTicks(1882));

            migrationBuilder.UpdateData(
                table: "Reviews",
                keyColumn: "Id",
                keyValue: 3,
                column: "CreatedAt",
                value: new DateTime(2025, 7, 7, 3, 23, 2, 310, DateTimeKind.Utc).AddTicks(1883));

            migrationBuilder.UpdateData(
                table: "Universities",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2025, 7, 7, 3, 23, 2, 310, DateTimeKind.Utc).AddTicks(2286));

            migrationBuilder.UpdateData(
                table: "Universities",
                keyColumn: "Id",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2025, 7, 7, 3, 23, 2, 310, DateTimeKind.Utc).AddTicks(2291));
        }
    }
}
