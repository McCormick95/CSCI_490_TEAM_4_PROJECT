namespace CSCI_490_TEAM_4_PROJECT.Server.Models
{
    public class Expense
    {
        public int ExpenseId { get; set; }
        public int Year { get; set; }
        public int Month { get; set; }
        public int Day { get; set; }
        public int CatId { get; set; }
        public string UserDesc { get; set; }
        public double Amount { get; set; }
    }
}
