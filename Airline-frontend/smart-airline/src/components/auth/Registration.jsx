import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMessage } from '../common/MessageDisplay'
import ApiService from '../../services/ApiServices'
import { Link } from 'react-router-dom'
import "../../css/auth.css"
const Registration = () => {

 const { ErrorDisplay,SuccessDisplay, showError, showSuccess } = useMessage();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phoneNumber: '',
        password: '',
        confirmPassword: ''
    });

    const handleChange = (e) =>{
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if(!formData.name || !formData.email || !formData.phoneNumber || !formData.password || !formData.confirmPassword){
            showError("All fields required");
            return;
        }

        if(formData.password !== formData.confirmPassword){
            showError("Password doesn't match");
            return;
        }

        const registrationData = {
            name: formData.name,
            email: formData.email,
            phoneNumber: formData.phoneNumber,
            password: formData.password,
            
        };

        try{
            const response = await ApiService.register(registrationData);

            if (response.statusCode === 200){
                navigate("/login");
                showSucess("User sucessfuly registered")
            } else{
                showError(response.message);
            }

        } catch(error){
            showError(error.response?.data?.message || error.message);
        }
    };

    return (
     <div className="auth-page">
        <div className="auth-card">
            <ErrorDisplay/>
            <div className="auth-header">
                <h2>SmartAirline</h2>
                <p>Fly with steeze</p>
            </div>
            <form className="auth-form" onSubmit={handleSubmit}>
    
    <div className="form-group">
        <label>Full Name</label>
        <input
            type="text"
            value={formData.name}
            id="name"
            name="name"
            onChange={handleChange}
            required
            placeholder="Enter your fullname..."
        />
    </div>

    <div className="form-group">
        <label>Email</label>
        <input
            type="email"
            value={formData.email}
            id="email"
            name="email"
            onChange={handleChange}
            required
            placeholder="Enter your email..."
        />
    </div>

    <div className="form-group">
        <label>Phone Number</label>
        <input
            type="text"
            value={formData.phoneNumber}
            id="phoneNumber"
            name="phoneNumber"
            onChange={handleChange}
            required
            placeholder="Enter your phone number..."
        />
    </div>

    <div className="form-group">
        <label>Password</label>
        <input
            type="password"
            value={formData.password}
            id="password"
            name="password"
            onChange={handleChange}
            required
            placeholder="Enter your password..."
        />
    </div>

    <div className="form-group">
        <label>Confirm Password</label>
        <input
            type="password"
            value={formData.confirmPassword}
            id="confirmPassword"
            name="confirmPassword"
            onChange={handleChange}
            required
            placeholder="Confirm your password..."
        />
    </div>

    <button type="submit" className="auth-button">
        Create Account
    </button>

</form>
<div className="auth-footer">
    <p>Already have an account? <Link to ="/login">Sign in here</Link></p>
</div>
        </div>
     </div>
    )
}

export default Registration