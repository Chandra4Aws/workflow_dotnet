using System.ComponentModel.DataAnnotations;
using System.Collections.Generic;

namespace WorkflowBackend.DTOs;

public class SignupRequest
{
    [Required]
    [MinLength(3)]
    [MaxLength(20)]
    public string Username { get; set; } = string.Empty;

    [Required]
    [EmailAddress]
    [MaxLength(50)]
    public string Email { get; set; } = string.Empty;

    public List<string>? Role { get; set; }

    public List<long>? GroupIds { get; set; }

    [Required]
    [MinLength(6)]
    [MaxLength(40)]
    public string Password { get; set; } = string.Empty;
}
