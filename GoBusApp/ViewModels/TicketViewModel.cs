using CommunityToolkit.Mvvm.ComponentModel;
using CommunityToolkit.Mvvm.Input;
using GoBusApp.Models;
using GoBusApp.Services;

namespace GoBusApp.ViewModels;

/// <summary>
/// Ticket display page ViewModel
/// </summary>
[QueryProperty(nameof(BookingId), "BookingId")]
public partial class TicketViewModel : BaseViewModel
{
    private readonly IApiService _apiService;
    private readonly INavigationService _navigationService;

    [ObservableProperty]
    private string _bookingId = string.Empty;

    [ObservableProperty]
    private Ticket? _ticket;

    [ObservableProperty]
    private ImageSource? _qrCodeImage;

    public TicketViewModel(IApiService apiService, INavigationService navigationService)
    {
        _apiService = apiService;
        _navigationService = navigationService;
        Title = "Your Ticket";
    }

    partial void OnBookingIdChanged(string value)
    {
        if (!string.IsNullOrEmpty(value))
        {
            _ = LoadTicketAsync();
        }
    }

    [RelayCommand]
    private async Task LoadTicketAsync()
    {
        if (string.IsNullOrEmpty(BookingId)) return;

        await ExecuteAsync(async () =>
        {
            var response = await _apiService.GetAsync<Ticket>($"tickets/{BookingId}/");
            
            if (response != null)
            {
                Ticket = response;
                
                // Convert base64 QR code to ImageSource
                if (!string.IsNullOrEmpty(response.QrImageBase64))
                {
                    var bytes = Convert.FromBase64String(response.QrImageBase64);
                    QrCodeImage = ImageSource.FromStream(() => new MemoryStream(bytes));
                }
            }
        });
    }

    [RelayCommand]
    private async Task ShareTicketAsync()
    {
        if (Ticket == null) return;

        var message = $"🎫 GoBus Ticket\n\n" +
                      $"📍 {Ticket.Source} → {Ticket.Destination}\n" +
                      $"🚌 {Ticket.BusName} ({Ticket.BusNumber})\n" +
                      $"📅 {Ticket.FormattedDeparture}\n" +
                      $"💺 Seats: {Ticket.FormattedSeats}\n" +
                      $"👤 {Ticket.PassengerName}\n" +
                      $"💰 {Ticket.FormattedAmount}\n\n" +
                      $"Booking ID: {BookingId}";

        await Share.RequestAsync(new ShareTextRequest
        {
            Text = message,
            Title = "Share Ticket"
        });
    }

    [RelayCommand]
    private async Task GoHomeAsync()
    {
        await _navigationService.GoToMainAsync();
    }
}
