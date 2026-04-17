import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router'
import { useMessage } from '../common/MessageDisplay'
import ApiService from '../../services/ApiServices'
import '../../css/findFlight.css'

const SearchFlightPage = () => {
    const [flights, setFlights] = useState([])
    const [airports, setAirports] = useState([])
    const { ErrorDisplay, SuccessDisplay, showError } = useMessage();
    const [loading, setLoading] = useState(true)
    const navigate = useNavigate()
    const location = useLocation()
    
    const [params, setParams] = useState({
        departureIataCode: "",
        arrivalIataCode: "",
        departureDate: ""
    })

    // FETCH AIRPORTS ON MOUNT
    useEffect(() => {
        const fetchAirports = async () => {
            try {
                const response = await ApiService.getAllAirports()
                setAirports(response.data || [])
            } catch (error) {
                console.error("Failed to fetch airports:", error)
            } finally {
                setLoading(false)
            }
        }
        fetchAirports()
    }, [])

    // SYNC STATE WITH URL QUERY PARAMS
    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const criteria = {
            departureIataCode: queryParams.get('departureIataCode') || "",
            arrivalIataCode: queryParams.get('arrivalIataCode') || "",
            departureDate: queryParams.get('departureDate') || ""
        };
        
        setParams(criteria);

        // Only fetch if we have the minimum required data
        if (criteria.departureIataCode && criteria.arrivalIataCode) {
            fetchFlights(criteria);
        } else {
            setLoading(false);
        }
    }, [location]);

    const fetchFlights = async (searchCriteria) => {
        try {
            setLoading(true);
            const response = await ApiService.searchFlights(searchCriteria);
            // Ensure we extract the list from the "data" field of your API response
            setFlights(response.data || []);
        } catch (error) {
            console.error("Error fetching flights:", error);
            showError("Could not retrieve flights.");
        } finally {
            setLoading(false);
        }
    }

    const handleSearch = (e) => {
        e.preventDefault()
        if (!params.departureIataCode || !params.arrivalIataCode) {
            showError("Departure and arrival airports are required")
            return;
        }

        const query = new URLSearchParams()
        query.append("departureIataCode", params.departureIataCode)
        query.append("arrivalIataCode", params.arrivalIataCode);
        if (params.departureDate) {
            query.append("departureDate", params.departureDate);
        }
        
        navigate(`/flights?${query.toString()}`);
    }

    const handleSwapAirports = () => {
        setParams(prev => ({
            ...prev,
            departureIataCode: prev.arrivalIataCode,
            arrivalIataCode: prev.departureIataCode
        }));
    };

    const formatAirport = (airport) => {
        return `${airport.iataCode} (${airport.city}) - ${airport.name}`
    }

    const formatTime = (dateTimeString) => {
        if (!dateTimeString) return "";
        const date = new Date(dateTimeString);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
    };

    const formatDate = (dateTimeString) => {
        if (!dateTimeString) return "";
        const date = new Date(dateTimeString);
        return date.toLocaleDateString([], { weekday: 'short', month: 'short', day: '2-digit' });
    };

    const calculateDuration = (departure, arrival) => {
        if (!departure || !arrival) return "";
        const diffMs = new Date(arrival) - new Date(departure);
        const totalMinutes = Math.floor(diffMs / 60000);
        const hours = Math.floor(totalMinutes / 60);
        const minutes = totalMinutes % 60;
        return `${hours}h ${minutes}m`;
    };

    return (
        <div className="find-flights-page">
            <div className="container">
                <ErrorDisplay />
                <SuccessDisplay />

                <section className="search-section">
                    <h2>Find Your Next Adventure</h2>
                    <form className="search-form" onSubmit={handleSearch}>
                        <div className="search-row">
                            <div className="form-group">
                                <label>From</label>
                                <select 
                                    value={params.departureIataCode}
                                    onChange={(e) => setParams({...params, departureIataCode: e.target.value})}
                                >
                                    <option value="">Select Departure</option>
                                    {airports.map(air => (
                                        <option key={air.id} value={air.iataCode}>{formatAirport(air)}</option>
                                    ))}
                                </select>
                            </div>

                            <button type="button" className="ff-button" onClick={handleSwapAirports} style={{marginTop: 'auto'}}>
                                ⇄
                            </button>

                            <div className="form-group">
                                <label>To</label>
                                <select 
                                    value={params.arrivalIataCode}
                                    onChange={(e) => setParams({...params, arrivalIataCode: e.target.value})}
                                >
                                    <option value="">Select Destination</option>
                                    {airports.map(air => (
                                        <option key={air.id} value={air.iataCode}>{formatAirport(air)}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-group">
                                <label>Date</label>
                                <input 
                                    type="date" 
                                    value={params.departureDate}
                                    onChange={(e) => setParams({...params, departureDate: e.target.value})}
                                />
                            </div>

                            <button type="submit" className="ff-button">Search</button>
                        </div>
                    </form>
                </section>

                <section className="results-section">
                    {loading ? (
                        <div className="loading">Searching...</div>
                    ) : flights.length > 0 ? (
                        <div className="flights-list">
                            {flights.map((flight) => (
                                <div key={flight.id} className="flight-card">
                                    <div className="flight-header">
                                        <span className="flight-number">Flight #{flight.flightNumber}</span>
                                        <span className={`flight-status ${(flight.flightStatus || 'scheduled').toLowerCase()}`}>
                                            {flight.flightStatus || 'Scheduled'}
                                        </span>
                                    </div>

                                    <div className="flight-details">
                                        <div className="departure">
                                            <div className="time">{formatTime(flight.departureTime)}</div>
                                            <div className="date">{formatDate(flight.departureTime)}</div>
                                            <div className="airport">{flight.departureAirportIataCode}</div>
                                        </div>

                                        <div className="duration">
                                            <div className="line"></div>
                                            <div className="duration-text">
                                                {calculateDuration(flight.departureTime, flight.arrivalTime)}
                                            </div>
                                            <div className="line"></div>
                                        </div>

                                        <div className="arrival">
                                            <div className="time">{formatTime(flight.arrivalTime)}</div>
                                            <div className="date">{formatDate(flight.arrivalTime)}</div>
                                            <div className="airport">{flight.arrivalAirportIataCode}</div>
                                        </div>

                                        <div className="price">
                                            ${flight.basePrice?.toLocaleString()}
                                        </div>
                                    </div>

                                    <div className="flight-actions">
                                        <button className="book-button" onClick={() => navigate(`/book-flight/${flight.id}`)}>
                                            Book Now
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="no-flights">
                            <h3>No Flights Found</h3>
                            <p>Try adjusting your search criteria.</p>
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
}

export default SearchFlightPage;