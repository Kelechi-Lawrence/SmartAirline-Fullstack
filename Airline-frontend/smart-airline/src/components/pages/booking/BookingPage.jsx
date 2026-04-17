import React, { useState } from 'react'
import { Navigate, useLocation, useNavigate, useParams } from 'react-router-dom'
import { useMessage } from '../../common/MessageDisplay'
import ApiService from '../../../services/ApiServices'
import { Link } from 'react-router-dom'
import "../../../css/booking.css"
const BookingPage = () => {
    const { id: flightId } = useParams();
    const navigate = useNavigate();
    const { ErrorDisplay, SuccessDisplay, showError, showSuccess } = useMessage();

    const [loading, setLoading] = useState(true);
    const [flight, setFlight] = useState(null);
    const [passengers, setPassengers] = useState([
        {
            firstName: '',
            lastName: '',
            passportNumber: '',
            type: 'ADULT',
            seatNumber: '',
            specialRequest: ''
        }
    ]);

    // Fetch flight details on load
    React.useEffect(() => {
        const fetchFlight = async () => {
            try {
                const response = await ApiService.getFlightById(flightId);
                setFlight(response.data);
            } catch (error) {
                showError("Could not retrieve flight details.");
            } finally {
                setLoading(false);
            }
        };
        fetchFlight();
    }, [flightId]);

    
    const handlePassengerChange = (index, e) => {
        const { name, value } = e.target;
        const newPassengers = [...passengers];
        newPassengers[index][name] = value;
        setPassengers(newPassengers);
    };

    const addPassenger = () => {
        setPassengers([...passengers,
           { firstName: '', 
            lastName: '',
             passportNumber: '',
              type: 'ADULT',
               seatNumber: '', 
               specialRequest: '' }]);
    };

    const removePassenger = (index) => {
        if (passengers.length > 1) {
            setPassengers(passengers.filter((_, i) => i !== index));
        }
    };
    const calculateFlightPrice = ()=>{
      if(!flight)
        return 0
    
      const basePrice = flight.basePrice;
    
    return passengers.reduce((total, p) => {
        let multiplier = 1.0; // Default for ADULT
        
        if (p.type === 'CHILD') multiplier = 0.7;  // 30% discount
        if (p.type === 'INFANT') multiplier = 0.1; // 90% discount
        
        return total + (basePrice * multiplier);
    }, 0);
    }
    // submit passengers
    const handleSubmit = async (e) => {
    e.preventDefault(); 

    // passengers have at least a first and last name entered
    const isFormValid = passengers.every(p => p.firstName.trim() !== '' && p.lastName.trim() !== '');
    
    if (!isFormValid) {
        showError("Please provide a name for all passengers before proceeding.");
        return;
    }

    try {
        setLoading(true);
        const bookingData = {
            flightId: flightId, 
            passengers: passengers 
        };

        
        const response = await ApiService.createBooking(bookingData);

        if (response.statusCode === 200) {
            showSuccess("Flight booked successfully! Redirecting...");
          
            setTimeout(() => {
                navigate('/profile');
            }, 2000);
        }
    } catch (error) {
        showError(error.response?.data?.message || "try again, you werent able to book.");
    } finally {
        setLoading(false);//done loading 
    }
};


if (loading && !flight) return <div className="profile-page">Loading flight details...</div>;
return (
    <div className="profile-page">
        <div className="profile-container">
            <ErrorDisplay />
            <SuccessDisplay />

            <div className="profile-header">
                <h2 className="booking-title">Flight Booking</h2>
            </div>

            {/* Flight Summary Card (Boarding Pass Style) */}
                        {flight && (
                <div className="booking-card">
                    <div className="booking-header">
                        <div className="flight-meta">
                            <strong>{flight.flightNumber}</strong>
                            <span className="booking-status confirmed">AVAILABLE</span>
                        </div>
                    </div>
                    <div className="booking-details">
                        <div className="route-container">
                            <p className="label">Route</p>
                            <p className="value bold-text">
                                {flight.departureAirport.iataCode} ✈️ {flight.arrivalAirport.iataCode}
                            </p>
                        </div>
                        <div className="time-container">
                            <p className="label">Departure</p>
                            <p className="value">{new Date(flight.departureTime).toLocaleString()}</p>
                        </div>
                        <div className="price-container text-right">
                            <p className="label">Base Price</p>
                            <p className="value price-text">${flight.basePrice}</p>
                        </div>
                    </div>
                </div>
            )}

            <form className="booking-form" onSubmit={handleSubmit}>
                {/* Passenger List */}
                <div className="passengers-list">
                    {passengers.map((p, index) => (
                        <div key={index} className="passenger-card">
                            <div className="card-header-flex">
                                <h4>Passenger {index + 1}</h4>
                                {passengers.length > 1 && (
                                    <button 
                                        type="button" 
                                        onClick={() => removePassenger(index)} 
                                        className="remove-btn"
                                    >
                                        Remove
                                    </button>
                                )}
                            </div>
                            <div className="passenger-form">
                                <div className="input-group">
                                    <label className="label">First Name</label>
                                    <input 
                                        type="text" 
                                        name="firstName" 
                                        placeholder="First Name" 
                                        value={p.firstName} 
                                        onChange={(e) => handlePassengerChange(index, e)} 
                                        className="update-profile-input" 
                                    />
                                </div>
                                <div className="input-group">
                                    <label className="label">Last Name</label>
                                    <input 
                                        type="text" 
                                        name="lastName" 
                                        placeholder="Last Name" 
                                        value={p.lastName} 
                                        onChange={(e) => handlePassengerChange(index, e)} 
                                        className="update-profile-input" 
                                    />
                                </div>
                                <div className="input-group">
                                    <label className="label">Type</label>
                                    <select 
                                        name="type" 
                                        value={p.type} 
                                        onChange={(e) => handlePassengerChange(index, e)} 
                                        className="update-profile-input"
                                    >
                                        <option value="ADULT">Adult</option>
                                        <option value="CHILD">Child</option>
                                        <option value="INFANT">Infant</option>
                                    </select>
                                </div>
                                <div className="input-group">
                                    <label className="label">Passport</label>
                                    <input 
                                        type="text" 
                                        name="passportNumber" 
                                        placeholder="Passport Number" 
                                        value={p.passportNumber} 
                                        onChange={(e) => handlePassengerChange(index, e)} 
                                        className="update-profile-input" 
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                    <button type="button" onClick={addPassenger} className="add-passenger-btn">
                        + Add Another Passenger
                    </button>
                </div>

                {/* Summary Sticky Section */}
                <div className="summary-section">
                    <div className="summary-card">
                        <h3>Summary</h3>
                        <div className="summary-row">
                            <span>Total Passengers:</span>
                            <span>{passengers.length}</span>
                        </div>
                        <div className="summary-row total">
                            <span>Total Price:</span>
                            <span>${calculateFlightPrice().toFixed(2)}</span>
                        </div>
                        <button 
                            type="submit" 
                            disabled={loading} 
                            className="submit-booking-btn"
                        >
                            {loading ? "Processing..." : "Confirm Booking"}
                        </button>
                        <Link to="/" className="cancel-link">Cancel</Link>
                    </div>
                </div>
            </form>
        </div>
    </div>
);
  }
export default BookingPage