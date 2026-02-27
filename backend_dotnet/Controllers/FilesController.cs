using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WorkflowBackend.Logic;

namespace WorkflowBackend.Controllers;

[ApiController]
[Route("api/files")]
[Authorize]
public class FilesController : ControllerBase
{
    private readonly FileStorageService _fileStorageService;

    public FilesController(FileStorageService fileStorageService)
    {
        _fileStorageService = fileStorageService;
    }

    [HttpPost("upload")]
    public async Task<IActionResult> UploadFile(IFormFile file)
    {
        try
        {
            var fileName = await _fileStorageService.StoreFileAsync(file);
            return Ok(new 
            { 
                fileName,
                originalName = file.FileName,
                size = file.Length
            });
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpGet("{fileName}")]
    public IActionResult DownloadFile(string fileName)
    {
        var filePath = _fileStorageService.GetFilePath(fileName);
        if (!System.IO.File.Exists(filePath)) return NotFound();

        var bytes = System.IO.File.ReadAllBytes(filePath);
        return File(bytes, "application/octet-stream", fileName);
    }
}
