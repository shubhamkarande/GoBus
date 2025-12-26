using System.Collections.ObjectModel;
using CommunityToolkit.Mvvm.ComponentModel;
using CommunityToolkit.Mvvm.Input;
using GoBusApp.Models;
using GoBusApp.Services;

namespace GoBusApp.ViewModels;

/// <summary>
/// Trip history page ViewModel
/// </summary>
public partial class TripHistoryViewModel : BaseViewModel
{
    private readonly IApiService _apiService;
    private readonly INavigationService _navigationService;

    [ObservableProperty]
    private ObservableCollection<Booking> _upcomingTrips = new();

    [ObservableProperty]
    private ObservableCollection<Booking> _pastTrips = new();

    [ObservableProperty]
    private bool _hasUpcoming;

    [ObservableProperty]
    private bool _hasPast;

    public TripHistoryViewModel(IApiService apiService, INavigationService navigationService)
    {
        _apiService = apiService;
        _navigationService = navigationService;
        Title = "My Trips";
    }

    [RelayCommand]
    private async Task LoadTripsAsync()
    {
        await ExecuteAsync(async () =>
        {
            // Load upcoming trips
            var upcoming = await _apiService.GetAsync<BookingListResponse>("bookings/upcoming/");
            UpcomingTrips.Clear();
            if (upcoming?.Results != null)
            {
                foreach (var booking in upcoming.Results)
                {
                    UpcomingTrips.Add(booking);
                }
            }
            HasUpcoming = UpcomingTrips.Count > 0;
            
            // Load all history
            var history = await _apiService.GetAsync<BookingListResponse>("bookings/history/");
            PastTrips.Clear();
            if (history?.Results != null)
            {
                foreach (var booking in history.Results.Where(b => b.Status != "pending"))
                {
                    // Skip upcoming trips in past list
                    if (!UpcomingTrips.Any(u => u.Id == booking.Id))
                    {
                        PastTrips.Add(booking);
                    }
                }
            }
            HasPast = PastTrips.Count > 0;
        });
    }

    [RelayCommand]
    private async Task ViewTicketAsync(Booking booking)
    {
        if (booking == null || booking.Status != "confirmed") return;

        var parameters = new Dictionary<string, object>
        {
            { "BookingId", booking.Id }
        };

        await _navigationService.GoToAsync("ticket", parameters);
    }

    [RelayCommand]
    private async Task CancelBookingAsync(Booking booking)
    {
        if (booking == null) return;

        var confirm = await ShowConfirmAsync(
            "Cancel Booking?",
            $"Cancel your trip from {booking.Source} to {booking.Destination}?"
        );
        
        if (!confirm) return;

        await ExecuteAsync(async () =>
        {
            await _apiService.PostAsync<object>($"bookings/{booking.Id}/cancel/", new { });
            await ShowSuccessAsync("Cancelled", "Your booking has been cancelled");
            await LoadTripsAsync();
        });
    }
}

/// <summary>
/// Booking list response (paginated)
/// </summary>
public class BookingListResponse
{
    public int Count { get; set; }
    public List<Booking> Results { get; set; } = new();
}
