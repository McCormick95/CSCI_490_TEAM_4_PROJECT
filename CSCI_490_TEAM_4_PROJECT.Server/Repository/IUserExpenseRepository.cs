using CSCI_490_TEAM_4_PROJECT.Server.Models;

namespace CSCI_490_TEAM_4_PROJECT.Server.Repository
{
    public interface IUserExpenseRepository
    {
        Task<UserExpense> GetUserExpenseById(int userId);
        Task AddUserExpense(UserExpense userExpense);
        Task UpdateUserExpense(UserExpense userExpense);
        Task DeleteUserExpense(int userId);
    }
}
