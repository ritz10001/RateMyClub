using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace server.Migrations
{
    /// <inheritdoc />
    public partial class AddedUniversity : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "UniversityId",
                table: "Clubs",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateTable(
                name: "University",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Location = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_University", x => x.Id);
                });

            migrationBuilder.UpdateData(
                table: "Clubs",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreatedAt", "UniversityId" },
                values: new object[] { new DateTime(2025, 1, 26, 3, 43, 17, 267, DateTimeKind.Utc).AddTicks(3872), 1 });

            migrationBuilder.UpdateData(
                table: "Clubs",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "CreatedAt", "UniversityId" },
                values: new object[] { new DateTime(2025, 1, 26, 3, 43, 17, 267, DateTimeKind.Utc).AddTicks(5028), 1 });

            migrationBuilder.UpdateData(
                table: "Clubs",
                keyColumn: "Id",
                keyValue: 3,
                columns: new[] { "CreatedAt", "UniversityId" },
                values: new object[] { new DateTime(2025, 1, 26, 3, 43, 17, 267, DateTimeKind.Utc).AddTicks(5031), 1 });

            migrationBuilder.UpdateData(
                table: "Reviews",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2025, 1, 26, 3, 43, 17, 267, DateTimeKind.Utc).AddTicks(5692));

            migrationBuilder.UpdateData(
                table: "Reviews",
                keyColumn: "Id",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2025, 1, 26, 3, 43, 17, 267, DateTimeKind.Utc).AddTicks(6769));

            migrationBuilder.UpdateData(
                table: "Reviews",
                keyColumn: "Id",
                keyValue: 3,
                column: "CreatedAt",
                value: new DateTime(2025, 1, 26, 3, 43, 17, 267, DateTimeKind.Utc).AddTicks(6772));

            migrationBuilder.InsertData(
                table: "University",
                columns: new[] { "Id", "Location", "Name" },
                values: new object[,]
                {
                    { 1, "Lubbock, TX", "Texas Tech University" },
                    { 2, "Dallas, TX", "University of Texas at Dallas" }
                });

            migrationBuilder.CreateIndex(
                name: "IX_Clubs_UniversityId",
                table: "Clubs",
                column: "UniversityId");

            migrationBuilder.AddForeignKey(
                name: "FK_Clubs_University_UniversityId",
                table: "Clubs",
                column: "UniversityId",
                principalTable: "University",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Clubs_University_UniversityId",
                table: "Clubs");

            migrationBuilder.DropTable(
                name: "University");

            migrationBuilder.DropIndex(
                name: "IX_Clubs_UniversityId",
                table: "Clubs");

            migrationBuilder.DropColumn(
                name: "UniversityId",
                table: "Clubs");

            migrationBuilder.UpdateData(
                table: "Clubs",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2025, 1, 23, 21, 11, 22, 625, DateTimeKind.Utc).AddTicks(70));

            migrationBuilder.UpdateData(
                table: "Clubs",
                keyColumn: "Id",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2025, 1, 23, 21, 11, 22, 625, DateTimeKind.Utc).AddTicks(990));

            migrationBuilder.UpdateData(
                table: "Clubs",
                keyColumn: "Id",
                keyValue: 3,
                column: "CreatedAt",
                value: new DateTime(2025, 1, 23, 21, 11, 22, 625, DateTimeKind.Utc).AddTicks(992));

            migrationBuilder.UpdateData(
                table: "Reviews",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2025, 1, 23, 21, 11, 22, 625, DateTimeKind.Utc).AddTicks(1523));

            migrationBuilder.UpdateData(
                table: "Reviews",
                keyColumn: "Id",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2025, 1, 23, 21, 11, 22, 625, DateTimeKind.Utc).AddTicks(2660));

            migrationBuilder.UpdateData(
                table: "Reviews",
                keyColumn: "Id",
                keyValue: 3,
                column: "CreatedAt",
                value: new DateTime(2025, 1, 23, 21, 11, 22, 625, DateTimeKind.Utc).AddTicks(2662));
        }
    }
}
