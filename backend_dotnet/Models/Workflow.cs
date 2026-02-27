using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace WorkflowBackend.Models;

[Table("workflows")]
public class Workflow
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public long Id { get; set; }

    [Required]
    public string Title { get; set; } = string.Empty;

    public string? Description { get; set; }

    [Required]
    public string Status { get; set; } = "PENDING";

    public long? CreatorId { get; set; }
    [ForeignKey("CreatorId")]
    public User? Creator { get; set; }

    public ICollection<Group> ReviewerGroups { get; set; } = new List<Group>();

    [Column(TypeName = "text")]
    public string? ReviewerStatuses { get; set; } // JSON string

    public long? ApproverGroupId { get; set; }
    [ForeignKey("ApproverGroupId")]
    public Group? ApproverGroup { get; set; }

    [Column(TypeName = "text")]
    public string? FormData { get; set; }

    [Column(TypeName = "text")]
    public string? Timeline { get; set; }

    [Column(TypeName = "text")]
    public string? Files { get; set; }

    public long? TemplateId { get; set; }

    [Column("created_at")]
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    [Column("updated_at")]
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}
