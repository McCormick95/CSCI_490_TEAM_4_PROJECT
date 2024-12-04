using Microsoft.AspNetCore.Mvc;
using CSCI_490_TEAM_4_PROJECT.Server.Services;
using CSCI_490_TEAM_4_PROJECT.Server.Models;
using MySql.Data.MySqlClient;

[ApiController]
[Route("api/[controller]")]
public class ExpenseController : ControllerBase
{
    private readonly ExpenseServices _expenseServices;

    public ExpenseController(ExpenseServices expenseServices)
    {
        _expenseServices = expenseServices;
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
        await _expenseServices.DeleteExpense(id);
        return Ok();
    }
}