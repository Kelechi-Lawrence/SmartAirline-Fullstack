import { Navigate, useLocation } from "react-router-dom";
import ApiService from "./ApiServices";

//  'element' to  pass in App.jsx
const RouteGuard = ({ element: Component, allowedRoles }) => {
    const Location = useLocation(); // Uppercase 'L'
    let hasRequiredRoles = false;

    if (!allowedRoles || allowedRoles.length === 0) {
        hasRequiredRoles = false; 
    } else {
        hasRequiredRoles = allowedRoles.some(role => {
            if (role === 'ADMIN') return ApiService.isAdmin();
            if (role === 'PILOT') return ApiService.isPilot();
            if (role === 'CUSTOMER') return ApiService.isCustomer();
            return false;
        });
    }

    if (hasRequiredRoles) {
        return Component; 
    } else {
       
        return <Navigate to="/login" replace state={{ from: Location }} />
    }
};

export default RouteGuard;