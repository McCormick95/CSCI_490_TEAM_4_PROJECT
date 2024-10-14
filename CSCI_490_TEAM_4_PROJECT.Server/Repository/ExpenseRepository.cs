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

        private DbSet<Expense> Expenses => _context.Set<Expense>();

        public async Task<Expense> GetExpenseById(int expenseId)
        {
            return await Expenses.FindAsync(expenseId);
        }

        public async Task AddExpense(Expense expense)
        {
            await Expenses.AddAsync(expense);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateExpense(Expense expense)
        {
            Expenses.Update(expense);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteExpense(int expenseId)
        {
            var expense = await Expenses.FindAsync(expenseId);
            if (expense != null)
            {
                Expenses.Remove(expense);
                await _context.SaveChangesAsync();
            }
        }
    }
}
