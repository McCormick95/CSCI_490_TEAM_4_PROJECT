using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CSCI_490_TEAM_4_PROJECT.Server.Services;
using CSCI_490_TEAM_4_PROJECT.Server.Models;
using CSCI_490_TEAM_4_PROJECT.Server.Data;
using MySql.Data.MySqlClient;

[ApiController]
[Route("api/[controller]")]
public class ExpenseController : ControllerBase
{
    private readonly ExpenseServices _expenseServices;
    private readonly ApplicationDbContext _context;

    public ExpenseController(ExpenseServices expenseServices, ApplicationDbContext context)
    {
        _expenseServices = expenseServices;
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Expense>>> GetAllExpenses()
    {
        var expenses = await _expenseServices.GetAllExpenses();
        return Ok(expenses);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Expense>> GetExpenseById(int id)
    {
        var expense = await _expenseServices.GetExpenseById(id);
        if (expense == null) return NotFound();
        return Ok(expense);
    }

    [HttpPost]
    public async Task<ActionResult<Expense>> AddExpense([FromBody] Expense expense)
    {
        try
        {
            await _expenseServices.AddExpense(expense);
            return Ok(expense);
        }
        catch (MySqlException)
        {
            return BadRequest("------DID NOT REACH DB------");
        }
        catch (Exception ex)
        {
            return BadRequest($"Failed to create expense: {ex.Message}");
        }
    }

    [HttpPut("{id}")]
    public async Task<ActionResult> UpdateExpense(int id, [FromBody] Expense expense)
    {
        expense.ExpenseId = id;
        await _expenseServices.UpdateExpense(expense);
        return Ok();
    }

    [HttpDelete("{id}")]
public async Task<ActionResult> DeleteExpense(int id)
{
    try
    {
        // First remove related user-expense records
        var userExpenses = await _context.UserExpense
            .Where(ue => ue.ExpenseId == id)
            .ToListAsync();
        if (userExpenses.Any())
        {
            _context.UserExpense.RemoveRange(userExpenses);
            await _context.SaveChangesAsync();
        }

        var expense = await _context.Expense.FindAsync(id);
        if (expense == null)
        {
            return NotFound($"Expense with ID {id} not found");
        }

        _context.Expense.Remove(expense);
        await _context.SaveChangesAsync();

        return Ok($"Expense {id} successfully deleted");
    }
    catch (Exception ex)
    {
        Console.WriteLine($"Error deleting expense {id}: {ex.Message}");
        return StatusCode(500, $"Internal error: {ex.Message}");
    }
}
}