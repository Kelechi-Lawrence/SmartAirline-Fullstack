import React, { useEffect, useState } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { useMessage } from '../../common/MessageDisplay'
import ApiService from '../../../services/ApiServices'
import "../../../css/bookingDetails.css"



const BookingDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { ErrorDisplay, SuccessDisplay, showError } = useMessage();
    const [booking, setBooking] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBooking = async () => {
            
            if (!id || id === ":id") {
                showError("Invalid Booking ID in URL");
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                const resp = await ApiService.getBookingById(id);
                setBooking(resp.data);
            } catch (error) {
                showError(error.response?.data?.message || "Could not retrieve booking details.");
            } finally {
                setLoading(false);
            }
        };
        fetchBooking();
    }, [id]);
    const formatFullDateTime = (dateTime) => {
    if (!dateTime) return "N/A";
    const date = new Date(dateTime);
    return date.toLocaleString('en-US', {
        month: 'short', day: '2-digit', year: 'numeric',
        hour: '2-digit', minute: '2-digit', hour12: true
    });
};

    // Helper to calculate price per passenger
    const getPassengerPrice = (basePrice, type) => {
        const base = basePrice || 0; // Fallback if price is missing
        if (type === 'CHILD') return base * 0.75;
        if (type === 'INFANT') return base * 0.10;
        return base;
    };

    const calculateTotalPrice = () => {
        if (!booking || !booking.flight) return 0;
        // Check for basePrice (matching your Java CreateFlightRequest)
        const base = booking.flight.basePrice || 0;
        return booking.passengers?.reduce((total, p) => total + getPassengerPrice(base, p.type), 0) || 0;
    };

    if (loading) return <div className="booking-details-loading">Loading booking...</div>;
    if (!booking) return <div className="booking-details-container"><ErrorDisplay /></div>;

    return (
        <div className="booking-details-container">
            <div className="booking-details-card">
                <ErrorDisplay />
                <SuccessDisplay />

                <h2 className="booking-details-title">Booking Confirmation</h2>

                <div className="booking-details-summary">
                    <div className="booking-details-flight-info">
                        <div className="booking-details-flight-number">
                            Flight: {booking.flight?.flightNumber}
                        </div>
                        <div className="booking-details-route">
                            <span className="booking-details-departure">
                                {/* Support both nested and flat IATA codes */}
                                {booking.flight?.departureAirport?.iataCode || booking.flight?.departureAirportIataCode} 
                                {" → "} 
                                {booking.flight?.arrivalAirport?.iataCode || booking.flight?.arrivalAirportIataCode}
                            </span>
                            <span className="booking-details-date">
                                {formatFullDateTime(booking.flight?.departureTime)}
                            </span>
                        </div>
                    </div>
                    <div className="booking-details-price">
                        Total Paid: ${calculateTotalPrice().toFixed(2)}
                    </div>
                </div>

                <div className="booking-details-info-section">
                    <div className="booking-details-info-card">
                        <h3 className="booking-details-subtitle">Booking Information</h3>
                        <div className="booking-details-info-row">
                            <span className="booking-details-label">Reference:</span>
                            <span className="booking-details-value">{booking.bookingReference || "PENDING"}</span>
                        </div>
                        <div className="booking-details-info-row">
                            <span className="booking-details-label">Status:</span>
                            <span className={`booking-details-status-${booking.status?.toLowerCase()}`}>
                                {booking.status || "CONFIRMED"}
                            </span>
                        </div>
                    </div>

                    <div className="booking-details-flight-card">
                        <h3 className="booking-details-subtitle">Flight Details</h3>
                        <div className="booking-details-info-row">
                            <span className="booking-details-label">Arrival:</span>
                            <span className="booking-details-value">
                                {booking.flight?.arrivalAirport?.name || booking.flight?.arrivalAirportIataCode}
                            </span>
                        </div>
                    </div>
                </div>

                <h3 className="booking-details-subtitle">Passengers ({booking.passengers?.length || 0})</h3>
                {booking.passengers?.map((p, index) => (
                    <div key={p.id || index} className="booking-details-passenger-card">
                        <div className="booking-details-passenger-header">
                            <h4 className="booking-details-passenger-title">{p.firstName} {p.lastName}</h4>
                            <span className="booking-details-passenger-type">{p.type}</span>
                        </div>
                        <div className="booking-details-info-row">
                            <span className="booking-details-label">Seat:</span>
                            <span className="booking-details-value">{p.seatNumber || "Assigned at Check-in"}</span>
                        </div>
                    </div>
                ))}

                <div className="booking-details-total-section">
                    {booking.passengers?.map((p, index) => (
                        <div key={index} className="booking-details-total-row">
                            <span>Passenger {index + 1} ({p.type}):</span>
                            <span>${getPassengerPrice(booking.flight?.basePrice, p.type).toFixed(2)}</span>
                        </div>
                    ))}
                    <div className="booking-details-grand-total">
                        <span>Grand Total</span>
                        <span>${calculateTotalPrice().toFixed(2)}</span>
                    </div>
                </div>

                <div className="booking-details-actions">
                    <button onClick={() => navigate('/profile')} className="booking-details-back-button">
                        Return to Profile
                    </button>
                </div>
            </div>
        </div>
    );
};

export default BookingDetails;