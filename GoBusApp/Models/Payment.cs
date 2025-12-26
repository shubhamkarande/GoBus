namespace GoBusApp.Models;

/// <summary>
/// Payment initiation response
/// </summary>
public class PaymentInitResponse
{
    public string Message { get; set; } = string.Empty;
    public string PaymentId { get; set; } = string.Empty;
    public string OrderId { get; set; } = string.Empty;
    public decimal Amount { get; set; }
    public string Currency { get; set; } = "INR";
    public CheckoutOptions? CheckoutOptions { get; set; }
}

/// <summary>
/// Razorpay checkout options
/// </summary>
public class CheckoutOptions
{
    public string Key { get; set; } = string.Empty;
    public int Amount { get; set; }
    public string Currency { get; set; } = "INR";
    public string Name { get; set; } = "GoBus";
    public string Description { get; set; } = string.Empty;
    public string OrderId { get; set; } = string.Empty;
    public Prefill? Prefill { get; set; }
    public bool MockMode { get; set; }
}

/// <summary>
/// Prefill data for checkout
/// </summary>
public class Prefill
{
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Contact { get; set; } = string.Empty;
}

/// <summary>
/// Payment verification response
/// </summary>
public class PaymentVerifyResponse
{
    public string Message { get; set; } = string.Empty;
    public string BookingId { get; set; } = string.Empty;
    public string BookingStatus { get; set; } = string.Empty;
}
