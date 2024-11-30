using CSCI_490_TEAM_4_PROJECT.Server.Data;
using CSCI_490_TEAM_4_PROJECT.Server.Models;
using Microsoft.EntityFrameworkCore;

namespace CSCI_490_TEAM_4_PROJECT.Server.Repository
{
    public class UserBudgetRepository : IUserBudgetRepository
    {
        private readonly ApplicationDbContext _context;

        public UserBudgetRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        private DbSet<UserBudget> UserBudget => _context.Set<UserBudget>();

        public async Task<UserBudget[]> GetUserBudgetById(int userId)
        {
            return await _context.UserBudget.Where(x => x.UserId == userId).ToArrayAsync();
        }

        public async Task AddUserBudget(UserBudget userBudget)
        {
            await UserBudget.AddAsync(userBudget);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateUserBudget(UserBudget userBudget)
        {
            UserBudget.Update(userBudget);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteUserBudget(int userId)
        {
            var userBudget = await UserBudget.FindAsync(userId);
            if (userBudget != null)
            {
                UserBudget.Remove(userBudget);
                await _context.SaveChangesAsync();
            }
        }
    }
}
