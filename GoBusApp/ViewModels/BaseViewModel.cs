using CommunityToolkit.Mvvm.ComponentModel;
using CommunityToolkit.Mvvm.Input;
using GoBusApp.Services;

namespace GoBusApp.ViewModels;

/// <summary>
/// Base ViewModel with common functionality
/// </summary>
public partial class BaseViewModel : ObservableObject
{
    [ObservableProperty]
    [NotifyPropertyChangedFor(nameof(IsNotBusy))]
    private bool _isBusy;

    [ObservableProperty]
    private string _title = string.Empty;

    [ObservableProperty]
    private string? _errorMessage;

    public bool IsNotBusy => !IsBusy;

    protected async Task ExecuteAsync(Func<Task> operation, string? loadingMessage = null)
    {
        if (IsBusy)
            return;

        try
        {
            IsBusy = true;
            ErrorMessage = null;
            await operation();
        }
        catch (ApiException ex)
        {
            ErrorMessage = ex.Message;
            await ShowErrorAsync(ex.Message);
        }
        catch (Exception ex)
        {
            ErrorMessage = "An unexpected error occurred";
            await ShowErrorAsync(ex.Message);
        }
        finally
        {
            IsBusy = false;
        }
    }

    protected async Task<T?> ExecuteAsync<T>(Func<Task<T>> operation, string? loadingMessage = null)
    {
        if (IsBusy)
            return default;

        try
        {
            IsBusy = true;
            ErrorMessage = null;
            return await operation();
        }
        catch (ApiException ex)
        {
            ErrorMessage = ex.Message;
            await ShowErrorAsync(ex.Message);
            return default;
        }
        catch (Exception ex)
        {
            ErrorMessage = "An unexpected error occurred";
            await ShowErrorAsync(ex.Message);
            return default;
        }
        finally
        {
            IsBusy = false;
        }
    }

    protected async Task ShowErrorAsync(string message)
    {
        await Shell.Current.DisplayAlert("Error", message, "OK");
    }

    protected async Task ShowSuccessAsync(string title, string message)
    {
        await Shell.Current.DisplayAlert(title, message, "OK");
    }

    protected async Task<bool> ShowConfirmAsync(string title, string message)
    {
        return await Shell.Current.DisplayAlert(title, message, "Yes", "No");
    }
}
