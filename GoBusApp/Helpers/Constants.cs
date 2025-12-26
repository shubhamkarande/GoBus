namespace GoBusApp.Helpers;

/// <summary>
/// Application constants
/// </summary>
public static class Constants
{
    // API Configuration
    #if DEBUG
    public const string ApiBaseUrl = "http://10.0.2.2:8000/api/";  // Android emulator localhost
    #else
    public const string ApiBaseUrl = "https://your-production-url.com/api/";
    #endif
    
    // Storage Keys
    public const string AccessTokenKey = "access_token";
    public const string RefreshTokenKey = "refresh_token";
    public const string UserDataKey = "user_data";
    
    // Timeouts
    public const int ApiTimeoutSeconds = 30;
    public const int SeatLockMinutes = 10;
    
    // Validation
    public const int MinPasswordLength = 8;
    public const int MaxSeatsPerBooking = 10;
}
