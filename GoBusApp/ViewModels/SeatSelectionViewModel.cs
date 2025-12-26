using System.Collections.ObjectModel;
using CommunityToolkit.Mvvm.ComponentModel;
using CommunityToolkit.Mvvm.Input;
using GoBusApp.Helpers;
using GoBusApp.Models;
using GoBusApp.Services;

namespace GoBusApp.ViewModels;

/// <summary>
/// Seat selection page ViewModel
/// </summary>
[QueryProperty(nameof(Bus), "Bus")]
public partial class SeatSelectionViewModel : BaseViewModel
{
    private readonly IApiService _apiService;
    private readonly INavigationService _navigationService;

    [ObservableProperty]
    private Bus? _bus;

    [ObservableProperty]
    private ObservableCollection<Seat> _seats = new();

    [ObservableProperty]
    private ObservableCollection<Seat> _selectedSeats = new();

    [ObservableProperty]
    private decimal _totalPrice;

    [ObservableProperty]
    private string _selectedSeatsDisplay = string.Empty;

    [ObservableProperty]
    private bool _canProceed;

    public SeatSelectionViewModel(IApiService apiService, INavigationService navigationService)
    {
        _apiService = apiService;
        _navigationService = navigationService;
        Title = "Select Seats";
    }

    partial void OnBusChanged(Bus? value)
    {
        if (value != null)
        {
            _ = LoadSeatsAsync();
        }
    }

    [RelayCommand]
    private async Task LoadSeatsAsync()
    {
        if (Bus == null) return;

        await ExecuteAsync(async () =>
        {
            var response = await _apiService.GetAsync<SeatsResponse>($"buses/{Bus.Id}/seats/");
            
            Seats.Clear();
            SelectedSeats.Clear();
            
            if (response?.Seats != null)
            {
                foreach (var seat in response.Seats)
                {
                    Seats.Add(seat);
                }
            }
            
            UpdateSelection();
        });
    }

    [RelayCommand]
    private void ToggleSeat(Seat seat)
    {
        if (seat == null || !seat.CanSelect) return;

        if (seat.IsSelected)
        {
            seat.IsSelected = false;
            SelectedSeats.Remove(seat);
        }
        else
        {
            if (SelectedSeats.Count >= Constants.MaxSeatsPerBooking)
            {
                _ = ShowErrorAsync($"Maximum {Constants.MaxSeatsPerBooking} seats allowed per booking");
                return;
            }
            
            seat.IsSelected = true;
            SelectedSeats.Add(seat);
        }
        
        UpdateSelection();
    }

    private void UpdateSelection()
    {
        if (Bus == null) return;
        
        TotalPrice = SelectedSeats.Count * Bus.Price;
        SelectedSeatsDisplay = SelectedSeats.Count > 0 
            ? string.Join(", ", SelectedSeats.Select(s => s.SeatNumber))
            : "No seats selected";
        CanProceed = SelectedSeats.Count > 0;
    }

    [RelayCommand]
    private async Task ProceedToBookingAsync()
    {
        if (!CanProceed || Bus == null) return;

        var parameters = new Dictionary<string, object>
        {
            { "Bus", Bus },
            { "SelectedSeats", SelectedSeats.ToList() }
        };

        await _navigationService.GoToAsync("confirm", parameters);
    }
}
