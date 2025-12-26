using System.Net.Http.Json;
using System.Text;
using System.Text.Json;
using GoBusApp.Helpers;
using GoBusApp.Models;

namespace GoBusApp.Services;

/// <summary>
/// API service interface
/// </summary>
public interface IApiService
{
    Task<T?> GetAsync<T>(string endpoint);
    Task<T?> PostAsync<T>(string endpoint, object data);
    Task<T?> PutAsync<T>(string endpoint, object data);
    Task<bool> DeleteAsync(string endpoint);
    void SetAuthToken(string token);
    void ClearAuthToken();
}

/// <summary>
/// HTTP API service for backend communication
/// </summary>
public class ApiService : IApiService
{
    private readonly HttpClient _httpClient;
    private readonly JsonSerializerOptions _jsonOptions;
    private string? _authToken;

    public ApiService()
    {
        _httpClient = new HttpClient
        {
            BaseAddress = new Uri(Constants.ApiBaseUrl),
            Timeout = TimeSpan.FromSeconds(Constants.ApiTimeoutSeconds)
        };
        
        _jsonOptions = new JsonSerializerOptions
        {
            PropertyNamingPolicy = JsonNamingPolicy.SnakeCaseLower,
            PropertyNameCaseInsensitive = true
        };
    }

    public void SetAuthToken(string token)
    {
        _authToken = token;
        _httpClient.DefaultRequestHeaders.Authorization = 
            new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", token);
    }

    public void ClearAuthToken()
    {
        _authToken = null;
        _httpClient.DefaultRequestHeaders.Authorization = null;
    }

    public async Task<T?> GetAsync<T>(string endpoint)
    {
        try
        {
            var response = await _httpClient.GetAsync(endpoint);
            return await HandleResponse<T>(response);
        }
        catch (Exception ex)
        {
            System.Diagnostics.Debug.WriteLine($"API GET Error: {ex.Message}");
            throw;
        }
    }

    public async Task<T?> PostAsync<T>(string endpoint, object data)
    {
        try
        {
            var json = JsonSerializer.Serialize(data, _jsonOptions);
            var content = new StringContent(json, Encoding.UTF8, "application/json");
            
            var response = await _httpClient.PostAsync(endpoint, content);
            return await HandleResponse<T>(response);
        }
        catch (Exception ex)
        {
            System.Diagnostics.Debug.WriteLine($"API POST Error: {ex.Message}");
            throw;
        }
    }

    public async Task<T?> PutAsync<T>(string endpoint, object data)
    {
        try
        {
            var json = JsonSerializer.Serialize(data, _jsonOptions);
            var content = new StringContent(json, Encoding.UTF8, "application/json");
            
            var response = await _httpClient.PutAsync(endpoint, content);
            return await HandleResponse<T>(response);
        }
        catch (Exception ex)
        {
            System.Diagnostics.Debug.WriteLine($"API PUT Error: {ex.Message}");
            throw;
        }
    }

    public async Task<bool> DeleteAsync(string endpoint)
    {
        try
        {
            var response = await _httpClient.DeleteAsync(endpoint);
            return response.IsSuccessStatusCode;
        }
        catch (Exception ex)
        {
            System.Diagnostics.Debug.WriteLine($"API DELETE Error: {ex.Message}");
            throw;
        }
    }

    private async Task<T?> HandleResponse<T>(HttpResponseMessage response)
    {
        var content = await response.Content.ReadAsStringAsync();
        
        if (!response.IsSuccessStatusCode)
        {
            System.Diagnostics.Debug.WriteLine($"API Error {response.StatusCode}: {content}");
            
            // Try to parse error message
            try
            {
                var error = JsonSerializer.Deserialize<ApiError>(content, _jsonOptions);
                throw new ApiException(error?.Error ?? error?.Detail ?? "An error occurred", (int)response.StatusCode);
            }
            catch (JsonException)
            {
                throw new ApiException(content, (int)response.StatusCode);
            }
        }
        
        if (string.IsNullOrEmpty(content))
            return default;
        
        return JsonSerializer.Deserialize<T>(content, _jsonOptions);
    }
}

/// <summary>
/// API error response
/// </summary>
public class ApiError
{
    public string? Error { get; set; }
    public string? Detail { get; set; }
    public string? Message { get; set; }
}

/// <summary>
/// Custom API exception
/// </summary>
public class ApiException : Exception
{
    public int StatusCode { get; }
    
    public ApiException(string message, int statusCode) : base(message)
    {
        StatusCode = statusCode;
    }
}
