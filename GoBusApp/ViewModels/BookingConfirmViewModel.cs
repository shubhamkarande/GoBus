using CommunityToolkit.Mvvm.ComponentModel;
using CommunityToolkit.Mvvm.Input;
using GoBusApp.Models;
using GoBusApp.Services;

namespace GoBusApp.ViewModels;

/// <summary>
/// Booking confirmation page ViewModel
/// </summary>
[QueryProperty(nameof(Bus), "Bus")]
[QueryProperty(nameof(SelectedSeatsList), "SelectedSeats")]
public partial class BookingConfirmViewModel : BaseViewModel
{
    private readonly IApiService _apiService;
    private readonly IAuthService _authService;
    private readonly INavigationService _navigationService;

    [ObservableProperty]
    private Bus? _bus;

    [ObservableProperty]
    private List<Seat> _selectedSeatsList = new();

    [ObservableProperty]
    private string _passengerName = string.Empty;

    [ObservableProperty]
    private string _passengerPhone = string.Empty;

    [ObservableProperty]
    private string _passengerEmail = string.Empty;

    [ObservableProperty]
    private string _selectedSeatsDisplay = string.Empty;

    [ObservableProperty]
    private decimal _totalPrice;

    [ObservableProperty]
    private Booking? _createdBooking;

    public BookingConfirmViewModel(
        IApiService apiService,
        IAuthService authService,
        INavigationService navigationService)
    {
        _apiService = apiService;
        _authService = authService;
        _navigationService = navigationService;
        Title = "Confirm Booking";
    }

    partial void OnBusChanged(Bus? value) => UpdateDisplay();
    partial void OnSelectedSeatsListChanged(List<Seat> value) => UpdateDisplay();

    private async void UpdateDisplay()
    {
        if (Bus == null) return;
        
        SelectedSeatsDisplay = string.Join(", ", SelectedSeatsList.Select(s => s.SeatNumber));
        TotalPrice = SelectedSeatsList.Count * Bus.Price;
        
        // Pre-fill user details
        var user = await _authService.GetCurrentUserAsync();
        if (user != null)
        {
            PassengerName = user.Name;
            PassengerEmail = user.Email;
            PassengerPhone = user.Phone ?? string.Empty;
        }
    }

    [RelayCommand]
    private async Task CreateBookingAsync()
    {
        // Validation
        if (string.IsNullOrWhiteSpace(PassengerName))
        {
            await ShowErrorAsync("Please enter passenger name");
            return;
        }

        if (string.IsNullOrWhiteSpace(PassengerPhone))
        {
            await ShowErrorAsync("Please enter phone number");
            return;
        }

        if (string.IsNullOrWhiteSpace(PassengerEmail) || !PassengerEmail.Contains("@"))
        {
            await ShowErrorAsync("Please enter a valid email");
            return;
        }

        if (Bus == null || SelectedSeatsList.Count == 0)
        {
            await ShowErrorAsync("No seats selected");
            return;
        }

        await ExecuteAsync(async () =>
        {
            var response = await _apiService.PostAsync<BookingResponse>("bookings/create/", new
            {
                bus_id = Bus.Id,
                seat_ids = SelectedSeatsList.Select(s => s.Id).ToList(),
                passenger_name = PassengerName,
                passenger_phone = PassengerPhone,
                passenger_email = PassengerEmail
            });
            
            if (response?.Booking != null)
            {
                CreatedBooking = response.Booking;
                
                // Navigate to payment
                var parameters = new Dictionary<string, object>
                {
                    { "Booking", response.Booking }
                };
                
                await _navigationService.GoToAsync("payment", parameters);
            }
            else
            {
                await ShowErrorAsync(response?.Message ?? "Failed to create booking");
            }
        });
    }
}
