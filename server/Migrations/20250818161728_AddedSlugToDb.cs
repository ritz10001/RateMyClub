using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace server.Migrations
{
    /// <inheritdoc />
    public partial class AddedSlugToDb : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "51517410-8757-40b3-8a08-c016e5e657cb");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "c848f1a2-3896-4753-a8f7-00c0b4c4bed8");

            migrationBuilder.AddColumn<string>(
                name: "Slug",
                table: "Universities",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Slug",
                table: "Clubs",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

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
                columns: new[] { "CreatedAt", "Slug" },
                values: new object[] { new DateTime(2025, 8, 18, 16, 17, 28, 467, DateTimeKind.Utc).AddTicks(6756), "" });

            migrationBuilder.UpdateData(
                table: "Clubs",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "CreatedAt", "Slug" },
                values: new object[] { new DateTime(2025, 8, 18, 16, 17, 28, 467, DateTimeKind.Utc).AddTicks(6767), "" });

            migrationBuilder.UpdateData(
                table: "Clubs",
                keyColumn: "Id",
                keyValue: 3,
                columns: new[] { "CreatedAt", "Slug" },
                values: new object[] { new DateTime(2025, 8, 18, 16, 17, 28, 467, DateTimeKind.Utc).AddTicks(6769), "" });

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
                columns: new[] { "CreatedAt", "Slug" },
                values: new object[] { new DateTime(2025, 8, 18, 16, 17, 28, 467, DateTimeKind.Utc).AddTicks(6899), "" });

            migrationBuilder.UpdateData(
                table: "Universities",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "CreatedAt", "Slug" },
                values: new object[] { new DateTime(2025, 8, 18, 16, 17, 28, 467, DateTimeKind.Utc).AddTicks(6919), "" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "9c0a500b-6450-454b-af99-7f81d2f5e8bc");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "f27158b3-70ca-43a6-9005-8c586397b6e9");

            migrationBuilder.DropColumn(
                name: "Slug",
                table: "Universities");

            migrationBuilder.DropColumn(
                name: "Slug",
                table: "Clubs");

            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[,]
                {
                    { "51517410-8757-40b3-8a08-c016e5e657cb", null, "User", "USER" },
                    { "c848f1a2-3896-4753-a8f7-00c0b4c4bed8", null, "Administrator", "ADMINISTRATOR" }
                });

            migrationBuilder.UpdateData(
                table: "Clubs",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2025, 8, 10, 0, 15, 0, 142, DateTimeKind.Utc).AddTicks(3157));

            migrationBuilder.UpdateData(
                table: "Clubs",
                keyColumn: "Id",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2025, 8, 10, 0, 15, 0, 142, DateTimeKind.Utc).AddTicks(3171));

            migrationBuilder.UpdateData(
                table: "Clubs",
                keyColumn: "Id",
                keyValue: 3,
                column: "CreatedAt",
                value: new DateTime(2025, 8, 10, 0, 15, 0, 142, DateTimeKind.Utc).AddTicks(3172));

            migrationBuilder.UpdateData(
                table: "Reviews",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2025, 8, 10, 0, 15, 0, 142, DateTimeKind.Utc).AddTicks(3020));

            migrationBuilder.UpdateData(
                table: "Reviews",
                keyColumn: "Id",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2025, 8, 10, 0, 15, 0, 142, DateTimeKind.Utc).AddTicks(3025));

            migrationBuilder.UpdateData(
                table: "Reviews",
                keyColumn: "Id",
                keyValue: 3,
                column: "CreatedAt",
                value: new DateTime(2025, 8, 10, 0, 15, 0, 142, DateTimeKind.Utc).AddTicks(3027));

            migrationBuilder.UpdateData(
                table: "Universities",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2025, 8, 10, 0, 15, 0, 142, DateTimeKind.Utc).AddTicks(3291));

            migrationBuilder.UpdateData(
                table: "Universities",
                keyColumn: "Id",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2025, 8, 10, 0, 15, 0, 142, DateTimeKind.Utc).AddTicks(3296));
        }
    }
}
