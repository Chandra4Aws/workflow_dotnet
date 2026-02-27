using System.Collections.Generic;

namespace WorkflowBackend.DTOs;

public class WorkflowRequest
{
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string? Status { get; set; }
    public long? TemplateId { get; set; }
    public string? FormData { get; set; }
    public string? Files { get; set; }
    public string? ReviewerStatuses { get; set; }
    public string? Timeline { get; set; }
}
