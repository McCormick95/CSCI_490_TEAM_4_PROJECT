using CSCI_490_TEAM_4_PROJECT.Server.Models;
using CSCI_490_TEAM_4_PROJECT.Server.Repository;

namespace CSCI_490_TEAM_4_PROJECT.Server.Services
{
    public class UserBudgetServices
    {
        private readonly IUserBudgetRepository _userBudgetRepository;

        public UserBudgetServices(IUserBudgetRepository userBudgetRepository)
        {
            _userBudgetRepository = userBudgetRepository;
        }

        public async Task<UserBudget> GetUserBudgetById(int userId)
        {
            return await _userBudgetRepository.GetUserBudgetById(userId);
        }

        public async Task AddUserBudget(UserBudget userBudget)
        {
            try
            {
                await _userBudgetRepository.AddUserBudget(userBudget);
            }
            catch (Exception ex)
            {
                // Print or log an error message
                Console.WriteLine($"An exception occurred in UserBudgetServices @ AddUserBudget(): {ex.Message}");
            }
        }

        public async Task UpdateUserBudget(UserBudget userBudget)
        {
            await _userBudgetRepository.UpdateUserBudget(userBudget);
        }

        public async Task DeleteUserBudget(int userId)
        {
            await _userBudgetRepository.DeleteUserBudget(userId);
        }
    }
}
