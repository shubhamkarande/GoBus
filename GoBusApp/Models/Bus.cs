namespace GoBusApp.Models;

/// <summary>
/// Bus model representing a bus service
/// </summary>
public class Bus
{
    public string Id { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string BusNumber { get; set; } = string.Empty;
    public string BusType { get; set; } = string.Empty;
    public string Source { get; set; } = string.Empty;
    public string Destination { get; set; } = string.Empty;
    public DateTime DepartureTime { get; set; }
    public DateTime ArrivalTime { get; set; }
    public string? Duration { get; set; }
    public string Price { get; set; } = "0";
    public int TotalSeats { get; set; }
    public int AvailableSeats { get; set; }
    public int Rows { get; set; }
    public int SeatsPerRow { get; set; }
    public bool HasWifi { get; set; }
    public bool HasCharging { get; set; }
    public bool HasToilet { get; set; }
    public bool HasWater { get; set; }
    public string OperatorName { get; set; } = string.Empty;
    public List<Seat> Seats { get; set; } = new();
    
    /// <summary>
    /// Parse price as decimal for calculations
    /// </summary>
    public decimal PriceValue => decimal.TryParse(Price, out var p) ? p : 0;
    
    /// <summary>
    /// Formatted departure time for display
    /// </summary>
    public string FormattedDepartureTime => DepartureTime.ToString("hh:mm tt");
    
    /// <summary>
    /// Formatted arrival time for display
    /// </summary>
    public string FormattedArrivalTime => ArrivalTime.ToString("hh:mm tt");
    
    /// <summary>
    /// Formatted date for display
    /// </summary>
    public string FormattedDate => DepartureTime.ToString("ddd, dd MMM yyyy");
    
    /// <summary>
    /// Formatted price for display
    /// </summary>
    public string FormattedPrice => $"₹{PriceValue:N0}";
    
    /// <summary>
    /// Amenities list for display
    /// </summary>
    public List<string> Amenities
    {
        get
        {
            var list = new List<string>();
            if (HasWifi) list.Add("WiFi");
            if (HasCharging) list.Add("Charging");
            if (HasToilet) list.Add("Toilet");
            if (HasWater) list.Add("Water");
            return list;
        }
    }
    
    /// <summary>
    /// Bus type display name
    /// </summary>
    public string BusTypeDisplay => BusType switch
    {
        "ac_sleeper" => "AC Sleeper",
        "ac_seater" => "AC Seater",
        "non_ac_sleeper" => "Non-AC Sleeper",
        "non_ac_seater" => "Non-AC Seater",
        "volvo" => "Volvo Multi-Axle",
        _ => BusType
    };
}

/// <summary>
/// Bus search response
/// </summary>
public class BusSearchResponse
{
    public int Count { get; set; }
    public List<Bus> Buses { get; set; } = new();
}
