using Microsoft.AspNetCore.Mvc;
using CSCI_490_TEAM_4_PROJECT.Server.Services;
using CSCI_490_TEAM_4_PROJECT.Server.Models;
using MySql.Data.MySqlClient;

[ApiController]
[Route("api/[controller]")]
public class BudgetController : ControllerBase
{
    private readonly BudgetServices _budgetService;

    public BudgetController(BudgetServices budgetService)
    {
        _budgetService = budgetService;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Budget>>> GetAllBudgets()
    {
        try 
        {
            var budgets = await _budgetService.GetAllBudgets();
            return Ok(budgets);
        }
        catch (Exception)
        {
            return NotFound();
        }
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Budget>> GetBudgetById(int id)
    {
        var budget = await _budgetService.GetBudgetById(id);
        if (budget == null) return NotFound();
        return Ok(budget);
    }

    [HttpPost]
    public async Task<ActionResult<Budget>> AddBudget([FromBody] Budget budget)
    {
        try
        {
            await _budgetService.AddBudget(budget);
            // Make sure we're returning the created budget with its ID
            var createdBudget = await _budgetService.GetBudgetById(budget.BudgetId);
            if (createdBudget == null)
            {
                return BadRequest(new { message = "Budget created but could not be retrieved" });
            }
            return Ok(createdBudget);  // This will ensure proper JSON serialization
        }
        catch (MySqlException)
        {
            return BadRequest(new { message = "Database error occurred" });
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpPut("{id}")]
    public async Task<ActionResult> UpdateBudget(int id, [FromBody] Budget budget)
    {
        budget.BudgetId = id;
        await _budgetService.UpdateBudget(budget);
        return Ok();
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult> DeleteBudget(int id)
    {
        await _budgetService.DeleteBudget(id);
        return Ok();
    }
}