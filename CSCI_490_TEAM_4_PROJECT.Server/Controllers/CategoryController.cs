using Microsoft.AspNetCore.Mvc;
using CSCI_490_TEAM_4_PROJECT.Server.Services;
using CSCI_490_TEAM_4_PROJECT.Server.Models;
using MySql.Data.MySqlClient;

[ApiController]
[Route("api/[controller]")]
public class CategoryController : ControllerBase
{
    private readonly CategoryServices _categoryServices;

    public CategoryController(CategoryServices categoryServices)
    {
        _categoryServices = categoryServices;
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Category>> GetCategoryById(int id)
    {
        var category = await _categoryServices.GetCategoryById(id);
        if (category == null) return NotFound();
        return Ok(category);
    }
}

