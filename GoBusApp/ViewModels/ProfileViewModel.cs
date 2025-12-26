using CommunityToolkit.Mvvm.ComponentModel;
using CommunityToolkit.Mvvm.Input;
using GoBusApp.Models;
using GoBusApp.Services;

namespace GoBusApp.ViewModels;

/// <summary>
/// Profile/Settings page ViewModel
/// </summary>
public partial class ProfileViewModel : BaseViewModel
{
    private readonly IAuthService _authService;
    private readonly INavigationService _navigationService;

    [ObservableProperty]
    private User? _user;

    [ObservableProperty]
    private string _appVersion = "1.0.0";

    public ProfileViewModel(IAuthService authService, INavigationService navigationService)
    {
        _authService = authService;
        _navigationService = navigationService;
        Title = "Profile";
    }

    [RelayCommand]
    private async Task LoadProfileAsync()
    {
        await ExecuteAsync(async () =>
        {
            User = await _authService.GetCurrentUserAsync();
        });
    }

    [RelayCommand]
    private async Task LogoutAsync()
    {
        var confirm = await ShowConfirmAsync("Logout", "Are you sure you want to logout?");
        
        if (confirm)
        {
            await ExecuteAsync(async () =>
            {
                await _authService.LogoutAsync();
                await _navigationService.GoToLoginAsync();
            });
        }
    }

    [RelayCommand]
    private async Task OpenSupportAsync()
    {
        try
        {
            await Launcher.OpenAsync(new Uri("mailto:support@gobus.com"));
        }
        catch
        {
            await ShowErrorAsync("Unable to open email client");
        }
    }

    [RelayCommand]
    private async Task OpenPrivacyPolicyAsync()
    {
        try
        {
            await Launcher.OpenAsync(new Uri("https://gobus.com/privacy"));
        }
        catch
        {
            await ShowErrorAsync("Unable to open browser");
        }
    }

    [RelayCommand]
    private async Task OpenTermsAsync()
    {
        try
        {
            await Launcher.OpenAsync(new Uri("https://gobus.com/terms"));
        }
        catch
        {
            await ShowErrorAsync("Unable to open browser");
        }
    }
}
