using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace server.Migrations
{
    /// <inheritdoc />
    public partial class MapRecommendation : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "98208871-4892-47f4-9241-7f344937cced");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "b1344a1d-75bb-4329-8d44-b553aaca4f3a");

            migrationBuilder.RenameColumn(
                name: "Recommend",
                table: "Reviews",
                newName: "Recommendation");

            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[,]
                {
                    { "992157c0-4f85-4c51-8535-3dcd06323962", null, "Administrator", "ADMINISTRATOR" },
                    { "ba0ffb2f-d85c-4b19-ae49-b9ae62223016", null, "User", "USER" }
                });

            migrationBuilder.UpdateData(
                table: "Clubs",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2025, 7, 9, 20, 59, 52, 766, DateTimeKind.Utc).AddTicks(5565));

            migrationBuilder.UpdateData(
                table: "Clubs",
                keyColumn: "Id",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2025, 7, 9, 20, 59, 52, 766, DateTimeKind.Utc).AddTicks(5574));

            migrationBuilder.UpdateData(
                table: "Clubs",
                keyColumn: "Id",
                keyValue: 3,
                column: "CreatedAt",
                value: new DateTime(2025, 7, 9, 20, 59, 52, 766, DateTimeKind.Utc).AddTicks(5576));

            migrationBuilder.UpdateData(
                table: "Reviews",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2025, 7, 9, 20, 59, 52, 766, DateTimeKind.Utc).AddTicks(5445));

            migrationBuilder.UpdateData(
                table: "Reviews",
                keyColumn: "Id",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2025, 7, 9, 20, 59, 52, 766, DateTimeKind.Utc).AddTicks(5451));

            migrationBuilder.UpdateData(
                table: "Reviews",
                keyColumn: "Id",
                keyValue: 3,
                column: "CreatedAt",
                value: new DateTime(2025, 7, 9, 20, 59, 52, 766, DateTimeKind.Utc).AddTicks(5452));

            migrationBuilder.UpdateData(
                table: "Universities",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2025, 7, 9, 20, 59, 52, 766, DateTimeKind.Utc).AddTicks(5760));

            migrationBuilder.UpdateData(
                table: "Universities",
                keyColumn: "Id",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2025, 7, 9, 20, 59, 52, 766, DateTimeKind.Utc).AddTicks(5764));
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "992157c0-4f85-4c51-8535-3dcd06323962");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "ba0ffb2f-d85c-4b19-ae49-b9ae62223016");

            migrationBuilder.RenameColumn(
                name: "Recommendation",
                table: "Reviews",
                newName: "Recommend");

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
                column: "CreatedAt",
                value: new DateTime(2025, 7, 7, 22, 59, 4, 444, DateTimeKind.Utc).AddTicks(4216));

            migrationBuilder.UpdateData(
                table: "Reviews",
                keyColumn: "Id",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2025, 7, 7, 22, 59, 4, 444, DateTimeKind.Utc).AddTicks(4222));

            migrationBuilder.UpdateData(
                table: "Reviews",
                keyColumn: "Id",
                keyValue: 3,
                column: "CreatedAt",
                value: new DateTime(2025, 7, 7, 22, 59, 4, 444, DateTimeKind.Utc).AddTicks(4224));

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
    }
}
