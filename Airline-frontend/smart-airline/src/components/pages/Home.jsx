import React, { useEffect, useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { useMessage } from '../common/MessageDisplay'
import ApiService from '../../services/ApiServices'
import { Link } from 'react-router-dom'
import "../../css/home.css"
const Home = () => {
  const [airports, setAirports] = useState([])
  const navigate = useNavigate()
      const { ErrorDisplay,SuccessDisplay, showError, showSuccess } = useMessage();
  const [loadingAirports, setLoadingAirports] = useState(true)
const [searchData, setSearchData] = useState({
  departureIataCode: "",
  arrivalIataCode: "", 
  departureDate: ""    
});
const popularDestination = [
  {
    id: 1,
    city: "Paris",
    country: "France",
    price: "$1200",
    image: "https://source.unsplash.com/400x300/?paris"
  },
  {
    id: 2,
    city: "Dubai",
    country: "UAE",
    price: "$900",
    image: "https://source.unsplash.com/400x300/?dubai"
  },
  {
    id: 3,
    city: "New York",
    country: "USA",
    price: "$1500",
    image: "https://source.unsplash.com/400x300/?newyork"
  },
  {
    id: 4,
    city: "Tokyo",
    country: "Japan",
    price: "$1300",
    image: "https://source.unsplash.com/400x300/?tokyo"
  }
];
useEffect(()=>{
  const fetchData = async ()=>{
    try{
      const response = await ApiService.getAllAirports()
      setAirports(response.data)
      console.log("Airports data:", airports)
    }catch(error){
      console.error(error)
    }finally{
      setLoadingAirports(false)//already displayed
    }
  }
  fetchData()
}, [])
// Search flights
const searchFlights = async(e) =>{
  e.preventDefault()
  if (!searchData.departureIataCode || !searchData.arrivalIataCode || !searchData.departureDate) {
    showError("Please fill in all flight details!");
    return;
  }
  // Formatting the Date for Spring Boot 
  const formattedDate = `${searchData.departureDate}T00:00:00`;
navigate(`/flights?departureIataCode=${searchData.departureIataCode}&arrivalIataCode=${searchData.arrivalIataCode}&departureTime=${formattedDate}`);

}
// SWAP AIRPORTS
const handleSwapAirports = () => {
  setSearchData({
    ...searchData,
    departureIataCode: searchData.arrivalIataCode,
    arrivalIataCode: searchData.departureIataCode
  });
};
//visaul  how i want to see it 
const formatAirport =(airport) =>{
  return `${airport.iataCode} (${airport.city}) -(${airport.name}) `
}
return (
    <div className="home-page">
      <div className="hero-section">
        <div className="hero-content">
          <h1>Fly smart with smartAirline</h1>
          <p>Find the best flight for your comfort</p>
        </div>
        <div className="search-box">
          <ErrorDisplay />
          <SuccessDisplay />
          <form onSubmit={searchFlights}>
            <div className="search-fields">
              {/* DEPARTURE AIRPORT */}
              <div className="form-group">
                <label>From</label>
                <select
                  value={searchData.departureIataCode}
                  onChange={(e) => setSearchData({ ...searchData, departureIataCode: e.target.value })}
                >
                  <option value="">Select Departure airport</option>
                  {airports.map(airport => (
                    <option key={`dep-${airport.iataCode}`} value={airport.iataCode}>
                      {formatAirport(airport)}
                    </option>
                  ))}
                </select>
              </div>

              {/* SWAP BUTTON */}
              <div className="swap-cities">
                <button type="button" onClick={handleSwapAirports} aria-label="Swap Departure and Arrival">
                  ⇄
                </button>
              </div>

              {/* ARRIVAL AIRPORT */}
              <div className="form-group">
                <label htmlFor="arrival">To</label>
                <select
                  id="arrival"
                  value={searchData.arrivalIataCode}
                  onChange={(e) => setSearchData({ ...searchData, arrivalIataCode: e.target.value })}
                >
                  <option value="">Select Arrival airport</option>
                  {airports
                    .filter(airport => airport.iataCode !== searchData.departureIataCode)
                    .map(airport => (
                      <option key={`arr-${airport.iataCode}`} value={airport.iataCode}>
                        {formatAirport(airport)}
                      </option>
                    ))
                  }
                </select>
              </div>

              {/* DATE INPUT */}
              <div className="form-group">
                <label>Departure Date</label>
                <input
                  type="date"
                  required
                  value={searchData.departureDate}
                  onChange={(e) => setSearchData({ ...searchData, departureDate: e.target.value })}
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>

              <button type="submit" className="search-button">Search Flights</button>
            </div>
          </form>
        </div>
      </div>

      {/* Popular Destinations Section */}
      <section className="popular-destinations">
        <h2>Popular Destinations</h2>
        <p>Explore the world's most sought-after locations with smartAirline</p>
        <div className="destinations-grid">
          {popularDestination.map((dest) => (
            <div key={dest.id} className="destination-card">
              <div
                className="destination-image"
                style={{ backgroundImage: `url(${dest.image})` }}
              >
                <div className="destination-overlay">
                  <h3>{dest.city}</h3>
                  <p>{dest.country}</p>
                </div>
              </div>
              <div className="destination-footer">
                <div className="price-info">
                  <span>From {dest.price}</span>
                </div>
                <Link to={`/book/${dest.id}`} className="book-button">
                  Book Now
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="features-section">
        <h2>Why Choose smartAirline</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">🛡️</div>
            <h3>Safe & Secure</h3>
            <p>Your safety is our priority.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">⭐</div>
            <h3>Premium Comfort</h3>
            <p>Relax in our ergonomically designed seats.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🌍</div>
            <h3>Global Reach</h3>
            <p>Connect to over 150 destinations worldwide.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🎧</div>
            <h3>24/7 Support</h3>
            <p>Our team is always here to help.</p>
          </div>
        </div>
      </section>

      {/* Special Offers */}
      <section className="offers-section">
        <h2>Exclusive Offers</h2>
        <div className="offer-card">
          <div className="offer-content">
            <h3>Student Discount Program</h3>
            <p>Travel for less with up to 15% off.</p>
            <button className="offer-button">Claim Offer</button>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="testimonials-section">
        <h2>What Our Travelers Say</h2>
        <div className="testimonials-grid">
          <div className="testimonial-card">
            <p className="testimonial-text">Smooth booking process!</p>
            <div className="testimonial-author">Sarah Ayomide</div>
          </div>
          <div className="testimonial-card">
            <p className="testimonial-text">Exceptional service on board.</p>
            <div className="testimonial-author">Michael Chukwu</div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
