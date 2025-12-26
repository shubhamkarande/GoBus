namespace GoBusApp.Models;

/// <summary>
/// E-Ticket model with QR data
/// </summary>
public class Ticket
{
    public string Id { get; set; } = string.Empty;
    public string BusName { get; set; } = string.Empty;
    public string BusNumber { get; set; } = string.Empty;
    public string Source { get; set; } = string.Empty;
    public string Destination { get; set; } = string.Empty;
    public DateTime DepartureTime { get; set; }
    public DateTime ArrivalTime { get; set; }
    public List<string> SeatNumbers { get; set; } = new();
    public string PassengerName { get; set; } = string.Empty;
    public string PassengerPhone { get; set; } = string.Empty;
    public decimal TotalAmount { get; set; }
    public string QrData { get; set; } = string.Empty;
    public string? QrImageBase64 { get; set; }
    public bool IsValidated { get; set; }
    public DateTime? ValidatedAt { get; set; }
    public DateTime CreatedAt { get; set; }
    
    /// <summary>
    /// Formatted departure
    /// </summary>
    public string FormattedDeparture => $"{DepartureTime:ddd, dd MMM} at {DepartureTime:hh:mm tt}";
    
    /// <summary>
    /// Formatted seats
    /// </summary>
    public string FormattedSeats => string.Join(", ", SeatNumbers);
    
    /// <summary>
    /// Route display
    /// </summary>
    public string RouteDisplay => $"{Source} → {Destination}";
    
    /// <summary>
    /// Formatted amount
    /// </summary>
    public string FormattedAmount => $"₹{TotalAmount:N0}";
}

/// <summary>
/// Ticket list response
/// </summary>
public class TicketsResponse
{
    public int Count { get; set; }
    public List<Ticket> Tickets { get; set; } = new();
}
