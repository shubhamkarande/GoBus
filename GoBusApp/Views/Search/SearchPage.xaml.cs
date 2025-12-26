using GoBusApp.ViewModels;

namespace GoBusApp.Views.Search;

public partial class SearchPage : ContentPage
{
    public SearchPage(SearchViewModel viewModel)
    {
        InitializeComponent();
        BindingContext = viewModel;
    }
}
