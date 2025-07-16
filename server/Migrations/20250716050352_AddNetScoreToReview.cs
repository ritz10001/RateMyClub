using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace server.Migrations
{
    /// <inheritdoc />
    public partial class AddNetScoreToReview : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "3f49f5d8-316a-4944-8c47-4a3b9a69ccb9");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "f4c728b7-1673-48a2-99f8-174c8686edca");

            migrationBuilder.AddColumn<int>(
                name: "NetScore",
                table: "Reviews",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[,]
                {
                    { "51ea1b96-f8b4-4511-97bf-bcf8dbb75904", null, "Administrator", "ADMINISTRATOR" },
                    { "832afd11-5c76-4ab8-aaca-ebb0de1cde1f", null, "User", "USER" }
                });

            migrationBuilder.UpdateData(
                table: "Clubs",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2025, 7, 16, 5, 3, 52, 410, DateTimeKind.Utc).AddTicks(2680));

            migrationBuilder.UpdateData(
                table: "Clubs",
                keyColumn: "Id",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2025, 7, 16, 5, 3, 52, 410, DateTimeKind.Utc).AddTicks(2690));

            migrationBuilder.UpdateData(
                table: "Clubs",
                keyColumn: "Id",
                keyValue: 3,
                column: "CreatedAt",
                value: new DateTime(2025, 7, 16, 5, 3, 52, 410, DateTimeKind.Utc).AddTicks(2693));

            migrationBuilder.UpdateData(
                table: "Reviews",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreatedAt", "NetScore" },
                values: new object[] { new DateTime(2025, 7, 16, 5, 3, 52, 410, DateTimeKind.Utc).AddTicks(2558), 0 });

            migrationBuilder.UpdateData(
                table: "Reviews",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "CreatedAt", "NetScore" },
                values: new object[] { new DateTime(2025, 7, 16, 5, 3, 52, 410, DateTimeKind.Utc).AddTicks(2565), 0 });

            migrationBuilder.UpdateData(
                table: "Reviews",
                keyColumn: "Id",
                keyValue: 3,
                columns: new[] { "CreatedAt", "NetScore" },
                values: new object[] { new DateTime(2025, 7, 16, 5, 3, 52, 410, DateTimeKind.Utc).AddTicks(2567), 0 });

            migrationBuilder.UpdateData(
                table: "Universities",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2025, 7, 16, 5, 3, 52, 410, DateTimeKind.Utc).AddTicks(2810));

            migrationBuilder.UpdateData(
                table: "Universities",
                keyColumn: "Id",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2025, 7, 16, 5, 3, 52, 410, DateTimeKind.Utc).AddTicks(2816));
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "51ea1b96-f8b4-4511-97bf-bcf8dbb75904");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "832afd11-5c76-4ab8-aaca-ebb0de1cde1f");

            migrationBuilder.DropColumn(
                name: "NetScore",
                table: "Reviews");

            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[,]
                {
                    { "3f49f5d8-316a-4944-8c47-4a3b9a69ccb9", null, "User", "USER" },
                    { "f4c728b7-1673-48a2-99f8-174c8686edca", null, "Administrator", "ADMINISTRATOR" }
                });

            migrationBuilder.UpdateData(
                table: "Clubs",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2025, 7, 15, 5, 28, 13, 535, DateTimeKind.Utc).AddTicks(1489));

            migrationBuilder.UpdateData(
                table: "Clubs",
                keyColumn: "Id",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2025, 7, 15, 5, 28, 13, 535, DateTimeKind.Utc).AddTicks(1498));

            migrationBuilder.UpdateData(
                table: "Clubs",
                keyColumn: "Id",
                keyValue: 3,
                column: "CreatedAt",
                value: new DateTime(2025, 7, 15, 5, 28, 13, 535, DateTimeKind.Utc).AddTicks(1500));

            migrationBuilder.UpdateData(
                table: "Reviews",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2025, 7, 15, 5, 28, 13, 535, DateTimeKind.Utc).AddTicks(1384));

            migrationBuilder.UpdateData(
                table: "Reviews",
                keyColumn: "Id",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2025, 7, 15, 5, 28, 13, 535, DateTimeKind.Utc).AddTicks(1393));

            migrationBuilder.UpdateData(
                table: "Reviews",
                keyColumn: "Id",
                keyValue: 3,
                column: "CreatedAt",
                value: new DateTime(2025, 7, 15, 5, 28, 13, 535, DateTimeKind.Utc).AddTicks(1395));

            migrationBuilder.UpdateData(
                table: "Universities",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2025, 7, 15, 5, 28, 13, 535, DateTimeKind.Utc).AddTicks(1606));

            migrationBuilder.UpdateData(
                table: "Universities",
                keyColumn: "Id",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2025, 7, 15, 5, 28, 13, 535, DateTimeKind.Utc).AddTicks(1613));
        }
    }
}
