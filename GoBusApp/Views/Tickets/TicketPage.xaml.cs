using GoBusApp.ViewModels;

namespace GoBusApp.Views.Tickets;

public partial class TicketPage : ContentPage
{
    public TicketPage(TicketViewModel viewModel)
    {
        InitializeComponent();
        BindingContext = viewModel;
    }
}
