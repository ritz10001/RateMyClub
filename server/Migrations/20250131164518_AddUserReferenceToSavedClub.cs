using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace server.Migrations
{
    /// <inheritdoc />
    public partial class AddUserReferenceToSavedClub : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_SavedClubs_AspNetUsers_UserId",
                table: "SavedClubs");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "5418773b-c2f4-4183-9fb8-5319f83a04cc");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "baf37caf-c141-474b-ae4c-56ba85fab8ca");

            migrationBuilder.AlterColumn<string>(
                name: "UserId",
                table: "SavedClubs",
                type: "nvarchar(450)",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "nvarchar(450)",
                oldNullable: true);

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

            migrationBuilder.AddForeignKey(
                name: "FK_SavedClubs_AspNetUsers_UserId",
                table: "SavedClubs",
                column: "UserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_SavedClubs_AspNetUsers_UserId",
                table: "SavedClubs");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "7872ef13-a5f8-4a3c-8122-1c1bdfade86e");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "a5c91169-1c04-4a38-8489-5fe1181191d7");

            migrationBuilder.AlterColumn<string>(
                name: "UserId",
                table: "SavedClubs",
                type: "nvarchar(450)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(450)");

            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[,]
                {
                    { "5418773b-c2f4-4183-9fb8-5319f83a04cc", null, "Administrator", "ADMINISTRATOR" },
                    { "baf37caf-c141-474b-ae4c-56ba85fab8ca", null, "User", "USER" }
                });

            migrationBuilder.UpdateData(
                table: "Clubs",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2025, 1, 31, 3, 7, 17, 243, DateTimeKind.Utc).AddTicks(9519));

            migrationBuilder.UpdateData(
                table: "Clubs",
                keyColumn: "Id",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2025, 1, 31, 3, 7, 17, 244, DateTimeKind.Utc).AddTicks(1272));

            migrationBuilder.UpdateData(
                table: "Clubs",
                keyColumn: "Id",
                keyValue: 3,
                column: "CreatedAt",
                value: new DateTime(2025, 1, 31, 3, 7, 17, 244, DateTimeKind.Utc).AddTicks(1278));

            migrationBuilder.UpdateData(
                table: "Reviews",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2025, 1, 31, 3, 7, 17, 243, DateTimeKind.Utc).AddTicks(2678));

            migrationBuilder.UpdateData(
                table: "Reviews",
                keyColumn: "Id",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2025, 1, 31, 3, 7, 17, 243, DateTimeKind.Utc).AddTicks(4744));

            migrationBuilder.UpdateData(
                table: "Reviews",
                keyColumn: "Id",
                keyValue: 3,
                column: "CreatedAt",
                value: new DateTime(2025, 1, 31, 3, 7, 17, 243, DateTimeKind.Utc).AddTicks(4748));

            migrationBuilder.AddForeignKey(
                name: "FK_SavedClubs_AspNetUsers_UserId",
                table: "SavedClubs",
                column: "UserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id");
        }
    }
}
