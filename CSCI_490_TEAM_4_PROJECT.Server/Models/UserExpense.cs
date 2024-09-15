using System.ComponentModel.DataAnnotations.Schema;

namespace CSCI_490_TEAM_4_PROJECT.Server.Models
{
    public class UserExpense
    {
        [Column("user_ID")]
        public int UserId { get; set; }

        [Column("expense_ID")]
        public int ExpenseId { get; set; }
    }
}
