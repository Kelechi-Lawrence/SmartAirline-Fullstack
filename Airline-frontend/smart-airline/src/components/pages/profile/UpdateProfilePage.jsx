import { useEffect, useState } from "react"
import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useMessage } from '../../common/MessageDisplay'
import ApiService from '../../../services/ApiServices'
import { Link } from 'react-router-dom'
import "../../../css/profileUpdate.css"
const UpdateProfilePage = () => {
    const [user, setUser] = useState({
        name: '',
        email: '',
        phoneNumber: '',
        password: '',
        confirmPassword: ''
    });
    const [loading, setLoading] = useState(true);
    const { ErrorDisplay, SuccessDisplay, showError, showSuccess } = useMessage();
    const navigate = useNavigate();

    useEffect(() => {
        fetchUserProfile();
    }, []);
// FETCH CURRENT USER PROFILE
    const fetchUserProfile = async () => {
        try {
            const response = await ApiService.getAccountDetails();
            // Spread existing data, but ensure password fields stay empty strings
            setUser(prevState => ({
                ...prevState,
                ...response.data,
                password: '',
                confirmPassword: ''
            }));
        } catch (error) {
            showError(error.response?.data?.message || "Error loading profile");
        } finally {
            setLoading(false);
        }
    };
// HANDLE THE DATA
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUser({ ...user, [name]: value });
    };
//SUMBIT UPDATED FORM
    const handleSubmit = async (e) => {
        e.preventDefault();
        if(user.password && user.password.length < 4){
            showError("Password entered must be greater than 4")
        }
        if (user.password && user.password !== user.confirmPassword) {
            showError("Passwords do not match");
            return;
        }

        try {
         
            await ApiService.updateAccountDetails(user);
            showSuccess("Profile updated successfully!");
            setTimeout(() => navigate("/profile"), 2000);
        } catch (error) {
            showError(error.response?.data?.message || "Failed to update profile");
        }
    };  

    if (loading) return <p className="loading">Loading your details...</p>;
    return (
    <div><div className="update-profile-container">
            <div className="update-profile-card">
                <h2 className="update-profile-title">Edit Profile</h2>
                <p className="update-profile-subtitle">Keep your contact information up to date.</p>
                
                <ErrorDisplay />
                <SuccessDisplay />

                <form className="update-profile-form" onSubmit={handleSubmit}>
                    <div className="update-profile-form-group">
                        <label className="update-profile-label">Full Name</label>
                        <input 
                            className="update-profile-input"
                            type="text" name="name" 
                            value={user.name} onChange={handleInputChange} required 
                        />
                    </div>

                    <div className="update-profile-form-group">
                        <label className="update-profile-label">Email Address</label>
                        <input 
                            className="update-profile-input readonly" 
                            type="email" value={user.email} readOnly 
                        />
                    </div>

                    <div className="update-profile-form-group">
                        <label className="update-profile-label">Phone Number</label>
                        <input 
                            className="update-profile-input"
                            type="text" name="phoneNumber" 
                            value={user.phoneNumber} onChange={handleInputChange} 
                        />
                    </div>

                    <hr className="password-section-divider" />

                    <div className="update-profile-form-group">
                        <label className="update-profile-label">New Password</label>
                        <input 
                            className="update-profile-input"
                            type="password" name="password" 
                            value={user.password} onChange={handleInputChange}
                            placeholder="Password"
                        />
                    </div>

                    <div className="update-profile-form-group">
                        <label className="update-profile-label">Confirm Password</label>
                        <input 
                            className="update-profile-input"
                            type="password" name="confirmPassword" 
                            value={user.confirmPassword} onChange={handleInputChange}
                        />
                    </div>

                    <div className="update-profile-actions">
                        <button type="submit" className="update-profile-submit">Save Changes</button>
                        <Link to="/profile" className="update-profile-cancel">Cancel</Link>
                    </div>
                </form>
            </div>
        </div></div>
  )
}

export default UpdateProfilePage