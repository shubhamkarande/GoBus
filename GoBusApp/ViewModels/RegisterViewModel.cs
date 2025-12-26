using CommunityToolkit.Mvvm.ComponentModel;
using CommunityToolkit.Mvvm.Input;
using GoBusApp.Helpers;
using GoBusApp.Services;

namespace GoBusApp.ViewModels;

/// <summary>
/// Registration page ViewModel
/// </summary>
public partial class RegisterViewModel : BaseViewModel
{
    private readonly IAuthService _authService;
    private readonly INavigationService _navigationService;

    [ObservableProperty]
    private string _name = string.Empty;

    [ObservableProperty]
    private string _email = string.Empty;

    [ObservableProperty]
    private string _phone = string.Empty;

    [ObservableProperty]
    private string _password = string.Empty;

    [ObservableProperty]
    private string _confirmPassword = string.Empty;

    public RegisterViewModel(IAuthService authService, INavigationService navigationService)
    {
        _authService = authService;
        _navigationService = navigationService;
        Title = "Create Account";
    }

    [RelayCommand]
    private async Task RegisterAsync()
    {
        // Validation
        if (string.IsNullOrWhiteSpace(Name))
        {
            await ShowErrorAsync("Please enter your name");
            return;
        }

        if (string.IsNullOrWhiteSpace(Email) || !Email.Contains("@"))
        {
            await ShowErrorAsync("Please enter a valid email");
            return;
        }

        if (string.IsNullOrWhiteSpace(Password) || Password.Length < Constants.MinPasswordLength)
        {
            await ShowErrorAsync($"Password must be at least {Constants.MinPasswordLength} characters");
            return;
        }

        if (Password != ConfirmPassword)
        {
            await ShowErrorAsync("Passwords do not match");
            return;
        }

        await ExecuteAsync(async () =>
        {
            var response = await _authService.RegisterAsync(
                Email.Trim(),
                Name.Trim(),
                Password,
                Phone.Trim()
            );
            
            if (response.User != null)
            {
                await ShowSuccessAsync("Success", "Account created successfully!");
                await _navigationService.GoToMainAsync();
            }
            else
            {
                await ShowErrorAsync(response.Message);
            }
        });
    }

    [RelayCommand]
    private async Task GoToLoginAsync()
    {
        await _navigationService.GoToAsync("//login");
    }
}
