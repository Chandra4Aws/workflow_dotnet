using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace WorkflowBackend.Models;

[Table("templates")]
public class Template
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public long Id { get; set; }

    [Required]
    public string Title { get; set; } = string.Empty;

    public string? Description { get; set; }

    [Column(TypeName = "text")]
    public string? FormSchema { get; set; } // JSON string

    public long? CreatorId { get; set; }
    [ForeignKey("CreatorId")]
    public User? Creator { get; set; }

    public ICollection<Group> ReviewerGroups { get; set; } = new List<Group>();

    public long? ApproverGroupId { get; set; }
    [ForeignKey("ApproverGroupId")]
    public Group? ApproverGroup { get; set; }

    public string? Files { get; set; }

    [Column("created_at")]
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
