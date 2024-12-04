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
    public async Task<ActionResult> AddBudget([FromBody] Budget budget)
    {
        try
        {
            await _budgetService.AddBudget(budget);
            return Ok(budget);
        }
        catch (MySqlException)
        {
            return BadRequest("------DID NOT REACH DB------");
        }
        catch (Exception)
        {
            return BadRequest("------DID NOT POST------");
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