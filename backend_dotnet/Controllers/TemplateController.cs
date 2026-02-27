using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WorkflowBackend.Data;
using WorkflowBackend.Models;

namespace WorkflowBackend.Controllers;

[ApiController]
[Route("api/templates")]
[Authorize]
public class TemplateController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public TemplateController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Template>>> GetTemplates()
    {
        return await _context.Templates
            .Include(t => t.ReviewerGroups)
            .Include(t => t.ApproverGroup)
            .ToListAsync();
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Template>> GetTemplate(long id)
    {
        var template = await _context.Templates
            .Include(t => t.ReviewerGroups)
            .Include(t => t.ApproverGroup)
            .FirstOrDefaultAsync(t => t.Id == id);

        if (template == null) return NotFound();
        return template;
    }

    [HttpPost]
    [Authorize(Roles = "ROLE_ADMIN")]
    public async Task<ActionResult<Template>> CreateTemplate([FromBody] WorkflowBackend.DTOs.TemplateRequest request)
    {
        var template = new Template
        {
            Title = request.Title,
            Description = request.Description,
            FormSchema = request.FormSchema,
            CreatorId = request.CreatorId,
            ApproverGroupId = request.ApproverGroupId,
            Files = request.Files
        };

        if (request.ReviewerGroupIds != null && request.ReviewerGroupIds.Any())
        {
            template.ReviewerGroups = await _context.Groups
                .Where(g => request.ReviewerGroupIds.Contains(g.Id))
                .ToListAsync();
        }

        _context.Templates.Add(template);
        await _context.SaveChangesAsync();
        return CreatedAtAction(nameof(GetTemplate), new { id = template.Id }, template);
    }
}
