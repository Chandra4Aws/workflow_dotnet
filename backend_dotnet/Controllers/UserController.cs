using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WorkflowBackend.Data;
using WorkflowBackend.Models;

namespace WorkflowBackend.Controllers;

[ApiController]
[Route("api/users")]
[Authorize]
public class UserController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public UserController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    [Authorize(Roles = "ROLE_ADMIN")]
    public async Task<ActionResult<IEnumerable<User>>> GetUsers()
    {
        return await _context.Users.Include(u => u.Roles).Include(u => u.Groups).ToListAsync();
    }

    [HttpGet("me")]
    public async Task<ActionResult<User>> GetCurrentUser()
    {
        var username = User.Identity?.Name;
        var user = await _context.Users
            .Include(u => u.Roles)
            .Include(u => u.Groups)
            .FirstOrDefaultAsync(u => u.Username == username);

        if (user == null) return NotFound();
        return user;
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "ROLE_ADMIN")]
    public async Task<IActionResult> DeleteUser(long id)
    {
        var user = await _context.Users.FindAsync(id);
        if (user == null) return NotFound();

        _context.Users.Remove(user);
        await _context.SaveChangesAsync();
        return NoContent();
    }

    [HttpPut("{id}/role")]
    [Authorize(Roles = "ROLE_ADMIN")]
    public async Task<IActionResult> UpdateUserRole(long id, [FromBody] RoleUpdateRequest request)
    {
        var user = await _context.Users.Include(u => u.Roles).FirstOrDefaultAsync(u => u.Id == id);
        if (user == null) return NotFound();

        ERole roleEnum = request.Role switch
        {
            "Admin" => ERole.ROLE_ADMIN,
            "Reviewer" => ERole.ROLE_REVIEWER,
            "Approver" => ERole.ROLE_APPROVER,
            _ => ERole.ROLE_CREATOR
        };

        var role = await _context.Roles.FirstOrDefaultAsync(r => r.Name == roleEnum);
        if (role == null) return BadRequest("Role not found");

        user.Roles.Clear();
        user.Roles.Add(role);
        await _context.SaveChangesAsync();
        return Ok(user);
    }

    [HttpPut("{id}/groups")]
    [Authorize(Roles = "ROLE_ADMIN")]
    public async Task<IActionResult> UpdateUserGroups(long id, [FromBody] GroupsUpdateRequest request)
    {
        var user = await _context.Users.Include(u => u.Groups).FirstOrDefaultAsync(u => u.Id == id);
        if (user == null) return NotFound();

        var groups = await _context.Groups.Where(g => request.GroupIds.Contains(g.Id)).ToListAsync();
        user.Groups.Clear();
        foreach (var group in groups)
        {
            user.Groups.Add(group);
        }

        await _context.SaveChangesAsync();
        return Ok(user);
    }

    [HttpPut("{id}")]
    [Authorize(Roles = "ROLE_ADMIN")]
    public async Task<IActionResult> UpdateUser(long id, [FromBody] UserUpdateRequest request)
    {
        var user = await _context.Users.FindAsync(id);
        if (user == null) return NotFound();

        if (request.Email != null) user.Email = request.Email;
        
        await _context.SaveChangesAsync();
        return Ok(user);
    }
}

public class RoleUpdateRequest { public string Role { get; set; } }
public class GroupsUpdateRequest { public List<long> GroupIds { get; set; } }
public class UserUpdateRequest { public string Email { get; set; } }
