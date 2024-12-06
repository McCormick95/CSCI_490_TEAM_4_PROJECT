using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CSCI_490_TEAM_4_PROJECT.Server.Services;
using CSCI_490_TEAM_4_PROJECT.Server.Models;
using CSCI_490_TEAM_4_PROJECT.Server.Data;

[ApiController]
[Route("api/[controller]")]
public class BudgetController : ControllerBase
{
    private readonly BudgetServices _budgetService;
    private readonly ApplicationDbContext _context;

    public BudgetController(BudgetServices budgetService, ApplicationDbContext context)
    {
        _budgetService = budgetService;
        _context = context;
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
            return Ok(budget);
        }
        catch (Exception ex)
        {
            return BadRequest($"Failed to create budget: {ex.Message}");
        }
    }

    [HttpDelete("{id}")]
public async Task<ActionResult> DeleteBudget(int id)
{
    try
    {
        // First remove related records manually to ensure proper deletion order
        var userBudgets = await _context.UserBudget
            .Where(ub => ub.BudgetId == id)
            .ToListAsync();
        if (userBudgets.Any())
        {
            _context.UserBudget.RemoveRange(userBudgets);
            await _context.SaveChangesAsync();
        }

        var budgetCats = await _context.BudgetCat
            .Where(bc => bc.BudgetId == id)
            .ToListAsync();
        if (budgetCats.Any())
        {
            _context.BudgetCat.RemoveRange(budgetCats);
            await _context.SaveChangesAsync();
        }

        var budget = await _context.Budget.FindAsync(id);
        if (budget == null)
        {
            return NotFound($"Budget with ID {id} not found");
        }

        _context.Budget.Remove(budget);
        await _context.SaveChangesAsync();

        return Ok($"Budget {id} successfully deleted");
    }
    catch (Exception ex)
    {
        // Log the full exception details
        Console.WriteLine($"Error deleting budget {id}: {ex.Message}");
        Console.WriteLine($"Stack trace: {ex.StackTrace}");
        return StatusCode(500, $"Internal error: {ex.Message}");
    }
}

    [HttpPut("{id}")]
    public async Task<ActionResult> UpdateBudget(int id, [FromBody] Budget budget)
    {
        budget.BudgetId = id;
        await _budgetService.UpdateBudget(budget);
        return Ok();
    }
}