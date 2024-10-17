using Microsoft.AspNetCore.Mvc;
using CSCI_490_TEAM_4_PROJECT.Server.Services;
using CSCI_490_TEAM_4_PROJECT.Server.Models;
using MySql.Data.MySqlClient;


[ApiController]
[Route("api/[controller]")]
public class BudgetCatController : ControllerBase
{
    private readonly BudgetCatServices _budgetCatService;

    public BudgetCatController(BudgetCatServices budgetCatService)
    {
        _budgetCatService = budgetCatService;
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<BudgetCat>> GetBudgetCat(int id)
    {
        var budgetCat = await _budgetCatService.GetBudgetCatById(id);
        if (budgetCat == null) return NotFound();
        return Ok(budgetCat);
    }

    [HttpPost]
    public async Task<ActionResult> AddBudgetCat([FromBody] BudgetCat budgetCat)
    {
        try
        {
            await _budgetCatService.AddBudgetCat(budgetCat);
            return Ok();
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
    public async Task<ActionResult> UpdateBudgetCat(int id, [FromBody] BudgetCat budgetCat)
    {
        budgetCat.BudgetId = id;
        await _budgetCatService.UpdateBudgetCat(budgetCat);
        return Ok();
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult> DeleteBudgetCat(int id)
    {
        await _budgetCatService.DeleteBudgetCat(id);
        return Ok();
    }
}
