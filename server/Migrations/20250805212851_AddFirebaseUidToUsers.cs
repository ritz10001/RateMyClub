using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace server.Migrations
{
    /// <inheritdoc />
    public partial class AddFirebaseUidToUsers : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "d89e6d37-5a53-412c-8bfe-85065a427e3e");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "eac8116e-ec99-4cb1-b3af-abd8c5d62330");

            migrationBuilder.AddColumn<string>(
                name: "FireBaseUid",
                table: "AspNetUsers",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[,]
                {
                    { "83cab2b0-fbd5-4086-8f62-8e2dd18f9cc2", null, "User", "USER" },
                    { "84f0ab2c-f4bf-4499-bbdf-d7b96a953601", null, "Administrator", "ADMINISTRATOR" }
                });

            migrationBuilder.UpdateData(
                table: "Clubs",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2025, 8, 5, 21, 28, 50, 924, DateTimeKind.Utc).AddTicks(9273));

            migrationBuilder.UpdateData(
                table: "Clubs",
                keyColumn: "Id",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2025, 8, 5, 21, 28, 50, 924, DateTimeKind.Utc).AddTicks(9281));

            migrationBuilder.UpdateData(
                table: "Clubs",
                keyColumn: "Id",
                keyValue: 3,
                column: "CreatedAt",
                value: new DateTime(2025, 8, 5, 21, 28, 50, 924, DateTimeKind.Utc).AddTicks(9283));

            migrationBuilder.UpdateData(
                table: "Reviews",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2025, 8, 5, 21, 28, 50, 924, DateTimeKind.Utc).AddTicks(9128));

            migrationBuilder.UpdateData(
                table: "Reviews",
                keyColumn: "Id",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2025, 8, 5, 21, 28, 50, 924, DateTimeKind.Utc).AddTicks(9133));

            migrationBuilder.UpdateData(
                table: "Reviews",
                keyColumn: "Id",
                keyValue: 3,
                column: "CreatedAt",
                value: new DateTime(2025, 8, 5, 21, 28, 50, 924, DateTimeKind.Utc).AddTicks(9135));

            migrationBuilder.UpdateData(
                table: "Universities",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2025, 8, 5, 21, 28, 50, 924, DateTimeKind.Utc).AddTicks(9385));

            migrationBuilder.UpdateData(
                table: "Universities",
                keyColumn: "Id",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2025, 8, 5, 21, 28, 50, 924, DateTimeKind.Utc).AddTicks(9391));
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "83cab2b0-fbd5-4086-8f62-8e2dd18f9cc2");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "84f0ab2c-f4bf-4499-bbdf-d7b96a953601");

            migrationBuilder.DropColumn(
                name: "FireBaseUid",
                table: "AspNetUsers");

            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[,]
                {
                    { "d89e6d37-5a53-412c-8bfe-85065a427e3e", null, "Administrator", "ADMINISTRATOR" },
                    { "eac8116e-ec99-4cb1-b3af-abd8c5d62330", null, "User", "USER" }
                });

            migrationBuilder.UpdateData(
                table: "Clubs",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2025, 7, 28, 1, 39, 49, 343, DateTimeKind.Utc).AddTicks(9209));

            migrationBuilder.UpdateData(
                table: "Clubs",
                keyColumn: "Id",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2025, 7, 28, 1, 39, 49, 343, DateTimeKind.Utc).AddTicks(9236));

            migrationBuilder.UpdateData(
                table: "Clubs",
                keyColumn: "Id",
                keyValue: 3,
                column: "CreatedAt",
                value: new DateTime(2025, 7, 28, 1, 39, 49, 343, DateTimeKind.Utc).AddTicks(9241));

            migrationBuilder.UpdateData(
                table: "Reviews",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2025, 7, 28, 1, 39, 49, 343, DateTimeKind.Utc).AddTicks(8654));

            migrationBuilder.UpdateData(
                table: "Reviews",
                keyColumn: "Id",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2025, 7, 28, 1, 39, 49, 343, DateTimeKind.Utc).AddTicks(8667));

            migrationBuilder.UpdateData(
                table: "Reviews",
                keyColumn: "Id",
                keyValue: 3,
                column: "CreatedAt",
                value: new DateTime(2025, 7, 28, 1, 39, 49, 343, DateTimeKind.Utc).AddTicks(8671));

            migrationBuilder.UpdateData(
                table: "Universities",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2025, 7, 28, 1, 39, 49, 343, DateTimeKind.Utc).AddTicks(9710));

            migrationBuilder.UpdateData(
                table: "Universities",
                keyColumn: "Id",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2025, 7, 28, 1, 39, 49, 343, DateTimeKind.Utc).AddTicks(9722));
        }
    }
}
