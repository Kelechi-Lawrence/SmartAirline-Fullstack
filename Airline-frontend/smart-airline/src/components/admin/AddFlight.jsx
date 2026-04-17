import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ApiService from "../../services/ApiServices";
import { useMessage } from "../common/MessageDisplay";
import "../../css/addFlight.css"; 

const AddFlight = () => {
    const { id } = useParams();
    const { ErrorDisplay, SuccessDisplay, showError, showSuccess } = useMessage();
    const navigate = useNavigate();
    
    const [airports, setAirports] = useState([]);
    const [pilots, setPilots] = useState([]);
    const [loading, setLoading] = useState(true);
    const isEditMode = !!id;

    const [flightData, setFlightData] = useState({
        flightNumber: '',
        departureTimeIataCode: '', 
        arrivalTimeIataCode: '',   
        departureTime: '',         
        arrivalTime: '',           
        basePrice: '',
        flightStatus: 'SCHEDULED', 
        assignedPilotId: ''        
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [airportRes, pilotRes] = await Promise.all([
                    ApiService.getAllAirports(),
                    ApiService.getPilots()
                ]);

                setAirports(airportRes.data || []);
                
                // Your Pilot formatting logic
                const formattedPilots = (pilotRes.data || []).map(pilot => ({
                    id: pilot.id,
                    name: pilot.name
                }));
                setPilots(formattedPilots);

                if (isEditMode) {
                    const flightRes = await ApiService.getFlightById(id);
                    const f = flightRes.data;
                    setFlightData({
                       flightNumber: flightData.flightNumber,
        departureTime: flightData.departureTime,
        arrivalTime: flightData.arrivalTime,
        basePrice: parseFloat(flightData.basePrice),
        flightStatus: flightData.flightStatus,
        
        // MAPPING: Local State Key -> Java DTO Key
        departureAirportIataCode: flightData.departureTimeIataCode, 
        arrivalAirportIataCode: flightData.arrivalTimeIataCode,
        
        // Match the "pilotID" field name from your Java DTO
        pilotID: flightData.assignedPilotId
                    });
                }
            } catch (error) {
                showError(error.response?.data?.message || "Failed to fetch data");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id, isEditMode, showError]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFlightData(prev => ({ ...prev, [name]: value }));
    };
const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
        flightNumber: flightData.flightNumber,
        departureTime: flightData.departureTime,
        arrivalTime: flightData.arrivalTime,
        basePrice: parseFloat(flightData.basePrice),
        flightStatus: flightData.flightStatus,
        
        // These MUST match your Java @NotBlank fields exactly
        departureAirportIataCode: flightData.departureTimeIataCode, 
        arrivalAirportIataCode: flightData.arrivalTimeIataCode,
        
        // Match the "pilotID" casing from your Java DTO
        pilotID: flightData.assignedPilotId 
    };

    console.log("Sending Payload:", payload); // Debug this to see the keys!

    try {
        if (isEditMode) {
            await ApiService.updateFlight({ id, ...payload });
            showSuccess("Flight updated successfully!");
        } else {
            // Send the PAYLOAD, not flightData
            await ApiService.createFlight(payload); 
            showSuccess("Flight created successfully!");
        }
        setTimeout(() => navigate("/admin"), 2000);
    } catch (error) {
        showError(error.response?.data?.message || "Failed to save Flight");
    }
};
    if (loading) return <div className="loading">Loading...</div>;

    return (
        <div className="flight-form-container">
            <div className="flight-form-card">
                <ErrorDisplay />
                <SuccessDisplay />
                <h2 className="flight-form-title">{isEditMode ? "Edit Flight" : "Add New Flight"}</h2>
                
                <form onSubmit={handleSubmit} className="flight-form">
                    <div className="form-group">
                        <label>Flight Number</label>
                        <input type="text" name="flightNumber" value={flightData.flightNumber} onChange={handleInputChange} required />
                    </div>

                    <div className="form-group">
                        <label>Departure Airport</label>
                        <select name="departureTimeIataCode" value={flightData.departureTimeIataCode} onChange={handleInputChange} required>
                            <option value="">Select Airport</option>
                            {airports.map(a => <option key={a.id} value={a.iataCode}>{a.name} ({a.iataCode})</option>)}
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Arrival Airport</label>
                        <select name="arrivalTimeIataCode" value={flightData.arrivalTimeIataCode} onChange={handleInputChange} required>
                            <option value="">Select Airport</option>
                            {airports.map(a => <option key={a.id} value={a.iataCode}>{a.name} ({a.iataCode})</option>)}
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Departure Time</label>
                        <input type="datetime-local" name="departureTime" value={flightData.departureTime} onChange={handleInputChange} required />
                    </div>

                    <div className="form-group">
                        <label>Arrival Time</label>
                        <input type="datetime-local" name="arrivalTime" value={flightData.arrivalTime} onChange={handleInputChange} required />
                    </div>

                    <div className="form-group">
                        <label>Base Price</label>
                        <input type="number" name="basePrice" value={flightData.basePrice} onChange={handleInputChange} required />
                    </div>

                    <div className="form-group">
                        <label>Assigned Pilot</label>
                        <select name="assignedPilotId" value={flightData.assignedPilotId} onChange={handleInputChange} required>
                            <option value="">Select Pilot</option>
                            {pilots.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                        </select>
                    </div>

                    <div className="form-actions">
                        <button type="button" className="cancel-button" onClick={() => navigate("/admin")}>Cancel</button>
                        <button type="submit" className="submit-button">
                            {isEditMode ? "Update Flight" : "Create Flight"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddFlight;