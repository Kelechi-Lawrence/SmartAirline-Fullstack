import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMessage } from '../common/MessageDisplay'
import ApiService from '../../services/ApiServices'
import { Link } from 'react-router-dom'
import "../../css/auth.css"
const Login = () => {

    const { ErrorDisplay,SuccessDisplay, showError, showSuccess } = useMessage();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
       
        email: '',
      
        password: '',
      
    });

    const handleChange = (e) =>{
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if( !formData.email ||  !formData.password ){
            showError("All fields required");
            return;
        }

        // if(formData.password !== formData.confirmPassword){
        //     showError("Password doesn't match");
        //     return;
        // }

        const loginData = {
           
            email: formData.email,
        
            password: formData.password,
            
        };

        try{
            const response = await ApiService.login(loginData);

            if (response.statusCode === 200){
              ApiService.saveRoles(response.data.roles)
              ApiService.saveToken(response.data.token)
                navigate("/home");
                showSuccess("User sucessfuly logged in!")
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
            <SuccessDisplay/>
            <div className="auth-header">
                <h2>SmartAirline</h2>
                <p>Fly with steeze</p>
            </div>
            <form className="auth-form" onSubmit={handleSubmit}>
    
   
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

    <button type="submit" className="auth-button">
        Login
    </button>

</form>
<div className="auth-footer">
    <p>Dont have an account? <Link to ="/register">Sign Up</Link></p>
</div>
        </div>
     </div>
    )
}

export default Login