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
        
        // Check if user is already logged in
        var isLoggedIn = await _authService.IsLoggedInAsync();
        
        if (isLoggedIn)
        {
            await Shell.Current.GoToAsync("//main/search");
        }
        else
        {
            await Shell.Current.GoToAsync("//login");
        }
    }
}
