using CSCI_490_TEAM_4_PROJECT.Server.Models;
using CSCI_490_TEAM_4_PROJECT.Server.Repository;

namespace CSCI_490_TEAM_4_PROJECT.Server.Services
{
    public class BudgetCatServices
    {
        private readonly IBudgetCatRepository _budgetCatRepository;

        public BudgetCatServices(IBudgetCatRepository budgetCatRepository)
        {
            _budgetCatRepository = budgetCatRepository;
        }

        public async Task<BudgetCat[]> GetBudgetCatById(int budgetCat)
        {
            return await _budgetCatRepository.GetBudgetCat(budgetCat);
        }

        public async Task AddBudgetCat(BudgetCat budgetCat)
        {
            try
            {
                await _budgetCatRepository.AddBudgetCat(budgetCat);
            }
            catch (Exception ex)
            {
                // Print or log an error message
                Console.WriteLine($"An exception occurred in BudgetCatServices @ AddBudgetCat(): {ex.Message}");
            }
        }

        public async Task UpdateBudgetCat(BudgetCat budgetCat)
        {
            await _budgetCatRepository.UpdateBudgetCat(budgetCat);
        }

        public async Task DeleteBudgetCat(int budgetCatId)
        {
            await _budgetCatRepository.DeleteBudgetCat(budgetCatId);
        }
    }
}
