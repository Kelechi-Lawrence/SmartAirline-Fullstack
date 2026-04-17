import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ApiService from "../../services/ApiServices";
import { useMessage } from "../common/MessageDisplay";

const AdminPilot = () => {
    const { ErrorDisplay, SuccessDisplay, showError, showSuccess } = useMessage();
    const navigate = useNavigate();

   const [pilotData, setPilotData] = useState({
    name: '',
    email: '',
    password: '',
    phoneNumber: '',
 
    roles: ['PILOT'], 
    authMethod: 'LOCAL' 
});

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setPilotData({ ...pilotData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            
            await ApiService.register(pilotData); 
            showSuccess("Pilot registered successfully!");
            
            // Redirect back to dashboard after a short delay
            setTimeout(() => {
                navigate("/admin");
            }, 2000);
        } catch (error) {
            showError(error.response?.data?.message || "Registration failed");
        }
    };

    return (
        <div className="flight-form-container">
            <div className="flight-form-card">
                <ErrorDisplay />
                <SuccessDisplay />
                <h2 className="flight-form-title">Register New Pilot</h2>

                <form onSubmit={handleSubmit} className="flight-form">
                    <div className="form-group">
                        <label>Full Name</label>
                        <input 
                            type="text" 
                            name="name" 
                            value={pilotData.name} 
                            onChange={handleInputChange} 
                            required 
                        />
                    </div>

                    <div className="form-group">
                        <label>Email Address</label>
                        <input 
                            type="email" 
                            name="email" 
                            value={pilotData.email} 
                            onChange={handleInputChange} 
                            required 
                        />
                    </div>

                    <div className="form-group">
                        <label>Phone Number</label>
                        <input 
                            type="text" 
                            name="phoneNumber" 
                            value={pilotData.phoneNumber} 
                            onChange={handleInputChange} 
                        />
                    </div>

                    <div className="form-group">
                        <label>Password</label>
                        <input 
                            type="password" 
                            name="password" 
                            value={pilotData.password} 
                            onChange={handleInputChange} 
                            required 
                        />
                    </div>

                    <div className="form-actions">
                        <button 
                            type="button" 
                            className="cancel-button" 
                            onClick={() => navigate("/admin")}
                        >
                            Cancel
                        </button>
                        <button type="submit" className="submit-button">
                            Register Pilot
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AdminPilot;