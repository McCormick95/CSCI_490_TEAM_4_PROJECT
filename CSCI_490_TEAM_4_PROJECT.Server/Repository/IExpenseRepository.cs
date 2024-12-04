using CSCI_490_TEAM_4_PROJECT.Server.Models;

namespace CSCI_490_TEAM_4_PROJECT.Server.Repository
{
    public interface IExpenseRepository
    {
        Task<IEnumerable<Expense>> GetAllExpenses();
        Task<Expense> GetExpenseById(int expense);
        Task AddExpense(Expense expense);
        Task UpdateExpense(Expense expense);
        Task DeleteExpense(int expenseId);
    }
}
