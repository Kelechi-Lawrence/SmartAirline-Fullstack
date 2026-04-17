import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ApiService from '../../services/ApiServices';
import { useMessage } from '../common/MessageDisplay'

const AdminDetailsBooking = () => {
    const { id } = useParams();
    const navigate = useNavigate();
   const { ErrorDisplay,SuccessDisplay, showError, showSuccess } = useMessage();

    const [booking, setBooking] = useState(null);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [newStatus, setNewStatus] = useState("");

    
    useEffect(() => {
        fetchBookingDetails();
    }, [id]);

    const fetchBookingDetails = async () => {
        try {
            setLoading(true);
            const response = await ApiService.getBookingById(id);
            setBooking(response.data);
            
            setNewStatus(response.data.status); 
        } catch (error) {
            showError(error.response?.data?.message || "Error fetching booking details");
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async () => {
        try {
            setUpdating(true);
            
            const resp = await ApiService.updateBookingStatus(id, newStatus);
            showSuccess(`Booking status changed to ${newStatus}`);
            if(resp.status === 200){
 fetchBookingDetails();
            }
            
           
        } catch (error) {
            showError(error.response?.data?.message || "Failed to update status");
        } finally {
            setUpdating(false);
        }
    };

    if (loading) return <div className="admin-no-data">Loading Booking Status...</div>;
    if (!booking) return <div className="admin-no-data"><ErrorDisplay /></div>;

    return (
        <div className="admin-booking-container">
            <div className="admin-booking-card">
                <ErrorDisplay />
                <SuccessDisplay />

                <h2 className="admin-booking-title">Booking Status Management</h2>

                <div className="admin-booking-summary">
                    <div className="status-info">
                        <p><strong>Reference:</strong> {booking.bookingReference}</p>
                       
                        <p><strong>Current Status:</strong> 
                            <span className={`admin-booking-status ${booking.status?.toLowerCase()}`} style={{marginLeft: '10px'}}>
                                {booking.status}
                            </span>
                        </p>
                    </div>

                    <div className="admin-status-selector">
                        <label className="admin-label">Change Status:</label>
                        <select 
                            className="admin-status-select"
                            value={newStatus}
                            onChange={(e) => setNewStatus(e.target.value)}
                        >
                            <option value="PENDING">PENDING</option>
                            <option value="CONFIRMED">CONFIRMED</option>
                            <option value="CHECKED_IN">CHECKED_IN</option>
                            <option value="CANCELLED">CANCELLED</option>
                        </select>
                        <button 
                            className="admin-update-button" 
                            onClick={handleStatusUpdate}
                            disabled={updating || newStatus === booking.status}
                        >
                            {updating ? "Processing..." : "Update Status"}
                        </button>
                    </div>
                </div>

              
                <div className="admin-booking-details">
                    <div className="admin-passenger-section">
                        <h3>Passenger List</h3>
                        {booking.passengers?.map((p, index) => (
                            <div key={p.id || index} className="admin-passenger-card">
                                <div className="admin-passenger-header">
                                    <strong>{p.firstName} {p.lastName}</strong>
                                    <span className="iata-code">{p.seatNumber || 'No Seat'}</span>
                                </div>
                                <p><small>Passport: {p.passportNumber}</small></p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="admin-booking-actions">
                    <button className="admin-back-button" onClick={() => navigate(-1)}>
                        Back to Dashboard
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AdminDetailsBooking;