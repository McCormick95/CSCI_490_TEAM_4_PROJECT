using CSCI_490_TEAM_4_PROJECT.Server.Models;

namespace CSCI_490_TEAM_4_PROJECT.Server.Repository
{
    public interface IUserRepository
    {
        Task<UserInfo> GetUserById(int userId);
        Task AddUser(UserInfo user);
        Task UpdateUser(UserInfo user);
        Task DeleteUser(int userId);
    }

}
