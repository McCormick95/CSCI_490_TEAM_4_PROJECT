using Microsoft.AspNetCore.Mvc;
using CSCI_490_TEAM_4_PROJECT.Server.Services;
using CSCI_490_TEAM_4_PROJECT.Server.Models;
using MySql.Data.MySqlClient;

[ApiController]
[Route("api/[controller]")]
public class UserExpenseController : ControllerBase
{
    private readonly UserExpenseServices _userExpenseServices;

    public UserExpenseController(UserExpenseServices userExpenseServices)
    {
        _userExpenseServices = userExpenseServices;
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<UserExpense>> GetUserExpenseById(int id)
    {
        var userExpense = await _userExpenseServices.GetUserExpenseById(id);
        if (userExpense == null) return NotFound();
        return Ok(userExpense);
    }

    [HttpPost]
    public async Task<ActionResult> AddUserExpense([FromBody] UserExpense userExpense)
    {
        try
        {
            await _userExpenseServices.AddUserExpense(userExpense);
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
    public async Task<ActionResult> UpdateUserExpense(int id, [FromBody] UserExpense userExpense)
    {
        userExpense.UserId = id;
        await _userExpenseServices.UpdateUserExpense(userExpense);
        return Ok();
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult> DeleteUserExpense(int id)
    {
        await _userExpenseServices.DeleteUserExpense(id);
        return Ok();
    }
}
