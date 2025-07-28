import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

export default function SearchScreen() {
  const [fromCity, setFromCity] = useState('');
  const [toCity, setToCity] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  const popularRoutes = [
    { from: 'Mumbai', to: 'Pune' },
    { from: 'Delhi', to: 'Agra' },
    { from: 'Bangalore', to: 'Chennai' },
    { from: 'Hyderabad', to: 'Vijayawada' },
  ];

  const swapCities = () => {
    const temp = fromCity;
    setFromCity(toCity);
    setToCity(temp);
  };

  const handleSearch = () => {
    if (!fromCity || !toCity) {
      Alert.alert('Error', 'Please select both source and destination cities');
      return;
    }
    if (fromCity === toCity) {
      Alert.alert('Error', 'Source and destination cannot be the same');
      return;
    }
    
    router.push({
      pathname: '/bus-list',
      params: {
        from: fromCity,
        to: toCity,
        date: selectedDate,
      },
    });
  };

  const selectRoute = (route: { from: string; to: string }) => {
    setFromCity(route.from);
    setToCity(route.to);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.searchCard}>
          <View style={styles.inputContainer}>
            <View style={styles.inputWrapper}>
              <Ionicons name="location-outline" size={20} color="#666" />
              <TextInput
                style={styles.input}
                placeholder="From City"
                value={fromCity}
                onChangeText={setFromCity}
              />
            </View>

            <TouchableOpacity style={styles.swapButton} onPress={swapCities}>
              <Ionicons name="swap-vertical" size={24} color="#4c669f" />
            </TouchableOpacity>

            <View style={styles.inputWrapper}>
              <Ionicons name="location" size={20} color="#666" />
              <TextInput
                style={styles.input}
                placeholder="To City"
                value={toCity}
                onChangeText={setToCity}
              />
            </View>
          </View>

          <View style={styles.dateContainer}>
            <Ionicons name="calendar-outline" size={20} color="#666" />
            <TextInput
              style={styles.dateInput}
              placeholder="Travel Date"
              value={selectedDate}
              onChangeText={setSelectedDate}
            />
          </View>

          <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
            <Text style={styles.searchButtonText}>Search Buses</Text>
            <Ionicons name="search" size={20} color="white" />
          </TouchableOpacity>
        </View>

        <View style={styles.popularSection}>
          <Text style={styles.sectionTitle}>Popular Routes</Text>
          {popularRoutes.map((route, index) => (
            <TouchableOpacity
              key={index}
              style={styles.routeItem}
              onPress={() => selectRoute(route)}
            >
              <View style={styles.routeInfo}>
                <Text style={styles.routeText}>
                  {route.from} → {route.to}
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#666" />
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    padding: 20,
  },
  searchCard: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 12,
    marginBottom: 15,
  },
  input: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
  },
  swapButton: {
    alignSelf: 'center',
    padding: 10,
    marginVertical: -10,
    zIndex: 1,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 12,
    marginBottom: 20,
  },
  dateInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
  },
  searchButton: {
    backgroundColor: '#4c669f',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    borderRadius: 10,
  },
  searchButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 10,
  },
  popularSection: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  routeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  routeInfo: {
    flex: 1,
  },
  routeText: {
    fontSize: 16,
    color: '#333',
  },
});