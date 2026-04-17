import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom'; 
import ApiService from '../../services/ApiServices';
import { useMessage } from '../common/MessageDisplay';
import "../../css/admin.css";

const AdminDashboardPage = () => {
    const { ErrorDisplay, SuccessDisplay, showError } = useMessage();
    const navigate = useNavigate();
    
    const [bookings, setBookings] = useState([]);
    const [flights, setFlights] = useState([]);
    const [airports, setAirports] = useState([]); 
    const [pilots, setPilots] = useState([]); // New state for pilots
    const [activeTab, setActiveTab] = useState("bookings");
    const [loading, setLoading] = useState(true);

    const fetchAllData = async () => {
        try {
            setLoading(true);
            const [bookingRes, flightRes, airportRes, pilotRes] = await Promise.all([
                ApiService.getAllBookings(),
                ApiService.getAllFlights(),
                ApiService.getAllAirports(),
                ApiService.getPilots() 
            ]);

            setBookings(bookingRes.data || []);
            setFlights(flightRes.data || []);
            setAirports(airportRes.data || []);
            console.log("Pilot Response:", pilotRes.data);
            console.log("Full User Object:", pilotRes.data[0]);
            setPilots(pilotRes.data || []); // Setting pilots
        } catch (error) {
            showError(error.response?.data?.message || "Failed to retrieve admin data");
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

    useEffect(() => {
        fetchAllData();
    }, []);

    if (loading) return <div className="loading">Loading Dashboard Data...</div>;

   return (
        <div className="admin-dashboard-container">
            <div className="admin-dashboard-card">
                <ErrorDisplay />
                <SuccessDisplay />
                
                <h2 className="admin-dashboard-title">Admin Management Dashboard</h2>

                <div className="admin-dashboard-tabs">
                    <button 
                        className={activeTab === 'bookings' ? 'active' : ''} 
                        onClick={() => setActiveTab("bookings")}
                    >
                        Bookings
                    </button>
                    <button 
                        className={activeTab === 'flights' ? 'active' : ''} 
                        onClick={() => setActiveTab("flights")}
                    >
                        Flights
                    </button>
                    <button 
                        className={activeTab === 'airports' ? 'active' : ''} 
                        onClick={() => setActiveTab("airports")}
                    >
                        Airports
                    </button>
                    {/* NEW PILOT TAB BUTTON */}
                    <button 
                        className={activeTab === 'pilots' ? 'active' : ''} 
                        onClick={() => setActiveTab("pilots")}
                    >
                        Pilots
                    </button>
                </div>

                <div className="admin-content-area">
                    {/* BOOKINGS TAB CONTENT */}
                    {activeTab === "bookings" && (
                        <div className="admin-bookings-list">
                            {bookings.length > 0 ? (
                                bookings.map((b) => (
                                    <div key={b.id} className="admin-booking-card">
                                        <div className="admin-booking-header">
                                            <span>Ref: <strong>{b.bookingReference}</strong></span>
                                            <span className={`admin-booking-status ${b.status?.toLowerCase()}`}>
                                                {b.status}
                                            </span>
                                        </div>
                                        <div className="admin-booking-details">
                                            <div>
                                                <p><strong>Flight:</strong> {b.flight?.flightNumber}</p>
                                                <p><strong>Passengers:</strong> {b.passengers?.length}</p>
                                            </div>
                                            <div style={{ textAlign: 'right' }}>
                                                <Link to={`/admin/booking/${b.id}`} className="admin-view-details">
                                                    Manage
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="admin-no-data">No bookings found.</div>
                            )}
                        </div>
                    )}

                    {/* FLIGHTS TAB CONTENT */}
                    {activeTab === "flights" && (
                        <div className="admin-flights-list">
                            <div style={{ marginBottom: '1rem', textAlign: 'right' }}>
                                <button className="submit-button" onClick={() => navigate('/add-flight')}>
                                    + Add New Flight
                                </button>
                            </div>
                            {flights.length > 0 ? (
                                flights.map((f) => (
                                    <div key={f.id} className="admin-flight-card">
                                        <div className="admin-flight-header">
                                            <span>{f.flightNumber} | {f.origin} → {f.destination}</span>
                                            <span className={`admin-flight-status ${f.status?.toLowerCase()}`}>
                                                {f.status}
                                            </span>
                                        </div>
                                        <div className="admin-flight-details">
                                            <div>
                                                <p><strong>Departure:</strong> {formatFullDateTime(f.departureTime)}</p>
                                                <p><strong>Capacity:</strong> {f.availableSeats} / {f.totalSeats}</p>
                                            </div>
                                            <div style={{ textAlign: 'right' }}>
                                                <Link to={`/admin/flight/${f.id}`} className="admin-manage-flight">
                                                    Manage Flight
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="admin-no-data">No flights available.</div>
                            )}
                        </div>
                    )}

                    {/* AIRPORTS TAB CONTENT */}
                    {activeTab === "airports" && (
                        <div className="admin-airports-list">
                            <div style={{ marginBottom: '1rem', textAlign: 'right' }}>
                                <button className="submit-button" onClick={() => navigate('/add-airport/')}>
                                    + Add New Airport
                                </button>
                            </div>
                            {airports.length > 0 ? (
                                airports.map((a) => (
                                    <div key={a.id} className="admin-booking-card">
                                        <div className="admin-booking-header">
                                            <span><strong>{a.name} ({a.iataCode})</strong></span>
                                            <span className="admin-booking-status active">Operational</span>
                                        </div>
                                        <div className="admin-booking-details">
                                            <div>
                                                <p><strong>Location:</strong> {a.city}, {a.country}</p>
                                            </div>
                                            <div style={{ textAlign: 'right' }}>
                                                <Link to={`/edit-airport/${a.id}`} className="admin-view-details">
                                                    Edit Details
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="admin-no-data">No airports registered.</div>
                            )}
                        </div>
                    )}

                    {/* NEW PILOTS TAB CONTENT */}
                    {activeTab === "pilots" && (
                        <div className="admin-pilots-list">
                            <div style={{ marginBottom: '1rem', textAlign: 'right' }}>
                                <button className="submit-button" onClick={() => navigate('/add-pilot')}>
                                    + Register New Pilot
                                </button>
                            </div>
                            {pilots.length > 0 ? (
                                pilots.map((p) => (
                                    <div key={p.id} className="admin-booking-card">
                                        <div className="admin-booking-header">
                                            <span><strong>{p.name}</strong></span>
                                            <span className="admin-booking-status active">Certified</span>
                                        </div>
                                        <div className="admin-booking-details">
                                            <div>
                                                <p><strong>Email:</strong> {p.email}</p>
                                                <p><strong>Staff ID:</strong> {p.id.substring(0, 8)}</p>
                                            </div>
                                            <div style={{ textAlign: 'right' }}>
                                                <Link to={`/admin/pilot/${p.id}`} className="admin-view-details">
                                                    View Profile
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="admin-no-data">No pilots registered.</div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default AdminDashboardPage;