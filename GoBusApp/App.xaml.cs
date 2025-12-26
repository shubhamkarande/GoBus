using GoBusApp.Services;

namespace GoBusApp;

public partial class App : Application
{
    private readonly IAuthService _authService;

    public App(IAuthService authService)
    {
        InitializeComponent();
        _authService = authService;
        MainPage = new AppShell();
    }

    protected override async void OnStart()
    {
        base.OnStart();
        
        try
        {
            // Check if user is already logged in
            var isLoggedIn = await _authService.IsLoggedInAsync();
            
            if (isLoggedIn)
            {
                await Shell.Current.GoToAsync("///search");
            }
            else
            {
                await Shell.Current.GoToAsync("//login");
            }
        }
        catch (Exception ex)
        {
            System.Diagnostics.Debug.WriteLine($"Startup error: {ex.Message}");
            // Navigate to login on any error
            try
            {
                await Shell.Current.GoToAsync("//login");
            }
            catch { }
        }
    }
}
