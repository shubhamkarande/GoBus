using GoBusApp.ViewModels;

namespace GoBusApp.Views.Booking;

public partial class BookingConfirmPage : ContentPage
{
    public BookingConfirmPage(BookingConfirmViewModel viewModel)
    {
        InitializeComponent();
        BindingContext = viewModel;
    }
}
