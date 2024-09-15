using System.ComponentModel.DataAnnotations.Schema;

namespace CSCI_490_TEAM_4_PROJECT.Server.Models
{
    public class Expense
    {
        [Column("expense_ID")]
        public int ExpenseId { get; set; }

        [Column("year")]
        public int Year { get; set; }

        [Column("month")]
        public int Month { get; set; }

        [Column("day")]
        public int Day { get; set; }

        [Column("cat_ID")]
        public int CatId { get; set; }

        [Column("user_desc")]
        public required string UserDesc { get; set; }

        [Column("amount")]
        public double Amount { get; set; }
    }
}
