namespace GoBusApp.Models;

/// <summary>
/// User model representing authenticated user
/// </summary>
public class User
{
    public string Id { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string? Phone { get; set; }
    public string Role { get; set; } = "passenger";
    public DateTime CreatedAt { get; set; }
}

/// <summary>
/// Authentication tokens
/// </summary>
public class AuthTokens
{
    public string Access { get; set; } = string.Empty;
    public string Refresh { get; set; } = string.Empty;
    
    // Helper properties for backward compatibility
    public string AccessToken => Access;
    public string RefreshToken => Refresh;
}

/// <summary>
/// Login response from API
/// </summary>
public class AuthResponse
{
    public User? User { get; set; }
    public AuthTokens? Tokens { get; set; }
    public string Message { get; set; } = string.Empty;
}
