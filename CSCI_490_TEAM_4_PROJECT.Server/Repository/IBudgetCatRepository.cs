using CSCI_490_TEAM_4_PROJECT.Server.Models;

namespace CSCI_490_TEAM_4_PROJECT.Server.Repository
{
    public interface IBudgetCatRepository
    {
        Task<BudgetCat[]> GetBudgetCat(int budgetCatId);
        Task AddBudgetCat(BudgetCat budgetCat);
        Task UpdateBudgetCat(BudgetCat budgetCat);
        Task DeleteBudgetCat(int budgetCatId);

    }
}