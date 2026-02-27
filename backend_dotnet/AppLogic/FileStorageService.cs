using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using System.IO;

namespace WorkflowBackend.Logic;

public class FileStorageService
{
    private readonly string _uploadDir;

    public FileStorageService(IConfiguration configuration)
    {
        _uploadDir = configuration["File:UploadDir"] ?? "uploads";
        if (!Path.IsPathRooted(_uploadDir))
        {
            _uploadDir = Path.Combine(Directory.GetCurrentDirectory(), _uploadDir);
        }

        if (!Directory.Exists(_uploadDir))
        {
            Directory.CreateDirectory(_uploadDir);
        }
    }

    public async Task<string> StoreFileAsync(IFormFile file)
    {
        var fileName = Path.GetFileName(file.FileName);
        if (fileName.Contains(".."))
        {
            throw new Exception("Invalid file path sequence.");
        }

        var extension = Path.GetExtension(fileName);
        var uniqueFileName = $"{Guid.NewGuid()}{extension}";
        var filePath = Path.Combine(_uploadDir, uniqueFileName);

        using (var stream = new FileStream(filePath, FileMode.Create))
        {
            await file.CopyToAsync(stream);
        }

        return uniqueFileName;
    }

    public string GetFilePath(string fileName)
    {
        return Path.Combine(_uploadDir, fileName);
    }
}
