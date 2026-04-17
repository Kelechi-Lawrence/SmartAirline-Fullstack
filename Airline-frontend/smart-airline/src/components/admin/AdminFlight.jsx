import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import ApiService from '../../services/ApiServices';
import { useMessage } from '../../components/common/MessageDisplay';

const AdminFlight = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { ErrorDisplay, SuccessDisplay, showError, showSuccess } = useMessage();

    const [flight, setFlight] = useState(null);
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [newStatus, setNewStatus] = useState("");

    useEffect(() => {
        fetchData();
    }, [id]);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [bookingRes, flightRes] = await Promise.all([
                ApiService.getAllBookings(),
                ApiService.getAllFlights()
            ]);

            const currentFlight = flightRes.data.find(f => f.id.toString() === id);
            const flightBookings = bookingRes.data.filter(b => b.flight?.id.toString() === id);

            setFlight(currentFlight);
            setBookings(flightBookings);
            setNewStatus(currentFlight?.status || "");
        } catch (error) {
            showError(error.response?.data?.message || "Failed to load flight details");
        } finally {
            setLoading(false);
        }
    };

   
    const formatFullDateTime = (dateTime) => {
        if (!dateTime) return "N/A";
        const date = new Date(dateTime);
        return date.toLocaleString('en-US', {
            month: 'short', day: '2-digit', year: 'numeric',
            hour: '2-digit', minute: '2-digit', hour12: true
        });
    };

    const handleStatusChange = async () => {
        try {
            setUpdating(true);
            await ApiService.updateFlight(id, { status: newStatus });
            
            showSuccess("Flight status updated successfully!");
            setFlight({ ...flight, status: newStatus }); 
        } catch (error) {
            showError(error.response?.data?.message || "Failed to update status");
        } finally {
            setUpdating(false);
        }
    };

    if (loading) return <div className="admin-flight-container">Loading flight data...</div>;
    if (!flight) return <div className="admin-flight-container">Flight not found.</div>;

    return (
        <div className="admin-flight-container">
            <ErrorDisplay />
            <SuccessDisplay />

            <div className="admin-flight-card">
                <h2 className="admin-flight-title">Flight Management: {flight.flightNumber}</h2>

                <div className="admin-flight-summary">
                    <div className="admin-flight-info">
                        <div className="admin-route-info">
                            <h3>{flight.origin} → {flight.destination}</h3>
                            <div className="admin-times">
                                {/* Applied Date Function */}
                                <span><strong>Departure:</strong> {formatFullDateTime(flight.departureTime)}</span>
                                <span><strong>Arrival:</strong> {formatFullDateTime(flight.arrivalTime)}</span>
                            </div>
                        </div>
                        <div className="admin-flight-actions">
                            <span className={`status-badge ${flight.status?.toLowerCase()}`}>
                                {flight.status}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Status Dropdown Logic */}
                <div className="admin-flight-management">
                    <h3>Update Flight Status</h3>
                    <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem', alignItems: 'center' }}>
                        <select 
                            value={newStatus} 
                            onChange={(e) => setNewStatus(e.target.value)}
                            style={{ padding: '0.5rem', borderRadius: '4px' }}
                        >
                            <option value="SCHEDULED">Scheduled</option>
                            <option value="ON_TIME">On Time</option>
                            <option value="DELAYED">Delayed</option>
                            <option value="BOARDING">Boarding</option>
                            <option value="DEPARTED">Departed</option>
                            <option value="CANCELLED">Cancelled</option>
                        </select>
                        
                        <button 
                            onClick={handleStatusChange} 
                            disabled={updating || newStatus === flight.status}
                            className="admin-edit-button"
                            style={{ margin: 0 }}
                        >
                            {updating ? "Updating..." : "Update Status"}
                        </button>
                    </div>
                </div>

                <div className="admin-flight-bookings">
                    <h3>Passenger Manifest ({bookings.length})</h3>
                    {bookings.length > 0 ? (
                        bookings.map((booking) => (
                            <div key={booking.id} className="admin-booking-item">
                                <div className="admin-flight-info">
                                    <div>
                                        <p><strong>Passenger:</strong> {booking.user?.name || 'Guest'}</p>
                                        <p><strong>Booking Ref:</strong> {booking.bookingReference}</p>
                                        <p><small>Booked on: {formatFullDateTime(booking.createdAt)}</small></p>
                                    </div>
                                    <Link to={`/admin/booking/${booking.id}`} className="admin-view-booking">
                                        View Details
                                    </Link>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="admin-no-bookings">No passengers registered for this flight.</p>
                    )}
                </div>
                
                <button onClick={() => navigate(-1)} className="back-button" style={{marginTop: '2rem'}}>
                    Back to Flights
                </button>
            </div>
        </div>
    );
};

export default AdminFlight;