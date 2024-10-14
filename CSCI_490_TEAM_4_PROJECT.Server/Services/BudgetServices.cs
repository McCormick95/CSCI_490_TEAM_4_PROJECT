using CSCI_490_TEAM_4_PROJECT.Server.Models;
using CSCI_490_TEAM_4_PROJECT.Server.Repository;

namespace CSCI_490_TEAM_4_PROJECT.Server.Services
{
    public class BudgetServices
    {
        private readonly IBudgetRepository _budgetRepository;

        public BudgetServices(IBudgetRepository budgetRepository)
        {
            _budgetRepository = budgetRepository;
        }

        public async Task<Budget> GetBudgetById(int budgetId)
        {
            return await _budgetRepository.GetBudgetById(budgetId);
        }

        public async Task AddBudget(Budget budget)
        {
            await _budgetRepository.AddBudget(budget);
        }

        public async Task UpdateBudget(Budget budget)
        {
            await _budgetRepository.UpdateBudget(budget);
        }

        public async Task DeleteBudget(int budgetId)
        {
            await _budgetRepository.DeleteBudget(budgetId);
        }
    }
}