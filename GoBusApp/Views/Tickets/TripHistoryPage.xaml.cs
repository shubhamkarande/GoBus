using GoBusApp.ViewModels;

namespace GoBusApp.Views.Tickets;

public partial class TripHistoryPage : ContentPage
{
    private readonly TripHistoryViewModel _viewModel;
    
    public TripHistoryPage(TripHistoryViewModel viewModel)
    {
        InitializeComponent();
        _viewModel = viewModel;
        BindingContext = viewModel;
    }

    protected override async void OnAppearing()
    {
        base.OnAppearing();
        await _viewModel.LoadTripsCommand.ExecuteAsync(null);
    }
}
