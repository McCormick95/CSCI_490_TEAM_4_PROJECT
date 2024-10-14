using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CSCI_490_TEAM_4_PROJECT.Server.Models
{
    public class Budget
    {
        [Column("budget_ID")]
        [Key]
        public int BudgetId { get; set; }

        [Column("year")]
        public int Year { get; set; }

        [Column("month")]
        public int Month { get; set; }

        [Column("monthly_income")]
        public double MonthIncome { get; set; }
    }

}
