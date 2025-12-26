namespace GoBusApp.Models;

/// <summary>
/// Booking model
/// </summary>
public class Booking
{
    public string Id { get; set; } = string.Empty;
    public Bus? Bus { get; set; }
    public List<Seat> Seats { get; set; } = new();
    public List<string> SeatNumbers { get; set; } = new();
    public string PassengerName { get; set; } = string.Empty;
    public string PassengerPhone { get; set; } = string.Empty;
    public string PassengerEmail { get; set; } = string.Empty;
    public int SeatCount { get; set; }
    public decimal PricePerSeat { get; set; }
    public decimal TotalAmount { get; set; }
    public string Status { get; set; } = string.Empty;
    public DateTime? LockExpiresAt { get; set; }
    public DateTime CreatedAt { get; set; }
    
    // Display properties from list serializer
    public string? BusName { get; set; }
    public string? Source { get; set; }
    public string? Destination { get; set; }
    public DateTime? DepartureTime { get; set; }
    
    /// <summary>
    /// Formatted seat numbers for display
    /// </summary>
    public string FormattedSeats => string.Join(", ", SeatNumbers);
    
    /// <summary>
    /// Formatted total amount
    /// </summary>
    public string FormattedAmount => $"₹{TotalAmount:N0}";
    
    /// <summary>
    /// Status display with emoji
    /// </summary>
    public string StatusDisplay => Status switch
    {
        "pending" => "⏳ Pending",
        "confirmed" => "✓ Confirmed",
        "cancelled" => "✗ Cancelled",
        "completed" => "✓ Completed",
        _ => Status
    };
    
    /// <summary>
    /// Status color for UI
    /// </summary>
    public Color StatusColor => Status switch
    {
        "pending" => Color.FromArgb("#FFC107"),
        "confirmed" => Color.FromArgb("#43A047"),
        "cancelled" => Color.FromArgb("#E53935"),
        "completed" => Color.FromArgb("#1E88E5"),
        _ => Color.FromArgb("#757575")
    };
}

/// <summary>
/// Booking create response
/// </summary>
public class BookingResponse
{
    public string Message { get; set; } = string.Empty;
    public Booking? Booking { get; set; }
}
