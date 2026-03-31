using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace perfumeshopbackend.Migrations
{
    /// <inheritdoc />
    public partial class Updatedpayment : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "DlvrAdrsZpCode",
                table: "Orders");

            migrationBuilder.RenameColumn(
                name: "DlvrAdrsState",
                table: "Orders",
                newName: "BillingZip");

            migrationBuilder.RenameColumn(
                name: "DlvrAdrsPhone",
                table: "Orders",
                newName: "PaymentId");

            migrationBuilder.RenameColumn(
                name: "DlvrAdrsName",
                table: "Orders",
                newName: "BillingStreet");

            migrationBuilder.RenameColumn(
                name: "DlvrAdrsCity",
                table: "Orders",
                newName: "BillingState");

            migrationBuilder.RenameColumn(
                name: "DlvrAdrs2",
                table: "Orders",
                newName: "BillingCountry");

            migrationBuilder.RenameColumn(
                name: "DlvrAdrs",
                table: "Orders",
                newName: "BillingCity");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "PaymentId",
                table: "Orders",
                newName: "DlvrAdrsPhone");

            migrationBuilder.RenameColumn(
                name: "BillingZip",
                table: "Orders",
                newName: "DlvrAdrsState");

            migrationBuilder.RenameColumn(
                name: "BillingStreet",
                table: "Orders",
                newName: "DlvrAdrsName");

            migrationBuilder.RenameColumn(
                name: "BillingState",
                table: "Orders",
                newName: "DlvrAdrsCity");

            migrationBuilder.RenameColumn(
                name: "BillingCountry",
                table: "Orders",
                newName: "DlvrAdrs2");

            migrationBuilder.RenameColumn(
                name: "BillingCity",
                table: "Orders",
                newName: "DlvrAdrs");

            migrationBuilder.AddColumn<int>(
                name: "DlvrAdrsZpCode",
                table: "Orders",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }
    }
}
