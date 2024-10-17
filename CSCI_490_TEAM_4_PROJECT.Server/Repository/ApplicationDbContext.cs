using Microsoft.EntityFrameworkCore;
using CSCI_490_TEAM_4_PROJECT.Server.Models;

namespace CSCI_490_TEAM_4_PROJECT.Server.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        public DbSet<UserInfo> UserInfo { get; set; }
        public DbSet<Budget> Budget { get; set; }
        public DbSet<Expense> Expense { get; set; }
        public DbSet<BudgetCat> BudgetCat { get; set; }
        public DbSet<Category> Category { get; set; }
        public DbSet<UserBudget> UserBudget { get; set; }
        public DbSet<UserExpense> UserExpense { get; set; }


        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<UserInfo>()
                .Property(b => b.UserId)
                .ValueGeneratedOnAdd();

            modelBuilder.Entity<Budget>()
                .Property(b => b.BudgetId)
                .ValueGeneratedOnAdd();

            modelBuilder.Entity<Expense>()
                .Property(b => b.ExpenseId)
                .ValueGeneratedOnAdd();

            modelBuilder.Entity<Category>()
                .Property(c => c.CatId)
                .ValueGeneratedOnAdd();

            modelBuilder.Entity<UserBudget>()
                .HasKey(ub => new { ub.UserId, ub.BudgetId });

            modelBuilder.Entity<UserBudget>()
                .HasOne<UserInfo>()
                .WithMany()
                .HasForeignKey(ub => ub.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<UserBudget>()
                .HasOne<Budget>()
                .WithMany()
                .HasForeignKey(ub => ub.BudgetId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<UserExpense>()
                .HasKey(ue => new { ue.UserId, ue.ExpenseId });

            modelBuilder.Entity<UserExpense>()
                .HasOne<UserInfo>()
                .WithMany()
                .HasForeignKey(ue => ue.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<UserExpense>()
                .HasOne<Expense>()
                .WithMany()
                .HasForeignKey(ue => ue.ExpenseId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<BudgetCat>()
                .HasKey(bc => new { bc.BudgetId});
        }
    }
}
