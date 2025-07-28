import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React from 'react';
import {
    ScrollView,
    Share,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import QRCode from 'react-native-qrcode-svg';

export default function TicketScreen() {
  const {
    ticketId,
    busName,
    from,
    to,
    date,
    departureTime,
    selectedSeats,
    totalPrice,
    paymentMethod,
  } = useLocalSearchParams();

  const seats = JSON.parse(selectedSeats as string);

  const shareTicket = async () => {
    try {
      await Share.share({
        message: `GoBus E-Ticket\nTicket ID: ${ticketId}\n${busName}\n${from} → ${to}\nDate: ${date}\nDeparture: ${departureTime}\nSeats: ${seats.map((s: any) => s.number).join(', ')}\nAmount: ₹${totalPrice}`,
        title: 'GoBus E-Ticket',
      });
    } catch (error) {
      console.error('Error sharing ticket:', error);
    }
  };

  const downloadTicket = () => {
    // In a real app, this would generate and download a PDF
    alert('Ticket downloaded to your device');
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        {/* Success Header */}
        <View style={styles.successHeader}>
          <View style={styles.successIcon}>
            <Ionicons name="checkmark-circle" size={60} color="#4CAF50" />
          </View>
          <Text style={styles.successTitle}>Booking Confirmed!</Text>
          <Text style={styles.successSubtitle}>
            Your e-ticket has been generated
          </Text>
        </View>

        {/* Ticket Card */}
        <View style={styles.ticketCard}>
          {/* QR Code Section */}
          <View style={styles.qrSection}>
            <QRCode
              value={JSON.stringify({
                ticketId,
                busName,
                from,
                to,
                date,
                departureTime,
                seats: seats.map((s: any) => s.number),
                totalPrice,
              })}
              size={120}
              backgroundColor="white"
              color="black"
            />
            <Text style={styles.qrText}>Show this QR code while boarding</Text>
          </View>

          {/* Ticket Details */}
          <View style={styles.ticketDetails}>
            <View style={styles.ticketHeader}>
              <Text style={styles.ticketId}>Ticket ID: {ticketId}</Text>
              <View style={styles.statusBadge}>
                <Text style={styles.statusText}>CONFIRMED</Text>
              </View>
            </View>

            <View style={styles.journeyInfo}>
              <View style={styles.locationContainer}>
                <View style={styles.locationInfo}>
                  <Text style={styles.locationCode}>{from.slice(0, 3).toUpperCase()}</Text>
                  <Text style={styles.locationName}>{from}</Text>
                </View>
                <View style={styles.journeyLine}>
                  <View style={styles.dot} />
                  <View style={styles.line} />
                  <Ionicons name="bus" size={20} color="#4c669f" />
                  <View style={styles.line} />
                  <View style={styles.dot} />
                </View>
                <View style={styles.locationInfo}>
                  <Text style={styles.locationCode}>{to.slice(0, 3).toUpperCase()}</Text>
                  <Text style={styles.locationName}>{to}</Text>
                </View>
              </View>
            </View>

            <View style={styles.detailsGrid}>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Bus</Text>
                <Text style={styles.detailValue}>{busName}</Text>
              </View>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Date</Text>
                <Text style={styles.detailValue}>{date}</Text>
              </View>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Departure</Text>
                <Text style={styles.detailValue}>{departureTime}</Text>
              </View>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Seats</Text>
                <Text style={styles.detailValue}>
                  {seats.map((s: any) => s.number).join(', ')}
                </Text>
              </View>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Passengers</Text>
                <Text style={styles.detailValue}>{seats.length}</Text>
              </View>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Amount Paid</Text>
                <Text style={styles.detailValue}>₹{totalPrice}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Important Instructions */}
        <View style={styles.instructionsCard}>
          <Text style={styles.instructionsTitle}>Important Instructions</Text>
          <View style={styles.instruction}>
            <Ionicons name="time-outline" size={16} color="#FF6B6B" />
            <Text style={styles.instructionText}>
              Report at boarding point 15 minutes before departure
            </Text>
          </View>
          <View style={styles.instruction}>
            <Ionicons name="card-outline" size={16} color="#FF6B6B" />
            <Text style={styles.instructionText}>
              Carry a valid photo ID proof during travel
            </Text>
          </View>
          <View style={styles.instruction}>
            <Ionicons name="phone-portrait-outline" size={16} color="#FF6B6B" />
            <Text style={styles.instructionText}>
              Keep this e-ticket handy on your mobile device
            </Text>
          </View>
          <View style={styles.instruction}>
            <Ionicons name="close-circle-outline" size={16} color="#FF6B6B" />
            <Text style={styles.instructionText}>
              Cancellation allowed up to 2 hours before departure
            </Text>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.actionButton} onPress={shareTicket}>
            <Ionicons name="share-outline" size={20} color="#4c669f" />
            <Text style={styles.actionButtonText}>Share</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} onPress={downloadTicket}>
            <Ionicons name="download-outline" size={20} color="#4c669f" />
            <Text style={styles.actionButtonText}>Download</Text>
          </TouchableOpacity>
        </View>

        {/* Navigation Buttons */}
        <View style={styles.navigationButtons}>
          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => router.push('/history')}
          >
            <Text style={styles.secondaryButtonText}>View All Tickets</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => router.push('/')}
          >
            <Text style={styles.primaryButtonText}>Book Another Trip</Text>
          </TouchableOpacity>
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
  successHeader: {
    alignItems: 'center',
    marginBottom: 30,
  },
  successIcon: {
    marginBottom: 16,
  },
  successTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  successSubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  ticketCard: {
    backgroundColor: 'white',
    borderRadius: 15,
    marginBottom: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
  },
  qrSection: {
    alignItems: 'center',
    paddingVertical: 30,
    borderBottomWidth: 2,
    borderBottomColor: '#f0f0f0',
    borderStyle: 'dashed',
  },
  qrText: {
    fontSize: 12,
    color: '#666',
    marginTop: 12,
    textAlign: 'center',
  },
  ticketDetails: {
    padding: 20,
  },
  ticketHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  ticketId: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#4c669f',
  },
  statusBadge: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  journeyInfo: {
    marginBottom: 20,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  locationInfo: {
    alignItems: 'center',
    flex: 1,
  },
  locationCode: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4c669f',
    marginBottom: 4,
  },
  locationName: {
    fontSize: 12,
    color: '#666',
  },
  journeyLine: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 2,
    justifyContent: 'center',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#4c669f',
  },
  line: {
    height: 2,
    backgroundColor: '#4c669f',
    flex: 1,
    marginHorizontal: 8,
  },
  detailsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  detailItem: {
    width: '50%',
    marginBottom: 16,
  },
  detailLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  instructionsCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  instructionsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  instruction: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  instructionText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 12,
    flex: 1,
    lineHeight: 20,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  actionButtonText: {
    color: '#4c669f',
    marginLeft: 8,
    fontWeight: '600',
  },
  navigationButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  secondaryButton: {
    flex: 1,
    backgroundColor: 'white',
    paddingVertical: 12,
    borderRadius: 8,
    marginRight: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#4c669f',
  },
  secondaryButtonText: {
    color: '#4c669f',
    fontWeight: '600',
  },
  primaryButton: {
    flex: 1,
    backgroundColor: '#4c669f',
    paddingVertical: 12,
    borderRadius: 8,
    marginLeft: 10,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: 'white',
    fontWeight: '600',
  },
});