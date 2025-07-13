using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace server.Migrations
{
    /// <inheritdoc />
    public partial class AddedLocationToUniRequests : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "14b285d7-1713-44fc-a0f9-063fb1b9175d");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "1c1f9579-4891-46a4-b93c-9ce9fe1fdeb7");

            migrationBuilder.RenameColumn(
                name: "Name",
                table: "UniversityRequests",
                newName: "UniversityName");

            migrationBuilder.AlterColumn<string>(
                name: "AdditionalInfo",
                table: "UniversityRequests",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AddColumn<string>(
                name: "Location",
                table: "UniversityRequests",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "OfficialWebsite",
                table: "UniversityRequests",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "SchoolType",
                table: "UniversityRequests",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

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

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "af75d9d4-5772-45b5-8e99-177e27d0a50d");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "f148d12e-62b3-4cc1-8c7a-a44310e1f2a0");

            migrationBuilder.DropColumn(
                name: "Location",
                table: "UniversityRequests");

            migrationBuilder.DropColumn(
                name: "OfficialWebsite",
                table: "UniversityRequests");

            migrationBuilder.DropColumn(
                name: "SchoolType",
                table: "UniversityRequests");

            migrationBuilder.RenameColumn(
                name: "UniversityName",
                table: "UniversityRequests",
                newName: "Name");

            migrationBuilder.AlterColumn<string>(
                name: "AdditionalInfo",
                table: "UniversityRequests",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);

            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[,]
                {
                    { "14b285d7-1713-44fc-a0f9-063fb1b9175d", null, "User", "USER" },
                    { "1c1f9579-4891-46a4-b93c-9ce9fe1fdeb7", null, "Administrator", "ADMINISTRATOR" }
                });

            migrationBuilder.UpdateData(
                table: "Clubs",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2025, 7, 12, 19, 29, 16, 731, DateTimeKind.Utc).AddTicks(8501));

            migrationBuilder.UpdateData(
                table: "Clubs",
                keyColumn: "Id",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2025, 7, 12, 19, 29, 16, 731, DateTimeKind.Utc).AddTicks(8509));

            migrationBuilder.UpdateData(
                table: "Clubs",
                keyColumn: "Id",
                keyValue: 3,
                column: "CreatedAt",
                value: new DateTime(2025, 7, 12, 19, 29, 16, 731, DateTimeKind.Utc).AddTicks(8511));

            migrationBuilder.UpdateData(
                table: "Reviews",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2025, 7, 12, 19, 29, 16, 731, DateTimeKind.Utc).AddTicks(8392));

            migrationBuilder.UpdateData(
                table: "Reviews",
                keyColumn: "Id",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2025, 7, 12, 19, 29, 16, 731, DateTimeKind.Utc).AddTicks(8397));

            migrationBuilder.UpdateData(
                table: "Reviews",
                keyColumn: "Id",
                keyValue: 3,
                column: "CreatedAt",
                value: new DateTime(2025, 7, 12, 19, 29, 16, 731, DateTimeKind.Utc).AddTicks(8398));

            migrationBuilder.UpdateData(
                table: "Universities",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2025, 7, 12, 19, 29, 16, 731, DateTimeKind.Utc).AddTicks(8608));

            migrationBuilder.UpdateData(
                table: "Universities",
                keyColumn: "Id",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2025, 7, 12, 19, 29, 16, 731, DateTimeKind.Utc).AddTicks(8612));
        }
    }
}
