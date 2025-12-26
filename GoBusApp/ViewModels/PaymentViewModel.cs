using CommunityToolkit.Mvvm.ComponentModel;
using CommunityToolkit.Mvvm.Input;
using GoBusApp.Models;
using GoBusApp.Services;

namespace GoBusApp.ViewModels;

/// <summary>
/// Payment page ViewModel
/// </summary>
[QueryProperty(nameof(Booking), "Booking")]
public partial class PaymentViewModel : BaseViewModel
{
    private readonly IApiService _apiService;
    private readonly INavigationService _navigationService;

    [ObservableProperty]
    private Booking? _booking;

    [ObservableProperty]
    private PaymentInitResponse? _paymentInfo;

    [ObservableProperty]
    private bool _paymentInitiated;

    [ObservableProperty]
    private bool _paymentCompleted;

    [ObservableProperty]
    private string _paymentStatus = "Preparing payment...";

    public PaymentViewModel(IApiService apiService, INavigationService navigationService)
    {
        _apiService = apiService;
        _navigationService = navigationService;
        Title = "Payment";
    }

    partial void OnBookingChanged(Booking? value)
    {
        if (value != null)
        {
            _ = InitiatePaymentAsync();
        }
    }

    [RelayCommand]
    private async Task InitiatePaymentAsync()
    {
        if (Booking == null) return;

        await ExecuteAsync(async () =>
        {
            var response = await _apiService.PostAsync<PaymentInitResponse>("payments/create/", new
            {
                booking_id = Booking.Id
            });
            
            if (response != null)
            {
                PaymentInfo = response;
                PaymentInitiated = true;
                PaymentStatus = "Ready to pay";
            }
            else
            {
                PaymentStatus = "Failed to initialize payment";
            }
        });
    }

    [RelayCommand]
    private async Task ProcessPaymentAsync()
    {
        if (PaymentInfo == null || Booking == null) return;

        await ExecuteAsync(async () =>
        {
            PaymentStatus = "Processing payment...";
            
            // In mock mode, simulate payment success
            // In real mode, this would open Razorpay checkout
            string mockPaymentId = $"pay_mock_{Guid.NewGuid():N}".Substring(0, 24);
            string mockSignature = "mock_signature";
            
            if (PaymentInfo.CheckoutOptions?.MockMode == true)
            {
                // Simulate processing delay
                await Task.Delay(1500);
            }
            
            // Verify payment
            var verifyResponse = await _apiService.PostAsync<PaymentVerifyResponse>("payments/verify/", new
            {
                booking_id = Booking.Id,
                razorpay_payment_id = mockPaymentId,
                razorpay_signature = mockSignature
            });
            
            if (verifyResponse?.BookingStatus == "confirmed")
            {
                PaymentCompleted = true;
                PaymentStatus = "Payment successful!";
                
                await ShowSuccessAsync("Booking Confirmed!", "Your tickets have been booked successfully.");
                
                // Navigate to ticket
                var parameters = new Dictionary<string, object>
                {
                    { "BookingId", Booking.Id }
                };
                
                await _navigationService.GoToAsync("ticket", parameters);
            }
            else
            {
                PaymentStatus = "Payment verification failed";
                await ShowErrorAsync(verifyResponse?.Message ?? "Payment failed");
            }
        });
    }

    [RelayCommand]
    private async Task CancelPaymentAsync()
    {
        var confirm = await ShowConfirmAsync(
            "Cancel Payment?",
            "Your seat reservation will be released. Are you sure?"
        );
        
        if (confirm)
        {
            if (Booking != null)
            {
                try
                {
                    await _apiService.PostAsync<object>($"bookings/{Booking.Id}/cancel/", new { });
                }
                catch
                {
                    // Ignore cancellation errors
                }
            }
            
            await _navigationService.GoToMainAsync();
        }
    }
}
