import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

interface Seat {
  id: string;
  number: string;
  type: 'window' | 'aisle' | 'middle';
  status: 'available' | 'booked' | 'selected';
  price: number;
}

export default function SeatSelectionScreen() {
  const { busId, busName, price, from, to, date, departureTime } = useLocalSearchParams();
  const [seats, setSeats] = useState<Seat[]>([]);
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const maxSeats = 5;

  useEffect(() => {
    // Mock seat layout - replace with API call
    const mockSeats: Seat[] = [];
    const basePrice = parseInt(price as string);
    
    // Generate 40 seats (10 rows, 4 seats per row)
    for (let row = 1; row <= 10; row++) {
      const seatLetters = ['A', 'B', 'C', 'D'];
      seatLetters.forEach((letter, index) => {
        const seatNumber = `${row}${letter}`;
        const isWindow = index === 0 || index === 3;
        const isBooked = Math.random() < 0.3; // 30% chance of being booked
        
        mockSeats.push({
          id: seatNumber,
          number: seatNumber,
          type: isWindow ? 'window' : index === 1 || index === 2 ? 'aisle' : 'middle',
          status: isBooked ? 'booked' : 'available',
          price: isWindow ? basePrice + 50 : basePrice,
        });
      });
    }
    
    setSeats(mockSeats);
  }, [price]);

  const toggleSeat = (seatId: string) => {
    const seat = seats.find(s => s.id === seatId);
    if (!seat || seat.status === 'booked') return;

    if (selectedSeats.includes(seatId)) {
      // Deselect seat
      setSelectedSeats(prev => prev.filter(id => id !== seatId));
      setSeats(prev => prev.map(s => 
        s.id === seatId ? { ...s, status: 'available' } : s
      ));
    } else {
      // Select seat
      if (selectedSeats.length >= maxSeats) {
        Alert.alert('Limit Reached', `You can select maximum ${maxSeats} seats`);
        return;
      }
      
      setSelectedSeats(prev => [...prev, seatId]);
      setSeats(prev => prev.map(s => 
        s.id === seatId ? { ...s, status: 'selected' } : s
      ));
    }
  };

  const getTotalPrice = () => {
    return selectedSeats.reduce((total, seatId) => {
      const seat = seats.find(s => s.id === seatId);
      return total + (seat?.price || 0);
    }, 0);
  };

  const proceedToPayment = () => {
    if (selectedSeats.length === 0) {
      Alert.alert('No Seats Selected', 'Please select at least one seat');
      return;
    }

    const selectedSeatDetails = seats.filter(s => selectedSeats.includes(s.id));
    
    router.push({
      pathname: '/payment',
      params: {
        busId,
        busName,
        from,
        to,
        date,
        departureTime,
        selectedSeats: JSON.stringify(selectedSeatDetails),
        totalPrice: getTotalPrice().toString(),
      },
    });
  };

  const renderSeat = (seat: Seat) => {
    const getSeatStyle = () => {
      switch (seat.status) {
        case 'booked':
          return [styles.seat, styles.bookedSeat];
        case 'selected':
          return [styles.seat, styles.selectedSeat];
        default:
          return [styles.seat, styles.availableSeat];
      }
    };

    return (
      <TouchableOpacity
        key={seat.id}
        style={getSeatStyle()}
        onPress={() => toggleSeat(seat.id)}
        disabled={seat.status === 'booked'}
      >
        <Text style={styles.seatNumber}>{seat.number}</Text>
        {seat.type === 'window' && (
          <Ionicons name="car-outline" size={8} color="#666" />
        )}
      </TouchableOpacity>
    );
  };

  const renderRow = (rowSeats: Seat[]) => {
    const leftSeats = rowSeats.slice(0, 2);
    const rightSeats = rowSeats.slice(2, 4);
    
    return (
      <View style={styles.seatRow}>
        <View style={styles.seatGroup}>
          {leftSeats.map(renderSeat)}
        </View>
        <View style={styles.aisle} />
        <View style={styles.seatGroup}>
          {rightSeats.map(renderSeat)}
        </View>
      </View>
    );
  };

  // Group seats by row
  const seatRows = [];
  for (let i = 0; i < seats.length; i += 4) {
    seatRows.push(seats.slice(i, i + 4));
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.busName}>{busName}</Text>
        <Text style={styles.routeInfo}>
          {from} → {to} | {date} | {departureTime}
        </Text>
      </View>

      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.legendSeat, styles.availableSeat]} />
          <Text style={styles.legendText}>Available</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendSeat, styles.selectedSeat]} />
          <Text style={styles.legendText}>Selected</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendSeat, styles.bookedSeat]} />
          <Text style={styles.legendText}>Booked</Text>
        </View>
      </View>

      <ScrollView style={styles.seatMap}>
        <View style={styles.busLayout}>
          <View style={styles.driverSection}>
            <Ionicons name="person" size={24} color="#666" />
            <Text style={styles.driverText}>Driver</Text>
          </View>
          
          {seatRows.map((rowSeats, index) => (
            <View key={index}>
              {renderRow(rowSeats)}
            </View>
          ))}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.priceInfo}>
          <Text style={styles.selectedCount}>
            {selectedSeats.length} seat{selectedSeats.length !== 1 ? 's' : ''} selected
          </Text>
          <Text style={styles.totalPrice}>₹{getTotalPrice()}</Text>
        </View>
        <TouchableOpacity
          style={[styles.proceedButton, selectedSeats.length === 0 && styles.disabledButton]}
          onPress={proceedToPayment}
          disabled={selectedSeats.length === 0}
        >
          <Text style={styles.proceedButtonText}>Proceed to Payment</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: 'white',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  busName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  routeInfo: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: 'white',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendSeat: {
    width: 20,
    height: 20,
    borderRadius: 4,
    marginRight: 8,
  },
  legendText: {
    fontSize: 12,
    color: '#666',
  },
  seatMap: {
    flex: 1,
    padding: 20,
  },
  busLayout: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  driverSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    marginBottom: 20,
  },
  driverText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#666',
  },
  seatRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  seatGroup: {
    flexDirection: 'row',
  },
  aisle: {
    width: 30,
  },
  seat: {
    width: 35,
    height: 35,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 2,
    borderWidth: 1,
  },
  availableSeat: {
    backgroundColor: '#e8f5e8',
    borderColor: '#4CAF50',
  },
  selectedSeat: {
    backgroundColor: '#4c669f',
    borderColor: '#4c669f',
  },
  bookedSeat: {
    backgroundColor: '#ffebee',
    borderColor: '#f44336',
  },
  seatNumber: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#333',
  },
  footer: {
    backgroundColor: 'white',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  priceInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  selectedCount: {
    fontSize: 14,
    color: '#666',
  },
  totalPrice: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4c669f',
  },
  proceedButton: {
    backgroundColor: '#FF6B6B',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  proceedButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});