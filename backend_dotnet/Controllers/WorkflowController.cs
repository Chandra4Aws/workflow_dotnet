using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using WorkflowBackend.Data;
using WorkflowBackend.Models;
using WorkflowBackend.Logic;

namespace WorkflowBackend.Controllers;

[ApiController]
[Route("api/workflows")]
[Authorize]
public class WorkflowController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly FileStorageService _fileStorageService;

    public WorkflowController(ApplicationDbContext context, FileStorageService fileStorageService)
    {
        _context = context;
        _fileStorageService = fileStorageService;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Workflow>>> GetAllWorkflows()
    {
        var username = User.Identity?.Name;
        var user = await _context.Users
            .Include(u => u.Roles)
            .Include(u => u.Groups)
            .FirstOrDefaultAsync(u => u.Username == username);

        if (user == null) return Unauthorized();

        var isAdmin = user.Roles.Any(r => r.Name == ERole.ROLE_ADMIN);
        if (isAdmin) {
            return await _context.Workflows
                .AsNoTracking()
                .Include(w => w.Creator)
                .AsSplitQuery()
                .ToListAsync();
        }

        var isReviewer = user.Roles.Any(r => r.Name == ERole.ROLE_REVIEWER);
        var isApprover = user.Roles.Any(r => r.Name == ERole.ROLE_APPROVER);
        var userGroupIds = user.Groups.Select(g => g.Id).ToList() ?? new List<long>();

        return await _context.Workflows
            .AsNoTracking()
            .Include(w => w.Creator)
            .Include(w => w.ReviewerGroups)
            .Include(w => w.ApproverGroup)
            .AsSplitQuery()
            .Where(w => w.CreatorId == user.Id 
                || (isReviewer && w.ReviewerGroups.Any(rg => userGroupIds.Contains(rg.Id)))
                || (isApprover && w.ApproverGroupId != null && userGroupIds.Contains(w.ApproverGroupId.Value)))
            .ToListAsync();
    }

    [HttpPost]
    [Authorize(Roles = "ROLE_CREATOR,ROLE_ADMIN")]
    public async Task<IActionResult> CreateWorkflow([FromBody] WorkflowBackend.DTOs.WorkflowRequest request)
    {
        var username = User.Identity?.Name;
        var user = await _context.Users.FirstOrDefaultAsync(u => u.Username == username);
        if (user == null) return Unauthorized();

        var workflow = new Workflow
        {
            Title = request.Title,
            Description = request.Description,
            Status = request.Status ?? "PENDING",
            FormData = request.FormData,
            Files = request.Files,
            TemplateId = request.TemplateId,
            ReviewerStatuses = request.ReviewerStatuses,
            Timeline = request.Timeline,
            CreatorId = user.Id,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        if (request.TemplateId != null)
        {
            var template = await _context.Templates.Include(t => t.ReviewerGroups).FirstOrDefaultAsync(t => t.Id == request.TemplateId);
            if (template != null)
            {
                workflow.ReviewerGroups = template.ReviewerGroups.ToList();
                workflow.ApproverGroupId = template.ApproverGroupId;
            }
        }

        _context.Workflows.Add(workflow);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetAllWorkflows), new { id = workflow.Id }, workflow);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Workflow>> GetWorkflowById(long id)
    {
        var workflow = await _context.Workflows
            .Include(w => w.Creator)
            .Include(w => w.ReviewerGroups)
            .Include(w => w.ApproverGroup)
            .FirstOrDefaultAsync(w => w.Id == id);

        if (workflow == null) return NotFound();
        return workflow;
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateWorkflow(long id, [FromBody] WorkflowBackend.DTOs.WorkflowRequest request)
    {
        var workflow = await _context.Workflows
            .Include(w => w.ReviewerGroups)
            .FirstOrDefaultAsync(w => w.Id == id);

        if (workflow == null) return NotFound();

        workflow.Title = request.Title;
        workflow.Description = request.Description;
        workflow.Status = request.Status ?? workflow.Status;
        workflow.FormData = request.FormData ?? workflow.FormData;
        workflow.Files = request.Files ?? workflow.Files;
        workflow.ReviewerStatuses = request.ReviewerStatuses ?? workflow.ReviewerStatuses;
        workflow.Timeline = request.Timeline ?? workflow.Timeline;
        workflow.UpdatedAt = DateTime.UtcNow;

        _context.Entry(workflow).State = EntityState.Modified;

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!WorkflowExists(id)) return NotFound();
            else throw;
        }

        return Ok(workflow);
    }

    private bool WorkflowExists(long id)
    {
        return _context.Workflows.Any(e => e.Id == id);
    }
}
