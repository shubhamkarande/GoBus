using GoBusApp.ViewModels;

namespace GoBusApp.Views.Seats;

public partial class SeatSelectionPage : ContentPage
{
    public SeatSelectionPage(SeatSelectionViewModel viewModel)
    {
        InitializeComponent();
        BindingContext = viewModel;
    }
}
