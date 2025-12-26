namespace GoBusApp.Services;

/// <summary>
/// Navigation service interface
/// </summary>
public interface INavigationService
{
    Task GoToAsync(string route);
    Task GoToAsync(string route, IDictionary<string, object> parameters);
    Task GoBackAsync();
    Task GoToLoginAsync();
    Task GoToMainAsync();
}

/// <summary>
/// Shell navigation service
/// </summary>
public class NavigationService : INavigationService
{
    public async Task GoToAsync(string route)
    {
        await Shell.Current.GoToAsync(route);
    }

    public async Task GoToAsync(string route, IDictionary<string, object> parameters)
    {
        await Shell.Current.GoToAsync(route, parameters);
    }

    public async Task GoBackAsync()
    {
        await Shell.Current.GoToAsync("..");
    }

    public async Task GoToLoginAsync()
    {
        await Shell.Current.GoToAsync("//login");
    }

    public async Task GoToMainAsync()
    {
        await Shell.Current.GoToAsync("//main/search");
    }
}
