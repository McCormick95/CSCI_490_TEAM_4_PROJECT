using CSCI_490_TEAM_4_PROJECT.Server.Models;
using CSCI_490_TEAM_4_PROJECT.Server.Repository;

namespace CSCI_490_TEAM_4_PROJECT.Server.Services
{
    public class ExpenseServices
    {
        private readonly IExpenseRepository _expenseRepository;

        public ExpenseServices(IExpenseRepository expenseRepository)
        {
            _expenseRepository = expenseRepository;
        }

        public async Task<IEnumerable<Expense>> GetAllExpenses()
        {
            return await _expenseRepository.GetAllExpenses();
        }

        public async Task<Expense> GetExpenseById(int expenseId)
        {
            return await _expenseRepository.GetExpenseById(expenseId);
        }

        public async Task AddExpense(Expense expense)
        {
            try
            {
                await _expenseRepository.AddExpense(expense);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"An exception occurred in ExpenseServices @ AddExpense(): {ex.Message}");
                throw;
            }
        }

        public async Task UpdateExpense(Expense expense)
        {
            await _expenseRepository.UpdateExpense(expense);
        }

        public async Task DeleteExpense(int expenseId)
        {
            await _expenseRepository.DeleteExpense(expenseId);
        }
    }
}
