using System.Text.Json;
using GoBusApp.Helpers;
using GoBusApp.Models;

namespace GoBusApp.Services;

/// <summary>
/// Authentication service interface
/// </summary>
public interface IAuthService
{
    Task<bool> IsLoggedInAsync();
    Task<User?> GetCurrentUserAsync();
    Task<AuthResponse> LoginAsync(string email, string password);
    Task<AuthResponse> RegisterAsync(string email, string name, string password, string phone);
    Task LogoutAsync();
    Task<bool> RefreshTokenAsync();
}

/// <summary>
/// Authentication service implementation
/// </summary>
public class AuthService : IAuthService
{
    private readonly IApiService _apiService;
    private readonly ILocalStorageService _localStorage;
    private User? _currentUser;

    public AuthService(IApiService apiService, ILocalStorageService localStorage)
    {
        _apiService = apiService;
        _localStorage = localStorage;
    }

    public async Task<bool> IsLoggedInAsync()
    {
        var token = await SecureStorage.GetAsync(Constants.AccessTokenKey);
        if (string.IsNullOrEmpty(token))
            return false;
        
        // Set token in API service
        _apiService.SetAuthToken(token);
        
        // Try to get user profile
        try
        {
            var user = await _apiService.GetAsync<User>("auth/profile/");
            if (user != null)
            {
                _currentUser = user;
                return true;
            }
        }
        catch
        {
            // Token might be expired, try refresh
            return await RefreshTokenAsync();
        }
        
        return false;
    }

    public async Task<User?> GetCurrentUserAsync()
    {
        if (_currentUser != null)
            return _currentUser;
        
        var userData = await _localStorage.GetAsync<User>(Constants.UserDataKey);
        return userData;
    }

    public async Task<AuthResponse> LoginAsync(string email, string password)
    {
        // Clear any existing auth token before login
        _apiService.ClearAuthToken();
        
        var response = await _apiService.PostAsync<AuthResponse>("auth/login/", new
        {
            email,
            password
        });
        
        if (response?.Tokens != null)
        {
            await SaveTokensAsync(response.Tokens);
            _apiService.SetAuthToken(response.Tokens.AccessToken);
            
            if (response.User != null)
            {
                _currentUser = response.User;
                await _localStorage.SetAsync(Constants.UserDataKey, response.User);
            }
        }
        
        return response ?? new AuthResponse { Message = "Login failed" };
    }

    public async Task<AuthResponse> RegisterAsync(string email, string name, string password, string phone)
    {
        // Clear any existing auth token before registration
        _apiService.ClearAuthToken();
        
        var response = await _apiService.PostAsync<AuthResponse>("auth/register/", new
        {
            email,
            name,
            password,
            password_confirm = password,
            phone,
            role = "passenger"
        });
        
        if (response?.Tokens != null)
        {
            await SaveTokensAsync(response.Tokens);
            _apiService.SetAuthToken(response.Tokens.AccessToken);
            
            if (response.User != null)
            {
                _currentUser = response.User;
                await _localStorage.SetAsync(Constants.UserDataKey, response.User);
            }
        }
        
        return response ?? new AuthResponse { Message = "Registration failed" };
    }

    public async Task LogoutAsync()
    {
        try
        {
            var refreshToken = await SecureStorage.GetAsync(Constants.RefreshTokenKey);
            if (!string.IsNullOrEmpty(refreshToken))
            {
                await _apiService.PostAsync<object>("auth/logout/", new { refresh = refreshToken });
            }
        }
        catch
        {
            // Ignore logout API errors
        }
        
        _currentUser = null;
        _apiService.ClearAuthToken();
        
        SecureStorage.Remove(Constants.AccessTokenKey);
        SecureStorage.Remove(Constants.RefreshTokenKey);
        await _localStorage.RemoveAsync(Constants.UserDataKey);
    }

    public async Task<bool> RefreshTokenAsync()
    {
        try
        {
            var refreshToken = await SecureStorage.GetAsync(Constants.RefreshTokenKey);
            if (string.IsNullOrEmpty(refreshToken))
                return false;
            
            var response = await _apiService.PostAsync<TokenRefreshResponse>("auth/refresh/", new
            {
                refresh = refreshToken
            });
            
            if (response?.Access != null)
            {
                await SecureStorage.SetAsync(Constants.AccessTokenKey, response.Access);
                _apiService.SetAuthToken(response.Access);
                return true;
            }
        }
        catch
        {
            // Refresh failed, user needs to login again
        }
        
        return false;
    }

    private async Task SaveTokensAsync(AuthTokens tokens)
    {
        await SecureStorage.SetAsync(Constants.AccessTokenKey, tokens.AccessToken);
        await SecureStorage.SetAsync(Constants.RefreshTokenKey, tokens.RefreshToken);
    }
}

/// <summary>
/// Token refresh response
/// </summary>
public class TokenRefreshResponse
{
    public string Access { get; set; } = string.Empty;
}
