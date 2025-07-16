using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace server.Migrations
{
    /// <inheritdoc />
    public partial class AddClubForeignKeyToSavedClubs : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "51ea1b96-f8b4-4511-97bf-bcf8dbb75904");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "832afd11-5c76-4ab8-aaca-ebb0de1cde1f");

            migrationBuilder.AddColumn<int>(
                name: "ClubId1",
                table: "SavedClubs",
                type: "int",
                nullable: true);

            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[,]
                {
                    { "1616e738-9415-4806-82e9-543253fe4737", null, "User", "USER" },
                    { "73e15e59-72b7-49fd-bd20-21e4104a2ac0", null, "Administrator", "ADMINISTRATOR" }
                });

            migrationBuilder.UpdateData(
                table: "Clubs",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2025, 7, 16, 18, 22, 27, 286, DateTimeKind.Utc).AddTicks(6619));

            migrationBuilder.UpdateData(
                table: "Clubs",
                keyColumn: "Id",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2025, 7, 16, 18, 22, 27, 286, DateTimeKind.Utc).AddTicks(6629));

            migrationBuilder.UpdateData(
                table: "Clubs",
                keyColumn: "Id",
                keyValue: 3,
                column: "CreatedAt",
                value: new DateTime(2025, 7, 16, 18, 22, 27, 286, DateTimeKind.Utc).AddTicks(6631));

            migrationBuilder.UpdateData(
                table: "Reviews",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2025, 7, 16, 18, 22, 27, 286, DateTimeKind.Utc).AddTicks(6500));

            migrationBuilder.UpdateData(
                table: "Reviews",
                keyColumn: "Id",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2025, 7, 16, 18, 22, 27, 286, DateTimeKind.Utc).AddTicks(6506));

            migrationBuilder.UpdateData(
                table: "Reviews",
                keyColumn: "Id",
                keyValue: 3,
                column: "CreatedAt",
                value: new DateTime(2025, 7, 16, 18, 22, 27, 286, DateTimeKind.Utc).AddTicks(6508));

            migrationBuilder.UpdateData(
                table: "Universities",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2025, 7, 16, 18, 22, 27, 286, DateTimeKind.Utc).AddTicks(6738));

            migrationBuilder.UpdateData(
                table: "Universities",
                keyColumn: "Id",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2025, 7, 16, 18, 22, 27, 286, DateTimeKind.Utc).AddTicks(6744));

            migrationBuilder.CreateIndex(
                name: "IX_SavedClubs_ClubId1",
                table: "SavedClubs",
                column: "ClubId1");

            migrationBuilder.AddForeignKey(
                name: "FK_SavedClubs_Clubs_ClubId1",
                table: "SavedClubs",
                column: "ClubId1",
                principalTable: "Clubs",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_SavedClubs_Clubs_ClubId1",
                table: "SavedClubs");

            migrationBuilder.DropIndex(
                name: "IX_SavedClubs_ClubId1",
                table: "SavedClubs");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "1616e738-9415-4806-82e9-543253fe4737");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "73e15e59-72b7-49fd-bd20-21e4104a2ac0");

            migrationBuilder.DropColumn(
                name: "ClubId1",
                table: "SavedClubs");

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
                column: "CreatedAt",
                value: new DateTime(2025, 7, 16, 5, 3, 52, 410, DateTimeKind.Utc).AddTicks(2558));

            migrationBuilder.UpdateData(
                table: "Reviews",
                keyColumn: "Id",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2025, 7, 16, 5, 3, 52, 410, DateTimeKind.Utc).AddTicks(2565));

            migrationBuilder.UpdateData(
                table: "Reviews",
                keyColumn: "Id",
                keyValue: 3,
                column: "CreatedAt",
                value: new DateTime(2025, 7, 16, 5, 3, 52, 410, DateTimeKind.Utc).AddTicks(2567));

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
    }
}
