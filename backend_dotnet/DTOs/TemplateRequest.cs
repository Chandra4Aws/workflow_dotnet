using System.Collections.Generic;

namespace WorkflowBackend.DTOs;

public class TemplateRequest
{
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string? FormSchema { get; set; }
    public long? CreatorId { get; set; }
    public List<long> ReviewerGroupIds { get; set; } = new List<long>();
    public long? ApproverGroupId { get; set; }
    public string? Files { get; set; }
}
