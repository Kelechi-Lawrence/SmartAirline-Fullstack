import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './components/common/Navbar'
import Home from './components/pages/Home'
import Footer from './components/common/Footer'
import Registration from './components/auth/Registration'
import Login from './components/auth/Login'
import SearchFlightPage from './components/pages/SearchFlightPage'
import ProfilePage from './components/pages/profile/ProfilePage'
import UpdateProfilePage from './components/pages/profile/UpdateProfilePage'
import BookingPage from './components/pages/booking/BookingPage'
import BookingDetails from './components/pages/booking/BookingDetails'
import RouteGuard from './services/RouteGuard'
import AdminDashboardPage from './components/admin/AdminDashboardPage'
import AdminDetailsBooking from './components/admin/AdminDetailsBooking'
import AdminFlight from './components/admin/AdminFlight'
import AdminAirport from './components/admin/AddAirport'
import AddAirport from './components/admin/AddAirport'
import AddFlight from './components/admin/AddFlight'
import AdminPilot from './components/admin/AdminPilot'

const App = () => {
  

  return (
    <BrowserRouter>
      <Navbar />

      <div className="content">
        <Routes>
          {/* PUBLIC ENDPOINTS */}
          <Route path="/" element={<Navigate to="/home" />} />
          <Route path="/home" element={<Home />} />
          <Route path="/register" element={<Registration />} />
          <Route path="/login" element={<Login />} />
          <Route path="/flights" element={<SearchFlightPage />} />

          {/* PROFILE & USER ENDPOINTS */}
          <Route 
            path="/profile" 
            element={<RouteGuard allowedRoles={['CUSTOMER', 'ADMIN', 'PILOT']} element={<ProfilePage />} />} 
          />
          <Route 
            path="/update-profile" 
            element={<RouteGuard allowedRoles={['CUSTOMER', 'ADMIN', 'PILOT']} element={<UpdateProfilePage />} />} 
          />
          <Route 
            path="/book-flight/:id" 
            element={<RouteGuard allowedRoles={['CUSTOMER']} element={<BookingPage />} />} 
          />
          <Route 
            path="/bookings/:id"
            element={<RouteGuard allowedRoles={['CUSTOMER', 'ADMIN', 'PILOT']} element={<BookingDetails />} />} 
          />
            <Route 
                        path="/flight/:id" 
                        element={<RouteGuard allowedRoles={['PILOT']} element={<AdminFlight />} />} 
                      />
          {/* FALLBACK */}
          <Route path="*" element={<Navigate to="/home" />} />
            
           {/* ADMIN DASHBOARD */}
           <Route 
            path="/admin" 
            element={<RouteGuard allowedRoles={[ 'ADMIN', 'PILOT']} element={<AdminDashboardPage />} />} 
          />
          <Route 
            path="/admin/booking/:id" 
            element={<RouteGuard allowedRoles={[ 'ADMIN', 'PILOT']} element={<AdminDetailsBooking />} />} 
          />
           <Route 
            path="/add-airport/" 
            element={<RouteGuard allowedRoles={[ 'ADMIN', 'PILOT']} element={<AddAirport />} />} 
          />
           <Route 
            path="/edit-airport/:id" 
            element={<RouteGuard allowedRoles={[ 'ADMIN', 'PILOT']} element={<AddAirport />} />} 
          />
            <Route 
            path="/add-flight" 
            element={<RouteGuard allowedRoles={[ 'ADMIN', 'PILOT']} element={<AddFlight />} />} 
          />
           <Route 
            path="/edit-flight/:id" 
            element={<RouteGuard allowedRoles={[ 'ADMIN', 'PILOT']} element={<AddFlight />} />} 
          />
           <Route 
            path="/add-pilot" 
            element={<RouteGuard allowedRoles={[ 'ADMIN', 'PILOT']} element={<AdminPilot />} />} 
          />
        </Routes>
 
        
      </div>
      
      <Footer />
    </BrowserRouter>
  )
}

export default App