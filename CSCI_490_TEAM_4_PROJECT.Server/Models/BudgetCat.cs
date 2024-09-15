using System.ComponentModel.DataAnnotations.Schema;

namespace CSCI_490_TEAM_4_PROJECT.Server.Models
{
    public class BudgetCat
    {
        [Column("budget_ID")]
        public int BudgetId { get; set; }

        [Column("cat_ID")]
        public int CatId { get; set; }

        [Column("budget_amount")]
        public double BudgetAmount { get; set; }
    }
}
