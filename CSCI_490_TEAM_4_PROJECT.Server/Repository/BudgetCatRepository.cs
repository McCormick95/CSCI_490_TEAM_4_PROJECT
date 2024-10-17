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

        private DbSet<BudgetCat> BudgetCats => _context.Set<BudgetCat>();

        public async Task<BudgetCat> GetBudgetCat(int budgetCatId)
        {
            return await BudgetCats.FindAsync(budgetCatId);
        }

        public async Task AddBudgetCat(BudgetCat budgetCat)
        {
            await BudgetCats.AddAsync(budgetCat);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateBudgetCat(BudgetCat budgetCat)
        {
            BudgetCats.Update(budgetCat);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteBudgetCat(int budgetCatId)
        {
            var budgetCat = await BudgetCats.FindAsync(budgetCatId);
            if (budgetCat != null)
            {
                BudgetCats.Remove(budgetCat);
                await _context.SaveChangesAsync();
            }
        }
    }
}
