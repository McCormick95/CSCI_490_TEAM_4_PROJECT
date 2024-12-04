using CSCI_490_TEAM_4_PROJECT.Server.Data;
using CSCI_490_TEAM_4_PROJECT.Server.Models;
using Microsoft.EntityFrameworkCore;

namespace CSCI_490_TEAM_4_PROJECT.Server.Repository
{
    public class BudgetRepository : IBudgetRepository
    {
        private readonly ApplicationDbContext _context;

        public BudgetRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Budget>> GetAllBudgets()
        {
            return await _context.Budget.ToListAsync();
        }

        public async Task<Budget> GetBudgetById(int budgetId)
        {
            return await _context.Budget.FirstOrDefaultAsync(b => b.BudgetId == budgetId);
        }

        public async Task AddBudget(Budget budget)
        {
            _context.Budget.Add(budget);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateBudget(Budget budget)
        {
            _context.Budget.Update(budget);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteBudget(int budgetId)
        {
            var budget = await _context.Budget.FirstOrDefaultAsync(b => b.BudgetId == budgetId);
            if (budget != null)
            {
                _context.Budget.Remove(budget);
                await _context.SaveChangesAsync();
            }
        }
    }
}
