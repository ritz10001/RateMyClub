using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace server.Migrations
{
    /// <inheritdoc />
    public partial class AddUniversityTypeToUniversity : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "af75d9d4-5772-45b5-8e99-177e27d0a50d");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "f148d12e-62b3-4cc1-8c7a-a44310e1f2a0");

            migrationBuilder.AddColumn<int>(
                name: "UniversityType",
                table: "UniversityRequests",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[,]
                {
                    { "6f02a92d-38ae-4495-ba54-2bdf7a5efd33", null, "User", "USER" },
                    { "ec35172c-48a6-453d-bfa8-3b48597a9476", null, "Administrator", "ADMINISTRATOR" }
                });

            migrationBuilder.UpdateData(
                table: "Clubs",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2025, 7, 13, 19, 21, 52, 289, DateTimeKind.Utc).AddTicks(4707));

            migrationBuilder.UpdateData(
                table: "Clubs",
                keyColumn: "Id",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2025, 7, 13, 19, 21, 52, 289, DateTimeKind.Utc).AddTicks(4717));

            migrationBuilder.UpdateData(
                table: "Clubs",
                keyColumn: "Id",
                keyValue: 3,
                column: "CreatedAt",
                value: new DateTime(2025, 7, 13, 19, 21, 52, 289, DateTimeKind.Utc).AddTicks(4719));

            migrationBuilder.UpdateData(
                table: "Reviews",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2025, 7, 13, 19, 21, 52, 289, DateTimeKind.Utc).AddTicks(4599));

            migrationBuilder.UpdateData(
                table: "Reviews",
                keyColumn: "Id",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2025, 7, 13, 19, 21, 52, 289, DateTimeKind.Utc).AddTicks(4603));

            migrationBuilder.UpdateData(
                table: "Reviews",
                keyColumn: "Id",
                keyValue: 3,
                column: "CreatedAt",
                value: new DateTime(2025, 7, 13, 19, 21, 52, 289, DateTimeKind.Utc).AddTicks(4604));

            migrationBuilder.UpdateData(
                table: "Universities",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2025, 7, 13, 19, 21, 52, 289, DateTimeKind.Utc).AddTicks(4934));

            migrationBuilder.UpdateData(
                table: "Universities",
                keyColumn: "Id",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2025, 7, 13, 19, 21, 52, 289, DateTimeKind.Utc).AddTicks(4940));
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "6f02a92d-38ae-4495-ba54-2bdf7a5efd33");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "ec35172c-48a6-453d-bfa8-3b48597a9476");

            migrationBuilder.DropColumn(
                name: "UniversityType",
                table: "UniversityRequests");

            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[,]
                {
                    { "af75d9d4-5772-45b5-8e99-177e27d0a50d", null, "User", "USER" },
                    { "f148d12e-62b3-4cc1-8c7a-a44310e1f2a0", null, "Administrator", "ADMINISTRATOR" }
                });

            migrationBuilder.UpdateData(
                table: "Clubs",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2025, 7, 13, 18, 35, 48, 647, DateTimeKind.Utc).AddTicks(4538));

            migrationBuilder.UpdateData(
                table: "Clubs",
                keyColumn: "Id",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2025, 7, 13, 18, 35, 48, 647, DateTimeKind.Utc).AddTicks(4548));

            migrationBuilder.UpdateData(
                table: "Clubs",
                keyColumn: "Id",
                keyValue: 3,
                column: "CreatedAt",
                value: new DateTime(2025, 7, 13, 18, 35, 48, 647, DateTimeKind.Utc).AddTicks(4551));

            migrationBuilder.UpdateData(
                table: "Reviews",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2025, 7, 13, 18, 35, 48, 647, DateTimeKind.Utc).AddTicks(4417));

            migrationBuilder.UpdateData(
                table: "Reviews",
                keyColumn: "Id",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2025, 7, 13, 18, 35, 48, 647, DateTimeKind.Utc).AddTicks(4421));

            migrationBuilder.UpdateData(
                table: "Reviews",
                keyColumn: "Id",
                keyValue: 3,
                column: "CreatedAt",
                value: new DateTime(2025, 7, 13, 18, 35, 48, 647, DateTimeKind.Utc).AddTicks(4423));

            migrationBuilder.UpdateData(
                table: "Universities",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2025, 7, 13, 18, 35, 48, 647, DateTimeKind.Utc).AddTicks(4933));

            migrationBuilder.UpdateData(
                table: "Universities",
                keyColumn: "Id",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2025, 7, 13, 18, 35, 48, 647, DateTimeKind.Utc).AddTicks(4940));
        }
    }
}
