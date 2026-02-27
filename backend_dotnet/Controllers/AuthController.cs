using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using WorkflowBackend.Data;
using WorkflowBackend.DTOs;
using WorkflowBackend.Models;
using WorkflowBackend.Auth;

namespace WorkflowBackend.Controllers;

[ApiController]
[Route("api/auth")]
public class AuthController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly JwtService _jwtService;

    public AuthController(ApplicationDbContext context, JwtService jwtService)
    {
        _context = context;
        _jwtService = jwtService;
    }

    [HttpPost("signin")]
    public async Task<IActionResult> AuthenticateUser([FromBody] LoginRequest loginRequest)
    {
        var user = await _context.Users
            .Include(u => u.Roles)
            .Include(u => u.Groups)
            .FirstOrDefaultAsync(u => u.Username == loginRequest.Username);

        if (user == null || !BCrypt.Net.BCrypt.Verify(loginRequest.Password, user.Password))
        {
            return Unauthorized(new MessageResponse("Error: Invalid username or password"));
        }

        var jwt = _jwtService.GenerateToken(user);
        var roles = user.Roles.Select(r => r.Name.ToString()).ToList();

        return Ok(new JwtResponse(jwt, user.Id, user.Username, user.Email, roles, user.Groups));
    }

    [HttpPost("signup")]
    public async Task<IActionResult> RegisterUser([FromBody] SignupRequest signUpRequest)
    {
        if (await _context.Users.AnyAsync(u => u.Username == signUpRequest.Username))
        {
            return BadRequest(new MessageResponse("Error: Username is already taken!"));
        }

        if (await _context.Users.AnyAsync(u => u.Email == signUpRequest.Email))
        {
            return BadRequest(new MessageResponse("Error: Email is already in use!"));
        }

        // Create new user's account
        var user = new User
        {
            Username = signUpRequest.Username,
            Email = signUpRequest.Email,
            Password = BCrypt.Net.BCrypt.HashPassword(signUpRequest.Password)
        };

        var roles = new List<Role>();
        if (signUpRequest.Role == null || !signUpRequest.Role.Any())
        {
            var userRole = await _context.Roles.FirstOrDefaultAsync(r => r.Name == ERole.ROLE_CREATOR);
            if (userRole != null) roles.Add(userRole);
        }
        else
        {
            foreach (var r in signUpRequest.Role)
            {
                ERole roleEnum = r switch
                {
                    "admin" => ERole.ROLE_ADMIN,
                    "reviewer" => ERole.ROLE_REVIEWER,
                    "approver" => ERole.ROLE_APPROVER,
                    _ => ERole.ROLE_CREATOR
                };
                var role = await _context.Roles.FirstOrDefaultAsync(x => x.Name == roleEnum);
                if (role != null) roles.Add(role);
            }
        }

        user.Roles = roles;

        if (signUpRequest.GroupIds != null)
        {
            user.Groups = await _context.Groups.Where(g => signUpRequest.GroupIds.Contains(g.Id)).ToListAsync();
        }

        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        return Ok(new MessageResponse("User registered successfully!"));
    }
}
