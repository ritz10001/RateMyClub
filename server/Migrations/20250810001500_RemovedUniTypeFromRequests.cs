using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace server.Migrations
{
    /// <inheritdoc />
    public partial class RemovedUniTypeFromRequests : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "02e217a8-5139-4014-bf74-ec78b161e79f");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "bc74267d-cbad-4d15-a444-fd7be963849a");

            migrationBuilder.DropColumn(
                name: "UniversityType",
                table: "UniversityRequests");

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

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "51517410-8757-40b3-8a08-c016e5e657cb");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "c848f1a2-3896-4753-a8f7-00c0b4c4bed8");

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
                    { "02e217a8-5139-4014-bf74-ec78b161e79f", null, "Administrator", "ADMINISTRATOR" },
                    { "bc74267d-cbad-4d15-a444-fd7be963849a", null, "User", "USER" }
                });

            migrationBuilder.UpdateData(
                table: "Clubs",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2025, 8, 7, 3, 30, 22, 514, DateTimeKind.Utc).AddTicks(1613));

            migrationBuilder.UpdateData(
                table: "Clubs",
                keyColumn: "Id",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2025, 8, 7, 3, 30, 22, 514, DateTimeKind.Utc).AddTicks(1624));

            migrationBuilder.UpdateData(
                table: "Clubs",
                keyColumn: "Id",
                keyValue: 3,
                column: "CreatedAt",
                value: new DateTime(2025, 8, 7, 3, 30, 22, 514, DateTimeKind.Utc).AddTicks(1626));

            migrationBuilder.UpdateData(
                table: "Reviews",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2025, 8, 7, 3, 30, 22, 514, DateTimeKind.Utc).AddTicks(1500));

            migrationBuilder.UpdateData(
                table: "Reviews",
                keyColumn: "Id",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2025, 8, 7, 3, 30, 22, 514, DateTimeKind.Utc).AddTicks(1506));

            migrationBuilder.UpdateData(
                table: "Reviews",
                keyColumn: "Id",
                keyValue: 3,
                column: "CreatedAt",
                value: new DateTime(2025, 8, 7, 3, 30, 22, 514, DateTimeKind.Utc).AddTicks(1507));

            migrationBuilder.UpdateData(
                table: "Universities",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2025, 8, 7, 3, 30, 22, 514, DateTimeKind.Utc).AddTicks(1799));

            migrationBuilder.UpdateData(
                table: "Universities",
                keyColumn: "Id",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2025, 8, 7, 3, 30, 22, 514, DateTimeKind.Utc).AddTicks(1805));
        }
    }
}
