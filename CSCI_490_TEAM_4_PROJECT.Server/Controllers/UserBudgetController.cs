using Microsoft.AspNetCore.Mvc;
using CSCI_490_TEAM_4_PROJECT.Server.Services;
using CSCI_490_TEAM_4_PROJECT.Server.Models;
using MySql.Data.MySqlClient;

[ApiController]
[Route("api/[controller]")]
public class UserBudgetController : ControllerBase
{
    private readonly UserBudgetServices _userBudgetService;

    public UserBudgetController(UserBudgetServices userBudgetService)
    {
        _userBudgetService = userBudgetService;
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<UserBudget[]>> GetUserBudgetById(int id)
    {
        var userBudget = await _userBudgetService.GetUserBudgetById(id);
        if (userBudget == null) return NotFound();
        return Ok(userBudget);
    }

    [HttpPost]
    public async Task<ActionResult> AddUserBudget([FromBody] UserBudget userBudget)
    {
        try
        {
            await _userBudgetService.AddUserBudget(userBudget);
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
    public async Task<ActionResult> UpdateUserBudget(int id, [FromBody] UserBudget userBudget)
    {
        userBudget.UserId = id;
        await _userBudgetService.UpdateUserBudget(userBudget);
        return Ok();
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult> DeleteUserBudget(int id)
    {
        await _userBudgetService.DeleteUserBudget(id);
        return Ok();
    }
}