import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMessage } from '../../common/MessageDisplay'
import ApiService from '../../../services/ApiServices'
import { Link } from 'react-router-dom'
import "../../../css/profile.css"

const ProfilePage = () => {
    const [loading, setLoading] = useState(true)
    const [activeTab, setActiveTab] = useState("profile")
    const [bookings, setBookings] = useState([])
    const [user, setUser] = useState(null)
    const navigate = useNavigate()
    const { ErrorDisplay, showError } = useMessage();

    useEffect(() => {
        const loadData = async () => {
            try {
                // Fetching both in parallel for efficiency
                const [userRes, bookingsRes] = await Promise.all([
                    ApiService.getAccountDetails(),
                    ApiService.getAllBookings()
                ]);
                setUser(userRes.data);
                setBookings(bookingsRes.data || []);
            } catch (error) {
                showError(error.response?.data?.message || "Failed to fetch profile data");
            } finally {
                setLoading(false); //done loading
            }
        };
        loadData();
    }, []);

    const formatFullDateTime = (dateTime) => {
        if (!dateTime) return "N/A";
        const date = new Date(dateTime);
        return date.toLocaleString('en-US', {
            month: 'short', day: '2-digit', year: 'numeric',
            hour: '2-digit', minute: '2-digit', hour12: true
        });
    };

    if (loading) return <div className="loading">Loading...</div>
    if (!user) return <div className="no-flights">User not Found</div>

    return (
        <div className="profile-page">
            <div className="profile-container">
                <ErrorDisplay />
                
                <div className="profile-header">
                    <h2>My Account</h2>
                    <div className='welcome-message'>
                        Welcome back <strong>{user.name}</strong>
                    </div>
                </div>

                <div className='profile-tabs'>
                    <button 
                        className={activeTab === "profile" ? "active" : ""} 
                        onClick={() => setActiveTab("profile")}
                    >
                        Profile Info
                    </button>
                    <button 
                        className={activeTab === "booking" ? "active" : ""} 
                        onClick={() => setActiveTab("booking")}
                    >
                        My Bookings
                    </button>
                </div>

                <div className="profile-content">
                    {activeTab === "profile" ? (
                        /* PROFILE INFO SECTION */
                        <div className="profile-info">
                            <div className="info-card">
                                <h3>Personal Details</h3>
                                <div className="info-row">
                                    <span className="label">Full Name:</span>
                                    <span className="value">{user.name}</span>
                                </div>
                                <div className="info-row">
                                    <span className="label">Email Address:</span>
                                    <span className="value">{user.email}</span>
                                </div>
                                <div className="info-row">
                                    <span className="label">Phone Number:</span>
                                    <span className="value">{user.phoneNumber || 'Not provided'}</span>
                                </div>
                                <Link to="/update-profile" title="Feature coming soon" className="change-password">
                                    Update Profile
                                </Link>
                            </div>
                        </div>
                    ) : (
                        /* BOOKINGS LIST SECTION */
                        <div className="bookings-list">
                            {bookings.length > 0 ? (
                                bookings.map((booking) => (
                                    <div key={booking.id} className="booking-card">
                                        <div className="booking-header">
                                            <span className="booking-ref">Booking Ref: #{booking.confirmationCode || booking.id}</span>
                                            <span className={`booking-status ${booking.status?.toLowerCase() || 'confirmed'}`}>
                                                {booking.status || 'Confirmed'}
                                            </span>
                                        </div>
                                        <div className="booking-details">
                                            <div className="flight-info">
                                                <span className="flight-number">Flight: {booking.flight?.flightNumber || 'N/A'}</span>
                                                <span className="route">
                                                    {booking.flight?.departureIataCode} ➔ {booking.flight?.arrivalIataCode}
                                                </span>
                                                <span className="date">{formatFullDateTime(booking.flight?.departureTime)}</span>
                                            </div>
                                            <div className="passengers-info">
                                                <span className="passengers-count">
                                                    {booking.passengers?.length || 0} Passenger(s)
                                                </span>
                                                <span className="passengers-list">
                                                    {booking.passengers?.map(p => `${p.firstName} ${p.lastName}`).join(', ')}
                                                </span>
                                            </div>
                                            <div className="booking-actions">
                                                <Link to={`/bookings/${booking.id}`} className="view-details">
                                                    View Details
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="no-bookings">
                                    <p>You haven't made any bookings yet.</p>
                                    <Link to="/flights" className="book-flight">Book a Flight</Link>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default ProfilePage;