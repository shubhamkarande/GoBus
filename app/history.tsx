import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    Alert,
    FlatList,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

interface Trip {
  id: string;
  ticketId: string;
  busName: string;
  from: string;
  to: string;
  date: string;
  departureTime: string;
  seats: string[];
  totalPrice: number;
  status: 'upcoming' | 'completed' | 'cancelled';
  bookingDate: string;
}

export default function HistoryScreen() {
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');
  const [trips, setTrips] = useState<Trip[]>([]);

  useEffect(() => {
    // Mock data - replace with API call
    const mockTrips: Trip[] = [
      {
        id: '1',
        ticketId: 'GB1704067200000',
        busName: 'Volvo Multi-Axle',
        from: 'Mumbai',
        to: 'Pune',
        date: '2025-02-15',
        departureTime: '22:30',
        seats: ['1A', '1B'],
        totalPrice: 2450,
        status: 'upcoming',
        bookingDate: '2025-01-28',
      },
      {
        id: '2',
        ticketId: 'GB1703980800000',
        busName: 'Scania Multi-Axle',
        from: 'Delhi',
        to: 'Agra',
        date: '2025-01-20',
        departureTime: '08:00',
        seats: ['3C'],
        totalPrice: 975,
        status: 'completed',
        bookingDate: '2025-01-15',
      },
      {
        id: '3',
        ticketId: 'GB1703894400000',
        busName: 'Mercedes Multi-Axle',
        from: 'Bangalore',
        to: 'Chennai',
        date: '2025-01-10',
        departureTime: '23:00',
        seats: ['2A', '2B'],
        totalPrice: 1800,
        status: 'completed',
        bookingDate: '2025-01-05',
      },
    ];
    setTrips(mockTrips);
  }, []);

  const filteredTrips = trips.filter(trip => {
    const tripDate = new Date(trip.date);
    const today = new Date();
    
    if (activeTab === 'upcoming') {
      return tripDate >= today || trip.status === 'upcoming';
    } else {
      return tripDate < today || trip.status === 'completed' || trip.status === 'cancelled';
    }
  });

  const cancelTrip = (tripId: string) => {
    Alert.alert(
      'Cancel Trip',
      'Are you sure you want to cancel this trip? Cancellation charges may apply.',
      [
        { text: 'No', style: 'cancel' },
        {
          text: 'Yes, Cancel',
          style: 'destructive',
          onPress: () => {
            setTrips(prev => prev.map(trip => 
              trip.id === tripId ? { ...trip, status: 'cancelled' as const } : trip
            ));
            Alert.alert('Trip Cancelled', 'Your trip has been cancelled successfully.');
          },
        },
      ]
    );
  };

  const viewTicket = (trip: Trip) => {
    router.push({
      pathname: '/ticket',
      params: {
        ticketId: trip.ticketId,
        busName: trip.busName,
        from: trip.from,
        to: trip.to,
        date: trip.date,
        departureTime: trip.departureTime,
        selectedSeats: JSON.stringify(trip.seats.map(seat => ({ id: seat, number: seat }))),
        totalPrice: trip.totalPrice.toString(),
        paymentMethod: 'razorpay',
      },
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming':
        return '#4CAF50';
      case 'completed':
        return '#2196F3';
      case 'cancelled':
        return '#f44336';
      default:
        return '#666';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'upcoming':
        return 'UPCOMING';
      case 'completed':
        return 'COMPLETED';
      case 'cancelled':
        return 'CANCELLED';
      default:
        return status.toUpperCase();
    }
  };

  const canCancelTrip = (trip: Trip) => {
    const tripDateTime = new Date(`${trip.date} ${trip.departureTime}`);
    const now = new Date();
    const timeDiff = tripDateTime.getTime() - now.getTime();
    const hoursDiff = timeDiff / (1000 * 3600);
    
    return trip.status === 'upcoming' && hoursDiff > 2;
  };

  const renderTripItem = ({ item }: { item: Trip }) => (
    <TouchableOpacity style={styles.tripCard} onPress={() => viewTicket(item)}>
      <View style={styles.tripHeader}>
        <View>
          <Text style={styles.ticketId}>#{item.ticketId}</Text>
          <Text style={styles.busName}>{item.busName}</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
          <Text style={styles.statusText}>{getStatusText(item.status)}</Text>
        </View>
      </View>

      <View style={styles.routeContainer}>
        <View style={styles.routeInfo}>
          <Text style={styles.cityCode}>{item.from.slice(0, 3).toUpperCase()}</Text>
          <Text style={styles.cityName}>{item.from}</Text>
        </View>
        <View style={styles.routeLine}>
          <View style={styles.routeDot} />
          <View style={styles.routeLineBar} />
          <Ionicons name="bus" size={16} color="#4c669f" />
          <View style={styles.routeLineBar} />
          <View style={styles.routeDot} />
        </View>
        <View style={styles.routeInfo}>
          <Text style={styles.cityCode}>{item.to.slice(0, 3).toUpperCase()}</Text>
          <Text style={styles.cityName}>{item.to}</Text>
        </View>
      </View>

      <View style={styles.tripDetails}>
        <View style={styles.detailRow}>
          <View style={styles.detailItem}>
            <Ionicons name="calendar-outline" size={16} color="#666" />
            <Text style={styles.detailText}>{item.date}</Text>
          </View>
          <View style={styles.detailItem}>
            <Ionicons name="time-outline" size={16} color="#666" />
            <Text style={styles.detailText}>{item.departureTime}</Text>
          </View>
        </View>
        <View style={styles.detailRow}>
          <View style={styles.detailItem}>
            <Ionicons name="person-outline" size={16} color="#666" />
            <Text style={styles.detailText}>{item.seats.length} passenger{item.seats.length > 1 ? 's' : ''}</Text>
          </View>
          <View style={styles.detailItem}>
            <Ionicons name="card-outline" size={16} color="#666" />
            <Text style={styles.detailText}>₹{item.totalPrice}</Text>
          </View>
        </View>
      </View>

      <View style={styles.seatInfo}>
        <Text style={styles.seatLabel}>Seats: </Text>
        {item.seats.map((seat, index) => (
          <View key={seat} style={styles.seatTag}>
            <Text style={styles.seatTagText}>{seat}</Text>
          </View>
        ))}
      </View>

      {item.status === 'upcoming' && (
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.viewButton} onPress={() => viewTicket(item)}>
            <Text style={styles.viewButtonText}>View Ticket</Text>
          </TouchableOpacity>
          {canCancelTrip(item) && (
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => cancelTrip(item.id)}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'upcoming' && styles.activeTab]}
          onPress={() => setActiveTab('upcoming')}
        >
          <Text style={[styles.tabText, activeTab === 'upcoming' && styles.activeTabText]}>
            Upcoming
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'past' && styles.activeTab]}
          onPress={() => setActiveTab('past')}
        >
          <Text style={[styles.tabText, activeTab === 'past' && styles.activeTabText]}>
            Past Trips
          </Text>
        </TouchableOpacity>
      </View>

      {/* Trip List */}
      {filteredTrips.length > 0 ? (
        <FlatList
          data={filteredTrips}
          renderItem={renderTripItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Ionicons name="bus-outline" size={64} color="#ccc" />
          <Text style={styles.emptyTitle}>No trips found</Text>
          <Text style={styles.emptySubtitle}>
            {activeTab === 'upcoming' 
              ? "You don't have any upcoming trips"
              : "You haven't taken any trips yet"
            }
          </Text>
          <TouchableOpacity
            style={styles.bookButton}
            onPress={() => router.push('/search')}
          >
            <Text style={styles.bookButtonText}>Book Your First Trip</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: '#4c669f',
  },
  tabText: {
    fontSize: 16,
    color: '#666',
  },
  activeTabText: {
    color: '#4c669f',
    fontWeight: 'bold',
  },
  listContainer: {
    padding: 20,
  },
  tripCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  tripHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  ticketId: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
  },
  busName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  routeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  routeInfo: {
    alignItems: 'center',
    flex: 1,
  },
  cityCode: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4c669f',
    marginBottom: 2,
  },
  cityName: {
    fontSize: 12,
    color: '#666',
  },
  routeLine: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 2,
    justifyContent: 'center',
  },
  routeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#4c669f',
  },
  routeLineBar: {
    height: 1,
    backgroundColor: '#4c669f',
    flex: 1,
    marginHorizontal: 6,
  },
  tripDetails: {
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  detailText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 6,
  },
  seatInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  seatLabel: {
    fontSize: 14,
    color: '#666',
    marginRight: 8,
  },
  seatTag: {
    backgroundColor: '#e8f4f8',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 6,
    marginBottom: 4,
  },
  seatTagText: {
    fontSize: 12,
    color: '#4c669f',
    fontWeight: '600',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  viewButton: {
    flex: 1,
    backgroundColor: '#4c669f',
    paddingVertical: 10,
    borderRadius: 6,
    alignItems: 'center',
    marginRight: 8,
  },
  viewButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#f44336',
    paddingVertical: 10,
    borderRadius: 6,
    alignItems: 'center',
    marginLeft: 8,
  },
  cancelButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
  },
  bookButton: {
    backgroundColor: '#4c669f',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  bookButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});