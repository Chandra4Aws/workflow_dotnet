using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WorkflowBackend.Data;
using WorkflowBackend.Models;

namespace WorkflowBackend.Controllers;

[ApiController]
[Route("api/groups")]
[Authorize]
public class GroupController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public GroupController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Group>>> GetGroups()
    {
        return await _context.Groups.Include(g => g.Members).ToListAsync();
    }

    [HttpPost]
    [Authorize(Roles = "ROLE_ADMIN")]
    public async Task<ActionResult<Group>> CreateGroup(Group group)
    {
        _context.Groups.Add(group);
        await _context.SaveChangesAsync();
        return CreatedAtAction(nameof(GetGroups), new { id = group.Id }, group);
    }

    [HttpPut("{id}")]
    [Authorize(Roles = "ROLE_ADMIN")]
    public async Task<IActionResult> UpdateGroup(long id, Group group)
    {
        if (id != group.Id) return BadRequest();

        var existingGroup = await _context.Groups.FindAsync(id);
        if (existingGroup == null) return NotFound();

        existingGroup.Name = group.Name;
        existingGroup.Description = group.Description;

        await _context.SaveChangesAsync();
        return NoContent();
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "ROLE_ADMIN")]
    public async Task<IActionResult> DeleteGroup(long id)
    {
        var group = await _context.Groups.FindAsync(id);
        if (group == null) return NotFound();

        _context.Groups.Remove(group);
        await _context.SaveChangesAsync();
        return NoContent();
    }
}
