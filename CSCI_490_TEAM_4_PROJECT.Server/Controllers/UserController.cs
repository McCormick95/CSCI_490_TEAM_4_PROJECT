using Microsoft.AspNetCore.Mvc;
using CSCI_490_TEAM_4_PROJECT.Server.Services;
using CSCI_490_TEAM_4_PROJECT.Server.Models;
using MySql.Data.MySqlClient;
using Org.BouncyCastle.Crypto.Generators;


[ApiController]
[Route("api/[controller]")]
public class UserController : ControllerBase
{
    private readonly UserService _userService;

    public UserController(UserService userService)
    {
        _userService = userService;
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<UserInfo>> GetUserById(int id)
    {
        var user = await _userService.GetUserById(id);
        if (user == null) return NotFound();
        return Ok(user);
    }

    [HttpPost]
    public async Task<ActionResult> AddUser([FromBody] UserInfo user)
    {
 //TODO: Add ID increment to DB, don't pass from user
        try
        {
            await _userService.AddUser(user);
            return Ok();
        }
        catch(MySqlException)
        {
            return BadRequest("------DID NOT REACH DB------");
        }
        catch (Exception)
        {
            return BadRequest("------DID NOT POST------");
        }
    }

    [HttpPost("login")]
    public async Task<ActionResult<object>> Login([FromBody] CSCI_490_TEAM_4_PROJECT.Server.Models.LoginRequest request)
    {
        try
        {
            var user = await _userService.GetUserByEmail(request.Email);

            if (user == null)
            {
                return Unauthorized("Invalid email or password");
            }

            if (!BCrypt.Net.BCrypt.Verify(request.Password, user.Password))
            {
                return Unauthorized("Invalid email or password");
            }

            // Return user data without password
            return Ok(new
            {
                userId = user.UserId,
                username = user.UserName,
                email = user.UserEmail
            });
        }
        catch (Exception ex)
        {
            // Add proper logging
            Console.WriteLine($"Login error: {ex.Message}");
            return StatusCode(500, "Error during login");
        }
    }

    [HttpPut("{id}")]
    public async Task<ActionResult> UpdateUser(int id, [FromBody] UserInfo user)
    {
        user.UserId = id;
        await _userService.UpdateUser(user);
        return Ok();
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult> DeleteUser(int id)
    {
        await _userService.DeleteUser(id);
        return Ok();
    }
}
