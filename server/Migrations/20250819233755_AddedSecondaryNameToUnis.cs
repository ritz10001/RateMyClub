using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace server.Migrations
{
    /// <inheritdoc />
    public partial class AddedSecondaryNameToUnis : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "9c0a500b-6450-454b-af99-7f81d2f5e8bc");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "f27158b3-70ca-43a6-9005-8c586397b6e9");

            migrationBuilder.AddColumn<string>(
                name: "SecondaryName",
                table: "Universities",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[,]
                {
                    { "9820930c-ef77-41fe-9c9b-a7c1803820a8", null, "Administrator", "ADMINISTRATOR" },
                    { "ada63de5-0407-4472-be7a-b15438f4233d", null, "User", "USER" }
                });

            migrationBuilder.UpdateData(
                table: "Clubs",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2025, 8, 19, 23, 37, 54, 753, DateTimeKind.Utc).AddTicks(1003));

            migrationBuilder.UpdateData(
                table: "Clubs",
                keyColumn: "Id",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2025, 8, 19, 23, 37, 54, 753, DateTimeKind.Utc).AddTicks(1013));

            migrationBuilder.UpdateData(
                table: "Clubs",
                keyColumn: "Id",
                keyValue: 3,
                column: "CreatedAt",
                value: new DateTime(2025, 8, 19, 23, 37, 54, 753, DateTimeKind.Utc).AddTicks(1015));

            migrationBuilder.UpdateData(
                table: "Reviews",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2025, 8, 19, 23, 37, 54, 753, DateTimeKind.Utc).AddTicks(889));

            migrationBuilder.UpdateData(
                table: "Reviews",
                keyColumn: "Id",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2025, 8, 19, 23, 37, 54, 753, DateTimeKind.Utc).AddTicks(894));

            migrationBuilder.UpdateData(
                table: "Reviews",
                keyColumn: "Id",
                keyValue: 3,
                column: "CreatedAt",
                value: new DateTime(2025, 8, 19, 23, 37, 54, 753, DateTimeKind.Utc).AddTicks(896));

            migrationBuilder.UpdateData(
                table: "Universities",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreatedAt", "SecondaryName" },
                values: new object[] { new DateTime(2025, 8, 19, 23, 37, 54, 753, DateTimeKind.Utc).AddTicks(1119), "" });

            migrationBuilder.UpdateData(
                table: "Universities",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "CreatedAt", "SecondaryName" },
                values: new object[] { new DateTime(2025, 8, 19, 23, 37, 54, 753, DateTimeKind.Utc).AddTicks(1126), "" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "9820930c-ef77-41fe-9c9b-a7c1803820a8");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "ada63de5-0407-4472-be7a-b15438f4233d");

            migrationBuilder.DropColumn(
                name: "SecondaryName",
                table: "Universities");

            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[,]
                {
                    { "9c0a500b-6450-454b-af99-7f81d2f5e8bc", null, "Administrator", "ADMINISTRATOR" },
                    { "f27158b3-70ca-43a6-9005-8c586397b6e9", null, "User", "USER" }
                });

            migrationBuilder.UpdateData(
                table: "Clubs",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2025, 8, 18, 16, 17, 28, 467, DateTimeKind.Utc).AddTicks(6756));

            migrationBuilder.UpdateData(
                table: "Clubs",
                keyColumn: "Id",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2025, 8, 18, 16, 17, 28, 467, DateTimeKind.Utc).AddTicks(6767));

            migrationBuilder.UpdateData(
                table: "Clubs",
                keyColumn: "Id",
                keyValue: 3,
                column: "CreatedAt",
                value: new DateTime(2025, 8, 18, 16, 17, 28, 467, DateTimeKind.Utc).AddTicks(6769));

            migrationBuilder.UpdateData(
                table: "Reviews",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2025, 8, 18, 16, 17, 28, 467, DateTimeKind.Utc).AddTicks(6633));

            migrationBuilder.UpdateData(
                table: "Reviews",
                keyColumn: "Id",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2025, 8, 18, 16, 17, 28, 467, DateTimeKind.Utc).AddTicks(6640));

            migrationBuilder.UpdateData(
                table: "Reviews",
                keyColumn: "Id",
                keyValue: 3,
                column: "CreatedAt",
                value: new DateTime(2025, 8, 18, 16, 17, 28, 467, DateTimeKind.Utc).AddTicks(6642));

            migrationBuilder.UpdateData(
                table: "Universities",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2025, 8, 18, 16, 17, 28, 467, DateTimeKind.Utc).AddTicks(6899));

            migrationBuilder.UpdateData(
                table: "Universities",
                keyColumn: "Id",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2025, 8, 18, 16, 17, 28, 467, DateTimeKind.Utc).AddTicks(6919));
        }
    }
}
