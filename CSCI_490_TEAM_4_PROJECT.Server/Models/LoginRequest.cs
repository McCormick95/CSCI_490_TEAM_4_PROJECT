namespace CSCI_490_TEAM_4_PROJECT.Server.Models
{
    public class LoginRequest
    {
        public required string Email { get; set; }
        public required string Password { get; set; }
    }
}