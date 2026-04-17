import React from 'react'
import { Link } from 'react-router'
import "../../css/footer.css"
const Footer = () => {
  return (
    <div className="footer">
        <div className="footer-container">
            <div className="footer-section">
                <h3 className='footer-heading'>Smart Airline</h3>
                <p className='footer-text'>Soaring like an eagle</p>
            </div>
            <div className="footer-section">
                <h3 className="footer-heading">Quick Links</h3>
                <ul className="footer-links">
                    <li ><Link className='footer-link' to ="/flight">Book Flight</Link></li>
                    <li ><Link className='footer-link' to ="/contact">Contact Us</Link></li>
                </ul>
            </div>
           
            <div className="footer-section">
                <h3 className="footer-heading">Legal</h3>
                <ul className="footer-links">
                    <li ><Link className='footer-link' to ="/terms">Terms of Services</Link></li>
                    <li ><Link className='footer-link' to ="/contact">Contact us</Link></li>
                    <li ><Link className='footer-link' to ="/fax">Contact us</Link></li>
                </ul>
            </div>

           
        </div>
         <div className="footer-bottom">
                <p>&copy; {new Date().getFullYear()} Smart Airline. All rights to reserved</p>
            </div>
    </div>
  )
}

export default Footer