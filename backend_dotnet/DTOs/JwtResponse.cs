namespace WorkflowBackend.DTOs;

public class JwtResponse
{
    public string Token { get; set; } = string.Empty;
    public string Type { get; set; } = "Bearer";
    public long Id { get; set; }
    public string Username { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public List<string> Roles { get; set; } = new List<string>();
    public IEnumerable<object>? Groups { get; set; }

    public JwtResponse(string token, long id, string username, string email, List<string> roles, IEnumerable<object>? groups = null)
    {
        Token = token;
        Id = id;
        Username = username;
        Email = email;
        Roles = roles;
        Groups = groups;
    }
}
