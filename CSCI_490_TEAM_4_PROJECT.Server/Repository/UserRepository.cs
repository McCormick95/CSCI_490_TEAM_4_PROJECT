using CSCI_490_TEAM_4_PROJECT.Server.Data;
using CSCI_490_TEAM_4_PROJECT.Server.Models;
using Microsoft.EntityFrameworkCore;

namespace CSCI_490_TEAM_4_PROJECT.Server.Repository
{
    public class UserRepository : IUserRepository
    {
        private readonly ApplicationDbContext _context;

        public UserRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        private DbSet<User> Users => _context.Set<User>();

        public async Task<User> GetUserById(int userId)
        {
            return await Users.FindAsync(userId);
        }

        public async Task AddUser(User user)
        {
            await Users.AddAsync(user);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateUser(User user)
        {
            Users.Update(user);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteUser(int userId)
        {
            var user = await Users.FindAsync(userId);
            if (user != null)
            {
                Users.Remove(user);
                await _context.SaveChangesAsync();
            }
        }
    }

}
