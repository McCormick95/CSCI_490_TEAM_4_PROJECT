using CSCI_490_TEAM_4_PROJECT.Server.Data;
using Microsoft.EntityFrameworkCore;
using MySql.Data.MySqlClient;
using YourNamespace.Utilities;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Configuration.AddJsonFile("appsettings.json", optional: false, reloadOnChange: true);
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseMySQL(builder.Configuration.GetConnectionString("Database")));


builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();


var connectionString = builder.Configuration.GetConnectionString("Database");
if (string.IsNullOrEmpty(connectionString))
{
    throw new InvalidOperationException("Connection string 'Database' is not found or empty.");
    {
        
    }
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

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.MapFallbackToFile("/index.html");

app.Run();




static void TestDatabaseConnection(string connectionString)
{
    using (var connection = new MySqlConnection(connectionString))
    {
        try
        {
            connection.Open();
            Console.WriteLine("Connection to the database was successful!");
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Connection to the database failed: {ex.Message}");
            throw; // Re-throw the exception to stop the application if needed
        }
    }
}
