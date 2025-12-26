using System.Text.Json;

namespace GoBusApp.Services;

/// <summary>
/// Local storage service interface
/// </summary>
public interface ILocalStorageService
{
    Task SetAsync<T>(string key, T value);
    Task<T?> GetAsync<T>(string key);
    Task RemoveAsync(string key);
    Task ClearAsync();
}

/// <summary>
/// Local storage service using Preferences
/// </summary>
public class LocalStorageService : ILocalStorageService
{
    private readonly JsonSerializerOptions _jsonOptions;

    public LocalStorageService()
    {
        _jsonOptions = new JsonSerializerOptions
        {
            PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
            PropertyNameCaseInsensitive = true
        };
    }

    public Task SetAsync<T>(string key, T value)
    {
        var json = JsonSerializer.Serialize(value, _jsonOptions);
        Preferences.Set(key, json);
        return Task.CompletedTask;
    }

    public Task<T?> GetAsync<T>(string key)
    {
        var json = Preferences.Get(key, string.Empty);
        
        if (string.IsNullOrEmpty(json))
            return Task.FromResult<T?>(default);
        
        try
        {
            var value = JsonSerializer.Deserialize<T>(json, _jsonOptions);
            return Task.FromResult(value);
        }
        catch
        {
            return Task.FromResult<T?>(default);
        }
    }

    public Task RemoveAsync(string key)
    {
        Preferences.Remove(key);
        return Task.CompletedTask;
    }

    public Task ClearAsync()
    {
        Preferences.Clear();
        return Task.CompletedTask;
    }
}
