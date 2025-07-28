import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    FlatList,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

interface Bus {
  id: string;
  name: string;
  type: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  price: number;
  availableSeats: number;
  rating: number;
  amenities: string[];
}

export default function BusListScreen() {
  const { from, to, date } = useLocalSearchParams();
  const [buses, setBuses] = useState<Bus[]>([]);
  const [sortBy, setSortBy] = useState('price');
  const [filterBy, setFilterBy] = useState('all');

  // Mock data - replace with API call
  useEffect(() => {
    const mockBuses: Bus[] = [
      {
        id: '1',
        name: 'Volvo Multi-Axle',
        type: 'AC Sleeper',
        departureTime: '22:30',
        arrivalTime: '06:00',
        duration: '7h 30m',
        price: 1200,
        availableSeats: 15,
        rating: 4.5,
        amenities: ['AC', 'WiFi', 'Charging Point', 'Blanket'],
      },
      {
        id: '2',
        name: 'Scania Multi-Axle',
        type: 'AC Semi-Sleeper',
        departureTime: '23:00',
        arrivalTime: '06:30',
        duration: '7h 30m',
        price: 900,
        availableSeats: 8,
        rating: 4.2,
        amenities: ['AC', 'Charging Point', 'Water Bottle'],
      },
      {
        id: '3',
        name: 'Mercedes Multi-Axle',
        type: 'AC Seater',
        departureTime: '08:00',
        arrivalTime: '15:30',
        duration: '7h 30m',
        price: 650,
        availableSeats: 25,
        rating: 4.0,
        amenities: ['AC', 'Music System'],
      },
    ];
    setBuses(mockBuses);
  }, []);

  const sortedBuses = [...buses].sort((a, b) => {
    switch (sortBy) {
      case 'price':
        return a.price - b.price;
      case 'departure':
        return a.departureTime.localeCompare(b.departureTime);
      case 'rating':
        return b.rating - a.rating;
      default:
        return 0;
    }
  });

  const selectBus = (bus: Bus) => {
    router.push({
      pathname: '/seat-selection',
      params: {
        busId: bus.id,
        busName: bus.name,
        price: bus.price.toString(),
        from,
        to,
        date,
        departureTime: bus.departureTime,
      },
    });
  };

  const renderBusItem = ({ item }: { item: Bus }) => (
    <TouchableOpacity style={styles.busCard} onPress={() => selectBus(item)}>
      <View style={styles.busHeader}>
        <View>
          <Text style={styles.busName}>{item.name}</Text>
          <Text style={styles.busType}>{item.type}</Text>
        </View>
        <View style={styles.ratingContainer}>
          <Ionicons name="star" size={16} color="#FFD700" />
          <Text style={styles.rating}>{item.rating}</Text>
        </View>
      </View>

      <View style={styles.timeContainer}>
        <View style={styles.timeInfo}>
          <Text style={styles.time}>{item.departureTime}</Text>
          <Text style={styles.city}>{from}</Text>
        </View>
        <View style={styles.durationContainer}>
          <Text style={styles.duration}>{item.duration}</Text>
          <View style={styles.line} />
        </View>
        <View style={styles.timeInfo}>
          <Text style={styles.time}>{item.arrivalTime}</Text>
          <Text style={styles.city}>{to}</Text>
        </View>
      </View>

      <View style={styles.amenitiesContainer}>
        {item.amenities.slice(0, 3).map((amenity, index) => (
          <View key={index} style={styles.amenityTag}>
            <Text style={styles.amenityText}>{amenity}</Text>
          </View>
        ))}
        {item.amenities.length > 3 && (
          <Text style={styles.moreAmenities}>+{item.amenities.length - 3} more</Text>
        )}
      </View>

      <View style={styles.bottomRow}>
        <View>
          <Text style={styles.price}>₹{item.price}</Text>
          <Text style={styles.seatsLeft}>{item.availableSeats} seats left</Text>
        </View>
        <TouchableOpacity style={styles.selectButton}>
          <Text style={styles.selectButtonText}>Select Seats</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.routeText}>
          {from} → {to}
        </Text>
        <Text style={styles.dateText}>{date}</Text>
      </View>

      <View style={styles.filterContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <TouchableOpacity
            style={[styles.filterButton, sortBy === 'price' && styles.activeFilter]}
            onPress={() => setSortBy('price')}
          >
            <Text style={[styles.filterText, sortBy === 'price' && styles.activeFilterText]}>
              Price
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterButton, sortBy === 'departure' && styles.activeFilter]}
            onPress={() => setSortBy('departure')}
          >
            <Text style={[styles.filterText, sortBy === 'departure' && styles.activeFilterText]}>
              Departure
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterButton, sortBy === 'rating' && styles.activeFilter]}
            onPress={() => setSortBy('rating')}
          >
            <Text style={[styles.filterText, sortBy === 'rating' && styles.activeFilterText]}>
              Rating
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      <FlatList
        data={sortedBuses}
        renderItem={renderBusItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
      />
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
  routeText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  dateText: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  filterContainer: {
    backgroundColor: 'white',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    marginRight: 10,
  },
  activeFilter: {
    backgroundColor: '#4c669f',
  },
  filterText: {
    color: '#666',
    fontSize: 14,
  },
  activeFilterText: {
    color: 'white',
  },
  listContainer: {
    padding: 20,
  },
  busCard: {
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
  busHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  busName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  busType: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    marginLeft: 4,
    fontSize: 14,
    color: '#333',
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  timeInfo: {
    alignItems: 'center',
  },
  time: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  city: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  durationContainer: {
    alignItems: 'center',
    flex: 1,
  },
  duration: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  line: {
    height: 1,
    backgroundColor: '#ddd',
    width: '80%',
  },
  amenitiesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
  },
  amenityTag: {
    backgroundColor: '#e8f4f8',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
    marginBottom: 4,
  },
  amenityText: {
    fontSize: 10,
    color: '#4c669f',
  },
  moreAmenities: {
    fontSize: 10,
    color: '#666',
    alignSelf: 'center',
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  price: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4c669f',
  },
  seatsLeft: {
    fontSize: 12,
    color: '#666',
  },
  selectButton: {
    backgroundColor: '#FF6B6B',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  selectButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});