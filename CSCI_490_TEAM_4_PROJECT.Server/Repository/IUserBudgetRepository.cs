using CSCI_490_TEAM_4_PROJECT.Server.Models;

namespace CSCI_490_TEAM_4_PROJECT.Server.Repository
{
    public interface IUserBudgetRepository
    {
        Task<UserBudget[]> GetUserBudgetById(int userId);
        Task AddUserBudget(UserBudget userBudget);
        Task UpdateUserBudget(UserBudget userBudget);
        Task DeleteUserBudget(int userId);

    }
}
