using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace server.Migrations
{
    /// <inheritdoc />
    public partial class RemovedForeignKeyAttributes : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "7872ef13-a5f8-4a3c-8122-1c1bdfade86e");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "a5c91169-1c04-4a38-8489-5fe1181191d7");

            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[,]
                {
                    { "80e6cda8-1aae-47d8-9e22-5c98cc5b70d1", null, "Administrator", "ADMINISTRATOR" },
                    { "c7be8fea-343b-438c-b2fa-25d6e5bd32e8", null, "User", "USER" }
                });

            migrationBuilder.UpdateData(
                table: "Clubs",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2025, 1, 31, 16, 55, 59, 591, DateTimeKind.Utc).AddTicks(253));

            migrationBuilder.UpdateData(
                table: "Clubs",
                keyColumn: "Id",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2025, 1, 31, 16, 55, 59, 591, DateTimeKind.Utc).AddTicks(1287));

            migrationBuilder.UpdateData(
                table: "Clubs",
                keyColumn: "Id",
                keyValue: 3,
                column: "CreatedAt",
                value: new DateTime(2025, 1, 31, 16, 55, 59, 591, DateTimeKind.Utc).AddTicks(1290));

            migrationBuilder.UpdateData(
                table: "Reviews",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2025, 1, 31, 16, 55, 59, 590, DateTimeKind.Utc).AddTicks(6517));

            migrationBuilder.UpdateData(
                table: "Reviews",
                keyColumn: "Id",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2025, 1, 31, 16, 55, 59, 590, DateTimeKind.Utc).AddTicks(7494));

            migrationBuilder.UpdateData(
                table: "Reviews",
                keyColumn: "Id",
                keyValue: 3,
                column: "CreatedAt",
                value: new DateTime(2025, 1, 31, 16, 55, 59, 590, DateTimeKind.Utc).AddTicks(7497));
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "80e6cda8-1aae-47d8-9e22-5c98cc5b70d1");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "c7be8fea-343b-438c-b2fa-25d6e5bd32e8");

            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[,]
                {
                    { "7872ef13-a5f8-4a3c-8122-1c1bdfade86e", null, "User", "USER" },
                    { "a5c91169-1c04-4a38-8489-5fe1181191d7", null, "Administrator", "ADMINISTRATOR" }
                });

            migrationBuilder.UpdateData(
                table: "Clubs",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2025, 1, 31, 16, 45, 17, 624, DateTimeKind.Utc).AddTicks(2811));

            migrationBuilder.UpdateData(
                table: "Clubs",
                keyColumn: "Id",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2025, 1, 31, 16, 45, 17, 624, DateTimeKind.Utc).AddTicks(3827));

            migrationBuilder.UpdateData(
                table: "Clubs",
                keyColumn: "Id",
                keyValue: 3,
                column: "CreatedAt",
                value: new DateTime(2025, 1, 31, 16, 45, 17, 624, DateTimeKind.Utc).AddTicks(3830));

            migrationBuilder.UpdateData(
                table: "Reviews",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2025, 1, 31, 16, 45, 17, 623, DateTimeKind.Utc).AddTicks(9185));

            migrationBuilder.UpdateData(
                table: "Reviews",
                keyColumn: "Id",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2025, 1, 31, 16, 45, 17, 624, DateTimeKind.Utc).AddTicks(214));

            migrationBuilder.UpdateData(
                table: "Reviews",
                keyColumn: "Id",
                keyValue: 3,
                column: "CreatedAt",
                value: new DateTime(2025, 1, 31, 16, 45, 17, 624, DateTimeKind.Utc).AddTicks(216));
        }
    }
}
