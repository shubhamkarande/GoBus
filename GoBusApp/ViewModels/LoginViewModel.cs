using CommunityToolkit.Mvvm.ComponentModel;
using CommunityToolkit.Mvvm.Input;
using GoBusApp.Services;

namespace GoBusApp.ViewModels;

/// <summary>
/// Login page ViewModel
/// </summary>
public partial class LoginViewModel : BaseViewModel
{
    private readonly IAuthService _authService;
    private readonly INavigationService _navigationService;

    [ObservableProperty]
    private string _email = string.Empty;

    [ObservableProperty]
    private string _password = string.Empty;

    public LoginViewModel(IAuthService authService, INavigationService navigationService)
    {
        _authService = authService;
        _navigationService = navigationService;
        Title = "Login";
    }

    [RelayCommand]
    private async Task LoginAsync()
    {
        if (string.IsNullOrWhiteSpace(Email) || string.IsNullOrWhiteSpace(Password))
        {
            await ShowErrorAsync("Please enter email and password");
            return;
        }

        await ExecuteAsync(async () =>
        {
            var response = await _authService.LoginAsync(Email.Trim(), Password);
            
            if (response.User != null)
            {
                await _navigationService.GoToMainAsync();
            }
            else
            {
                await ShowErrorAsync(response.Message);
            }
        });
    }

    [RelayCommand]
    private async Task GoToRegisterAsync()
    {
        await _navigationService.GoToAsync("//register");
    }
}
