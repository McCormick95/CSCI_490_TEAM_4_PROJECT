using CSCI_490_TEAM_4_PROJECT.Server.Data;
using CSCI_490_TEAM_4_PROJECT.Server.Repository;
using CSCI_490_TEAM_4_PROJECT.Server.Services;
using CSCI_490_TEAM_4_PROJECT.Server.Models;
using Microsoft.EntityFrameworkCore;
using MySql.EntityFrameworkCore.Extensions;
using Microsoft.Extensions.DependencyInjection;
using MySql.Data.MySqlClient;
using YourNamespace.Utilities;
using CSCI_490_TEAM_4_PROJECT.Server.Middleware;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Configuration.AddJsonFile("appsettings.json", optional: false, reloadOnChange: true);
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseMySQL(builder.Configuration.GetConnectionString("Database")));

builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<UserService>();

builder.Services.AddScoped<IBudgetRepository, BudgetRepository>();
builder.Services.AddScoped<BudgetServices>();

builder.Services.AddScoped<IExpenseRepository, ExpenseRepository>();
builder.Services.AddScoped<ExpenseServices>();

builder.Services.AddScoped<IBudgetCatRepository, BudgetCatRepository>();
builder.Services.AddScoped<BudgetCatServices>();

builder.Services.AddScoped<ICategoryRepository, CategoryRepository>();
builder.Services.AddScoped<CategoryServices>();

builder.Services.AddScoped<IUserBudgetRepository, UserBudgetRepository>();
builder.Services.AddScoped<UserBudgetServices>();

builder.Services.AddScoped<IUserExpenseRepository, UserExpenseRepository>();
builder.Services.AddScoped<UserExpenseServices>();

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp",
        builder => builder
            .WithOrigins("https://localhost:5173") // Your React app's URL
            .AllowAnyMethod()
            .AllowAnyHeader()
            .AllowCredentials());
});

var connectionString = builder.Configuration.GetConnectionString("Database");
if (string.IsNullOrEmpty(connectionString))
{
    throw new InvalidOperationException("----------Connection string 'Database' is not found or empty----------");
}

DatabaseUtils.TestDatabaseConnection(connectionString);

var app = builder.Build();

app.UseDefaultFiles();
app.UseStaticFiles();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseMiddleware<ErrorHandlingMiddleware>();

app.UseHttpsRedirection();

app.UseCors("AllowReact");
app.UseCors("AllowReactApp");

app.UseAuthorization();

app.MapControllers();

app.MapFallbackToFile("/index.html");

// Add category
using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();

    // Clear existing categories
    //context.Category.RemoveRange(context.Category);
    //context.SaveChanges();

    // Check if any categories exist
    if (!context.Category.Any())
    {
        var categories = new List<Category>
        {
            new Category { CatDesc = "Housing" },
            new Category { CatDesc = "Transportation" },
            new Category { CatDesc = "Food" },
            new Category { CatDesc = "Utilities" },
            new Category { CatDesc = "Insurance" },
            new Category { CatDesc = "Healthcare" },
            new Category { CatDesc = "Entertainment" },
            new Category { CatDesc = "Personal Care" },
            new Category { CatDesc = "Education" },
            new Category { CatDesc = "Savings" }
        };

        foreach (var category in categories)
        {
            if (!context.Category.Any(c => c.CatDesc == category.CatDesc))
            {
                context.Category.Add(category);
            }
        }
        
        context.SaveChanges();
        Console.WriteLine("Categories have been seeded successfully.");
    }
}

app.Run();