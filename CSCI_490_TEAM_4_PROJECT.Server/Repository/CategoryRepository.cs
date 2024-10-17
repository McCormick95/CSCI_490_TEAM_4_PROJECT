using CSCI_490_TEAM_4_PROJECT.Server.Data;
using CSCI_490_TEAM_4_PROJECT.Server.Models;
using Microsoft.EntityFrameworkCore;

namespace CSCI_490_TEAM_4_PROJECT.Server.Repository
{
    public class CategoryRepository : ICategoryRepository
    {
        private readonly ApplicationDbContext _context;

        public CategoryRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        private DbSet<Category> Categories => _context.Set<Category>();

        public async Task<Category> GetCategoryById(int catId)
        {
            return await Categories.FindAsync(catId);
        }
    }
}
