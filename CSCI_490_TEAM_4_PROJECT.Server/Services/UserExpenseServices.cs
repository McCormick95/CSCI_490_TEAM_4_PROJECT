using CSCI_490_TEAM_4_PROJECT.Server.Models;
using CSCI_490_TEAM_4_PROJECT.Server.Repository;

namespace CSCI_490_TEAM_4_PROJECT.Server.Services
{
    public class UserExpenseServices
    {
        private readonly IUserExpenseRepository _userExpenseRepository;

        public UserExpenseServices(IUserExpenseRepository userExpenseRepository)
        {
            _userExpenseRepository = userExpenseRepository;
        }

        public async Task<UserExpense[]> GetUserExpenseById(int userId)
        {
            return await _userExpenseRepository.GetUserExpenseById(userId);
        }

        public async Task AddUserExpense(UserExpense userExpense)
        {
            try
            {
                await _userExpenseRepository.AddUserExpense(userExpense);
            }
            catch (Exception ex)
            {
                // Print or log an error message
                Console.WriteLine($"An exception occurred in UserExpenseServices @ AddUserExpense(): {ex.Message}");
            }
        }

        public async Task UpdateUserExpense(UserExpense userExpense)
        {
            await _userExpenseRepository.UpdateUserExpense(userExpense);
        }

        public async Task DeleteUserExpense(int userId)
        {
            await _userExpenseRepository.DeleteUserExpense(userId);
        }

    }
}
