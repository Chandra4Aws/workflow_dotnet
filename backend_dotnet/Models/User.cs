using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace WorkflowBackend.Models;

[Table("users")]
public class User
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public long Id { get; set; }

    [Required]
    [MaxLength(20)]
    public string Username { get; set; } = string.Empty;

    [Required]
    [EmailAddress]
    [MaxLength(50)]
    public string Email { get; set; } = string.Empty;

    [Required]
    [MaxLength(120)]
    [JsonIgnore]
    public string Password { get; set; } = string.Empty;

    public ICollection<Role> Roles { get; set; } = new List<Role>();

    public ICollection<Group> Groups { get; set; } = new List<Group>();
}
