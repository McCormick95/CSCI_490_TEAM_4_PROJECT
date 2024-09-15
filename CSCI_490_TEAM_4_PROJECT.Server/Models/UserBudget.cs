using System.ComponentModel.DataAnnotations.Schema;

namespace CSCI_490_TEAM_4_PROJECT.Server.Models
{
    public class UserBudget
    {
        [Column("user_ID")]
        public int UserId { get; set; }

        [Column("budget_ID")]
        public int BudgetId { get; set; }
    }
}
