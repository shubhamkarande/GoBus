using CommunityToolkit.Mvvm.ComponentModel;
using CommunityToolkit.Mvvm.Input;
using GoBusApp.Services;
using GoBusApp.Views.Auth;
using GoBusApp.Views.Booking;
using GoBusApp.Views.Profile;
using GoBusApp.Views.Search;
using GoBusApp.Views.Seats;
using GoBusApp.Views.Tickets;
using Microsoft.Extensions.Logging;
using ZXing.Net.Maui.Controls;

namespace GoBusApp;

public static class MauiProgram
{
    public static MauiApp CreateMauiApp()
    {
        var builder = MauiApp.CreateBuilder();
        builder
            .UseMauiApp<App>()
            .UseBarcodeReader()
            .ConfigureFonts(fonts =>
            {
                fonts.AddFont("OpenSans-Regular.ttf", "OpenSansRegular");
                fonts.AddFont("OpenSans-Semibold.ttf", "OpenSansSemibold");
            });

        // Services
        builder.Services.AddSingleton<IApiService, ApiService>();
        builder.Services.AddSingleton<IAuthService, AuthService>();
        builder.Services.AddSingleton<ILocalStorageService, LocalStorageService>();
        builder.Services.AddSingleton<INavigationService, NavigationService>();

        // ViewModels
        builder.Services.AddTransient<ViewModels.LoginViewModel>();
        builder.Services.AddTransient<ViewModels.RegisterViewModel>();
        builder.Services.AddTransient<ViewModels.SearchViewModel>();
        builder.Services.AddTransient<ViewModels.SeatSelectionViewModel>();
        builder.Services.AddTransient<ViewModels.BookingConfirmViewModel>();
        builder.Services.AddTransient<ViewModels.PaymentViewModel>();
        builder.Services.AddTransient<ViewModels.TicketViewModel>();
        builder.Services.AddTransient<ViewModels.TripHistoryViewModel>();
        builder.Services.AddTransient<ViewModels.ProfileViewModel>();

        // Pages
        builder.Services.AddTransient<LoginPage>();
        builder.Services.AddTransient<RegisterPage>();
        builder.Services.AddTransient<SearchPage>();
        builder.Services.AddTransient<SeatSelectionPage>();
        builder.Services.AddTransient<BookingConfirmPage>();
        builder.Services.AddTransient<PaymentPage>();
        builder.Services.AddTransient<TicketPage>();
        builder.Services.AddTransient<TripHistoryPage>();
        builder.Services.AddTransient<ProfilePage>();

#if DEBUG
        builder.Logging.AddDebug();
#endif

        return builder.Build();
    }
}
