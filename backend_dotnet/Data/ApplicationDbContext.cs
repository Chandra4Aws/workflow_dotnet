using Microsoft.EntityFrameworkCore;
using WorkflowBackend.Models;

namespace WorkflowBackend.Data;

public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options)
    {
    }

    public DbSet<User> Users { get; set; }
    public DbSet<Role> Roles { get; set; }
    public DbSet<Group> Groups { get; set; }
    public DbSet<Workflow> Workflows { get; set; }
    public DbSet<Template> Templates { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Many-to-Many User <-> Role
        modelBuilder.Entity<User>()
            .HasMany(u => u.Roles)
            .WithMany()
            .UsingEntity<Dictionary<string, object>>(
                "user_roles",
                j => j.HasOne<Role>().WithMany().HasForeignKey("role_id"),
                j => j.HasOne<User>().WithMany().HasForeignKey("user_id"),
                j => j.ToTable("user_roles")
            );

        // Many-to-Many User <-> Group
        modelBuilder.Entity<User>()
            .HasMany(u => u.Groups)
            .WithMany(g => g.Members)
            .UsingEntity<Dictionary<string, object>>(
                "user_groups",
                j => j.HasOne<Group>().WithMany().HasForeignKey("group_id"),
                j => j.HasOne<User>().WithMany().HasForeignKey("user_id"),
                j => j.ToTable("user_groups")
            );

        // Many-to-Many Workflow <-> Reviewer Group
        modelBuilder.Entity<Workflow>()
            .HasMany(w => w.ReviewerGroups)
            .WithMany()
            .UsingEntity<Dictionary<string, object>>(
                "workflow_reviewers",
                j => j.HasOne<Group>().WithMany().HasForeignKey("group_id"),
                j => j.HasOne<Workflow>().WithMany().HasForeignKey("workflow_id"),
                j => j.ToTable("workflow_reviewers")
            );

        // Many-to-Many Template <-> Reviewer Group
        modelBuilder.Entity<Template>()
            .HasMany(t => t.ReviewerGroups)
            .WithMany()
            .UsingEntity<Dictionary<string, object>>(
                "template_reviewers",
                j => j.HasOne<Group>().WithMany().HasForeignKey("group_id"),
                j => j.HasOne<Template>().WithMany().HasForeignKey("template_id"),
                j => j.ToTable("template_reviewers")
            );
            
        // Enums mapping
        modelBuilder.Entity<Role>()
            .Property(r => r.Name)
            .HasConversion<string>();

        // Map all table and column names to snake_case
        foreach (var entity in modelBuilder.Model.GetEntityTypes())
        {
            // Set table name to lowercase
            var tableName = entity.GetTableName();
            if (tableName != null)
            {
                entity.SetTableName(tableName.ToLower().Replace("workflowbackend.models.", ""));
            }

            foreach (var property in entity.GetProperties())
            {
                // Convert PascalCase to snake_case for columns
                var columnName = property.GetColumnName();
                if (columnName != null)
                {
                    var result = System.Text.RegularExpressions.Regex.Replace(columnName, "([a-z0-9])([A-Z])", "$1_$2").ToLower();
                    property.SetColumnName(result);
                    // Console.WriteLine($"  PROPERTY: {property.Name} mapped to column: {result}");
                }
            }
        }
    }
}
