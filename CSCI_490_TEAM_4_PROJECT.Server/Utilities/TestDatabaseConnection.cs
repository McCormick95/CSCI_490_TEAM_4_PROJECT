using System;
using MySql.Data.MySqlClient;

namespace YourNamespace.Utilities
{
    public static class DatabaseUtils
    {
        public static void TestDatabaseConnection(string connectionString)
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
    }
}
