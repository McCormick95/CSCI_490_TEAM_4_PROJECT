using CSCI_490_TEAM_4_PROJECT.Server.Models;
using CSCI_490_TEAM_4_PROJECT.Server.Repository;

namespace CSCI_490_TEAM_4_PROJECT.Server.Services
{
    public class UserService
    {
        private readonly IUserRepository _userRepository;

        public UserService(IUserRepository userRepository)
        {
            _userRepository = userRepository;
        }

        public async Task<UserInfo> GetUserById(int userId)
        {
            return await _userRepository.GetUserById(userId);
        }

        public async Task AddUser(UserInfo user)
        {
            try
            {
                await _userRepository.AddUser(user);
            }
            catch (Exception ex)
            {
                // Print or log an error message
                Console.WriteLine($"An exception occurred in UserServices @ AddUser(): {ex.Message}");
            }
        }

        public async Task UpdateUser(UserInfo user)
        {
            await _userRepository.UpdateUser(user);
        }

        public async Task DeleteUser(int userId)
        {
            await _userRepository.DeleteUser(userId);
        }
    }

}
