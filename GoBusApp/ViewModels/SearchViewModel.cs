using System.Collections.ObjectModel;
using CommunityToolkit.Mvvm.ComponentModel;
using CommunityToolkit.Mvvm.Input;
using GoBusApp.Models;
using GoBusApp.Services;

namespace GoBusApp.ViewModels;

/// <summary>
/// Search page ViewModel
/// </summary>
public partial class SearchViewModel : BaseViewModel
{
    private readonly IApiService _apiService;
    private readonly INavigationService _navigationService;

    [ObservableProperty]
    private string _source = string.Empty;

    [ObservableProperty]
    private string _destination = string.Empty;

    [ObservableProperty]
    private DateTime _travelDate = DateTime.Today;

    [ObservableProperty]
    private DateTime _minDate = DateTime.Today;

    [ObservableProperty]
    private DateTime _maxDate = DateTime.Today.AddMonths(3);

    [ObservableProperty]
    private ObservableCollection<Bus> _buses = new();

    [ObservableProperty]
    private bool _hasSearched;

    [ObservableProperty]
    private bool _noResults;

    public SearchViewModel(IApiService apiService, INavigationService navigationService)
    {
        _apiService = apiService;
        _navigationService = navigationService;
        Title = "Search Buses";
    }

    [RelayCommand]
    private async Task SearchAsync()
    {
        if (string.IsNullOrWhiteSpace(Source))
        {
            await ShowErrorAsync("Please enter departure city");
            return;
        }

        if (string.IsNullOrWhiteSpace(Destination))
        {
            await ShowErrorAsync("Please enter destination city");
            return;
        }

        await ExecuteAsync(async () =>
        {
            var dateStr = TravelDate.ToString("yyyy-MM-dd");
            var endpoint = $"buses/search/?source={Uri.EscapeDataString(Source)}&destination={Uri.EscapeDataString(Destination)}&date={dateStr}";
            
            var response = await _apiService.GetAsync<BusSearchResponse>(endpoint);
            
            Buses.Clear();
            HasSearched = true;
            
            if (response?.Buses != null && response.Buses.Count > 0)
            {
                foreach (var bus in response.Buses)
                {
                    Buses.Add(bus);
                }
                NoResults = false;
            }
            else
            {
                NoResults = true;
            }
        });
    }

    [RelayCommand]
    private void SwapLocations()
    {
        (Source, Destination) = (Destination, Source);
    }

    [RelayCommand]
    private async Task SelectBusAsync(Bus bus)
    {
        if (bus == null) return;

        var parameters = new Dictionary<string, object>
        {
            { "Bus", bus }
        };

        await _navigationService.GoToAsync("seats", parameters);
    }
}
