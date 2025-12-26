using CommunityToolkit.Mvvm.ComponentModel;

namespace GoBusApp.Models;

/// <summary>
/// Seat model with selection state
/// </summary>
public partial class Seat : ObservableObject
{
    public int Id { get; set; }
    public string SeatNumber { get; set; } = string.Empty;
    public int Row { get; set; }
    public int Column { get; set; }
    public bool IsBooked { get; set; }
    public bool IsAvailable { get; set; }
    
    [ObservableProperty]
    private bool _isSelected;
    
    /// <summary>
    /// Style key based on seat state
    /// </summary>
    public string StyleKey
    {
        get
        {
            if (IsSelected) return "SelectedSeat";
            if (IsBooked || !IsAvailable) return "BookedSeat";
            return "AvailableSeat";
        }
    }
    
    /// <summary>
    /// Background color based on state
    /// </summary>
    public Color BackgroundColor
    {
        get
        {
            if (IsSelected) return Color.FromArgb("#1E88E5");
            if (IsBooked || !IsAvailable) return Color.FromArgb("#E53935");
            return Color.FromArgb("#43A047");
        }
    }
    
    /// <summary>
    /// Can this seat be selected
    /// </summary>
    public bool CanSelect => !IsBooked && IsAvailable;
}

/// <summary>
/// Seats response from API
/// </summary>
public class SeatsResponse
{
    public string BusId { get; set; } = string.Empty;
    public string BusName { get; set; } = string.Empty;
    public int Rows { get; set; }
    public int SeatsPerRow { get; set; }
    public int TotalSeats { get; set; }
    public int AvailableSeats { get; set; }
    public List<Seat> Seats { get; set; } = new();
}
