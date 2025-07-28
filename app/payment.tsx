import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

export default function PaymentScreen() {
  const {
    busId,
    busName,
    from,
    to,
    date,
    departureTime,
    selectedSeats,
    totalPrice,
  } = useLocalSearchParams();

  const [paymentMethod, setPaymentMethod] = useState('razorpay');
  const [isProcessing, setIsProcessing] = useState(false);

  const seats = JSON.parse(selectedSeats as string);
  const price = parseInt(totalPrice as string);

  const paymentMethods = [
    {
      id: 'razorpay',
      name: 'Razorpay',
      icon: 'card-outline',
      description: 'Credit/Debit Card, UPI, Net Banking',
    },
    {
      id: 'upi',
      name: 'UPI',
      icon: 'phone-portrait-outline',
      description: 'Google Pay, PhonePe, Paytm',
    },
    {
      id: 'wallet',
      name: 'Wallet',
      icon: 'wallet-outline',
      description: 'Paytm, Amazon Pay, Mobikwik',
    },
  ];

  const processPayment = async () => {
    setIsProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      
      // Generate ticket ID
      const ticketId = `GB${Date.now()}`;
      
      // Navigate to ticket screen
      router.replace({
        pathname: '/ticket',
        params: {
          ticketId,
          busName,
          from,
          to,
          date,
          departureTime,
          selectedSeats,
          totalPrice,
          paymentMethod,
        },
      });
    }, 3000);
  };

  const calculateBreakdown = () => {
    const baseAmount = price;
    const taxes = Math.round(baseAmount * 0.05); // 5% tax
    const serviceFee = 25;
    const total = baseAmount + taxes + serviceFee;
    
    return { baseAmount, taxes, serviceFee, total };
  };

  const { baseAmount, taxes, serviceFee, total } = calculateBreakdown();

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        {/* Trip Summary */}
        <View style={styles.summaryCard}>
          <Text style={styles.cardTitle}>Trip Summary</Text>
          <View style={styles.tripInfo}>
            <Text style={styles.busName}>{busName}</Text>
            <Text style={styles.routeText}>
              {from} → {to}
            </Text>
            <Text style={styles.dateTime}>
              {date} | Departure: {departureTime}
            </Text>
          </View>
          
          <View style={styles.seatInfo}>
            <Text style={styles.seatTitle}>Selected Seats:</Text>
            <View style={styles.seatNumbers}>
              {seats.map((seat: any, index: number) => (
                <View key={seat.id} style={styles.seatTag}>
                  <Text style={styles.seatTagText}>{seat.number}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* Price Breakdown */}
        <View style={styles.priceCard}>
          <Text style={styles.cardTitle}>Price Breakdown</Text>
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Base Fare ({seats.length} seat{seats.length > 1 ? 's' : ''})</Text>
            <Text style={styles.priceValue}>₹{baseAmount}</Text>
          </View>
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Taxes & Fees</Text>
            <Text style={styles.priceValue}>₹{taxes}</Text>
          </View>
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Service Fee</Text>
            <Text style={styles.priceValue}>₹{serviceFee}</Text>
          </View>
          <View style={[styles.priceRow, styles.totalRow]}>
            <Text style={styles.totalLabel}>Total Amount</Text>
            <Text style={styles.totalValue}>₹{total}</Text>
          </View>
        </View>

        {/* Payment Methods */}
        <View style={styles.paymentCard}>
          <Text style={styles.cardTitle}>Payment Method</Text>
          {paymentMethods.map((method) => (
            <TouchableOpacity
              key={method.id}
              style={[
                styles.paymentMethod,
                paymentMethod === method.id && styles.selectedPaymentMethod,
              ]}
              onPress={() => setPaymentMethod(method.id)}
            >
              <View style={styles.paymentMethodContent}>
                <Ionicons
                  name={method.icon as any}
                  size={24}
                  color={paymentMethod === method.id ? '#4c669f' : '#666'}
                />
                <View style={styles.paymentMethodText}>
                  <Text
                    style={[
                      styles.paymentMethodName,
                      paymentMethod === method.id && styles.selectedPaymentMethodName,
                    ]}
                  >
                    {method.name}
                  </Text>
                  <Text style={styles.paymentMethodDescription}>
                    {method.description}
                  </Text>
                </View>
              </View>
              {paymentMethod === method.id && (
                <Ionicons name="checkmark-circle" size={24} color="#4c669f" />
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* Terms */}
        <View style={styles.termsCard}>
          <Text style={styles.termsTitle}>Important Information</Text>
          <Text style={styles.termsText}>
            • Tickets are non-refundable after departure{'\n'}
            • Cancellation allowed up to 2 hours before departure{'\n'}
            • Please carry a valid ID proof during travel{'\n'}
            • Boarding point will be shared via SMS/Email
          </Text>
        </View>
      </View>

      {/* Payment Button */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.payButton, isProcessing && styles.disabledButton]}
          onPress={processPayment}
          disabled={isProcessing}
        >
          {isProcessing ? (
            <View style={styles.processingContainer}>
              <ActivityIndicator color="white" size="small" />
              <Text style={styles.processingText}>Processing Payment...</Text>
            </View>
          ) : (
            <Text style={styles.payButtonText}>Pay ₹{total}</Text>
          )}
        </TouchableOpacity>
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
  summaryCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  tripInfo: {
    marginBottom: 16,
  },
  busName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4c669f',
    marginBottom: 4,
  },
  routeText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 4,
  },
  dateTime: {
    fontSize: 14,
    color: '#666',
  },
  seatInfo: {
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 16,
  },
  seatTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  seatNumbers: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  seatTag: {
    backgroundColor: '#e8f4f8',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 4,
  },
  seatTagText: {
    fontSize: 12,
    color: '#4c669f',
    fontWeight: '600',
  },
  priceCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  priceLabel: {
    fontSize: 14,
    color: '#666',
  },
  priceValue: {
    fontSize: 14,
    color: '#333',
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: '#eee',
    marginTop: 8,
    paddingTop: 16,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4c669f',
  },
  paymentCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  paymentMethod: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 8,
    marginBottom: 12,
  },
  selectedPaymentMethod: {
    borderColor: '#4c669f',
    backgroundColor: '#f8f9ff',
  },
  paymentMethodContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  paymentMethodText: {
    marginLeft: 16,
    flex: 1,
  },
  paymentMethodName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  selectedPaymentMethodName: {
    color: '#4c669f',
  },
  paymentMethodDescription: {
    fontSize: 12,
    color: '#666',
  },
  termsCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    marginBottom: 100,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  termsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  termsText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  payButton: {
    backgroundColor: '#FF6B6B',
    paddingVertical: 16,
    borderRadius: 10,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  payButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  processingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  processingText: {
    color: 'white',
    fontSize: 16,
    marginLeft: 10,
  },
});