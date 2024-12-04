using CSCI_490_TEAM_4_PROJECT.Server.Data;
using CSCI_490_TEAM_4_PROJECT.Server.Models;
using Microsoft.EntityFrameworkCore;

namespace CSCI_490_TEAM_4_PROJECT.Server.Repository
{
    public class ExpenseRepository : IExpenseRepository
    {
        private readonly ApplicationDbContext _context;

        public ExpenseRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Expense>> GetAllExpenses()
        {
            return await _context.Expense.ToListAsync();
        }

        public async Task<Expense> GetExpenseById(int expenseId)
        {
            return await _context.Expense.FindAsync(expenseId);
        }

        public async Task AddExpense(Expense expense)
        {
            await _context.Expense.AddAsync(expense);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateExpense(Expense expense)
        {
            _context.Expense.Update(expense);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteExpense(int expenseId)
        {
            var expense = await _context.Expense.FindAsync(expenseId);
            if (expense != null)
            {
                _context.Expense.Remove(expense);
                await _context.SaveChangesAsync();
            }
        }
    }
}
