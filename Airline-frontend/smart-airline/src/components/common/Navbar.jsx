import React, { useState, useEffect } from 'react'
import { useNavigate, Link, useLocation } from 'react-router-dom'
import ApiService from '../../services/ApiServices'
import "../../css/navbar.css"

const Navbar = () => {
    const location = useLocation(); 
    const navigate = useNavigate();

   
    const [authStatus, setAuthStatus] = useState({
        isAuthenticated: ApiService.isAuthenticated(),
        isAdmin: ApiService.isAdmin(),
        isPilot: ApiService.isPilot(),
        isCustomer: ApiService.isCustomer()
    });


    useEffect(() => {
        setAuthStatus({
            isAuthenticated: ApiService.isAuthenticated(),
            isAdmin: ApiService.isAdmin(),
            isPilot: ApiService.isPilot(),
            isCustomer: ApiService.isCustomer()
        });
    }, [location]); 

    const handleLogout = () => {
        const isLogout = window.confirm("Are you sure you want to logout?");
        if (isLogout) {
            ApiService.logOut();
            navigate("/login");
        }
    }

    return (
        <nav className="nb">
            <div className="nb-container">
                <div className="nb-brand">
                    <Link to="/" className='nb-logo'>
                        <span className='logo-airline'>Smart</span>
                        <span className='logo-text'>Airline</span>
                    </Link>
                </div>
                <div className="nb-links">
                    <Link to="/home" className='nav-link'>Home</Link>
                    <Link to="/flights" className='nav-link'>FindFlights</Link>
                    
                    {authStatus.isAuthenticated ? (
                        <>
                            {authStatus.isCustomer && <Link to="/profile" className="nav-link">Profile</Link>}
                            {authStatus.isPilot && <Link to="/pilot" className="nav-link">Pilot</Link>}
                            {authStatus.isAdmin && <Link to="/admin" className="nav-link">Admin</Link>}
                            <button className='nav-button' onClick={handleLogout}>LogOut</button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className='nav-link'>Login</Link>
                            <Link to="/register" className='nav-button nav-button-primary'>SignUp</Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    )
}

export default Navbar;