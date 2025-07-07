using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace server.Migrations
{
    /// <inheritdoc />
    public partial class AddTagsToClub : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "66420ab6-cbdd-4271-a54d-d44ba255f2c9");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "f0933dd3-df3e-4dc8-9998-155d4821f80f");

            migrationBuilder.AddColumn<string>(
                name: "Tags",
                table: "Clubs",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

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
                columns: new[] { "CreatedAt", "Tags" },
                values: new object[] { new DateTime(2025, 7, 7, 3, 23, 2, 310, DateTimeKind.Utc).AddTicks(2060), "[]" });

            migrationBuilder.UpdateData(
                table: "Clubs",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "CreatedAt", "Tags" },
                values: new object[] { new DateTime(2025, 7, 7, 3, 23, 2, 310, DateTimeKind.Utc).AddTicks(2071), "[]" });

            migrationBuilder.UpdateData(
                table: "Clubs",
                keyColumn: "Id",
                keyValue: 3,
                columns: new[] { "CreatedAt", "Tags" },
                values: new object[] { new DateTime(2025, 7, 7, 3, 23, 2, 310, DateTimeKind.Utc).AddTicks(2074), "[]" });

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

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "2f81923c-f26f-4f3b-b53d-14b7766e8436");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "7d519765-0fc3-426d-8b48-24a454558ea1");

            migrationBuilder.DropColumn(
                name: "Tags",
                table: "Clubs");

            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[,]
                {
                    { "66420ab6-cbdd-4271-a54d-d44ba255f2c9", null, "User", "USER" },
                    { "f0933dd3-df3e-4dc8-9998-155d4821f80f", null, "Administrator", "ADMINISTRATOR" }
                });

            migrationBuilder.UpdateData(
                table: "Clubs",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2025, 6, 9, 0, 17, 0, 607, DateTimeKind.Utc).AddTicks(7429));

            migrationBuilder.UpdateData(
                table: "Clubs",
                keyColumn: "Id",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2025, 6, 9, 0, 17, 0, 607, DateTimeKind.Utc).AddTicks(7441));

            migrationBuilder.UpdateData(
                table: "Clubs",
                keyColumn: "Id",
                keyValue: 3,
                column: "CreatedAt",
                value: new DateTime(2025, 6, 9, 0, 17, 0, 607, DateTimeKind.Utc).AddTicks(7443));

            migrationBuilder.UpdateData(
                table: "Reviews",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2025, 6, 9, 0, 17, 0, 607, DateTimeKind.Utc).AddTicks(7315));

            migrationBuilder.UpdateData(
                table: "Reviews",
                keyColumn: "Id",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2025, 6, 9, 0, 17, 0, 607, DateTimeKind.Utc).AddTicks(7324));

            migrationBuilder.UpdateData(
                table: "Reviews",
                keyColumn: "Id",
                keyValue: 3,
                column: "CreatedAt",
                value: new DateTime(2025, 6, 9, 0, 17, 0, 607, DateTimeKind.Utc).AddTicks(7325));

            migrationBuilder.UpdateData(
                table: "Universities",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2025, 6, 9, 0, 17, 0, 607, DateTimeKind.Utc).AddTicks(7534));

            migrationBuilder.UpdateData(
                table: "Universities",
                keyColumn: "Id",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2025, 6, 9, 0, 17, 0, 607, DateTimeKind.Utc).AddTicks(7539));
        }
    }
}
