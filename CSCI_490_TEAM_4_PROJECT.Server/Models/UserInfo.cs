﻿using System.ComponentModel.DataAnnotations.Schema;

namespace CSCI_490_TEAM_4_PROJECT.Server.Models
{
    public class UserInfo
    {
        [Column("user_ID")]
        public int UserId { get; set; }

        [Column("user_name")]
        public required string UserName { get; set; }

        [Column("user_email")]
        public required string UserEmail { get; set; }

        [Column("user_password")]
        public required string Password { get; set; }
    }
}
