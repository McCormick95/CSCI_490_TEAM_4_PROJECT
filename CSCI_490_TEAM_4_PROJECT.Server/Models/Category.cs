using System.ComponentModel.DataAnnotations.Schema;

namespace CSCI_490_TEAM_4_PROJECT.Server.Models
{
    public class Category
    {
        [Column("cat_ID")]
        public int CatId { get; set; }

        [Column("cat_desc")]
        public required string CatDesc { get; set; }
    }

}
