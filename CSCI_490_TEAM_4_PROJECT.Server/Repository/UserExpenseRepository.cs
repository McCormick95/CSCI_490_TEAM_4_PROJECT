using CSCI_490_TEAM_4_PROJECT.Server.Data;
using CSCI_490_TEAM_4_PROJECT.Server.Models;
using Microsoft.EntityFrameworkCore;

namespace CSCI_490_TEAM_4_PROJECT.Server.Repository
{
    public class UserExpenseRepository : IUserExpenseRepository
    {
        private readonly ApplicationDbContext _context;

        public UserExpenseRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        private DbSet<UserExpense> UserExpense => _context.Set<UserExpense>();

        public async Task<UserExpense> GetUserExpenseById(int userId)
        {
            return await _context.UserExpense.FirstOrDefaultAsync(x => x.UserId == userId);
        }

        public async Task AddUserExpense(UserExpense userExpense)
        {
            await UserExpense.AddAsync(userExpense);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateUserExpense(UserExpense userExpense)
        {
            UserExpense.Update(userExpense);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteUserExpense(int userId)
        {
            var userExpense = await UserExpense.FindAsync(userId);
            if (userExpense != null)
            {
                UserExpense.Remove(userExpense);
                await _context.SaveChangesAsync();
            }
        }
    }
}
