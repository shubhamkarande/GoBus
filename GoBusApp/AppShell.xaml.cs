using GoBusApp.Views.Booking;
using GoBusApp.Views.Seats;
using GoBusApp.Views.Tickets;

namespace GoBusApp;

public partial class AppShell : Shell
{
    public AppShell()
    {
        InitializeComponent();
        
        // Register routes for navigation
        Routing.RegisterRoute("seats", typeof(SeatSelectionPage));
        Routing.RegisterRoute("confirm", typeof(BookingConfirmPage));
        Routing.RegisterRoute("payment", typeof(PaymentPage));
        Routing.RegisterRoute("ticket", typeof(TicketPage));
    }
}
