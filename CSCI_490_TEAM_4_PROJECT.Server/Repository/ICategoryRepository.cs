using CSCI_490_TEAM_4_PROJECT.Server.Models;

namespace CSCI_490_TEAM_4_PROJECT.Server.Repository
{
    public interface ICategoryRepository
    {
        Task<Category> GetCategoryById(int catId);
    }
}
