using CSCI_490_TEAM_4_PROJECT.Server.Data;
using CSCI_490_TEAM_4_PROJECT.Server.Models;
using Microsoft.EntityFrameworkCore;

namespace CSCI_490_TEAM_4_PROJECT.Server.Repository
{
    public class BudgetCatRepository : IBudgetCatRepository
    {
        private readonly ApplicationDbContext _context;

        public BudgetCatRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        private DbSet<BudgetCat> BudgetCat => _context.Set<BudgetCat>();

        public async Task<BudgetCat[]> GetBudgetCat(int budgetCatId)
        {
            return await _context.BudgetCat.Where(x => x.BudgetId == budgetCatId).ToArrayAsync();
        }

        public async Task AddBudgetCat(BudgetCat budgetCat)
        {
            await BudgetCat.AddAsync(budgetCat);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateBudgetCat(BudgetCat budgetCat)
        {
            BudgetCat.Update(budgetCat);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteBudgetCat(int budgetCatId)
        {
            var budgetCat = await BudgetCat.FindAsync(budgetCatId);
            if (budgetCat != null)
            {
                BudgetCat.Remove(budgetCat);
                await _context.SaveChangesAsync();
            }
        }
    }
}
