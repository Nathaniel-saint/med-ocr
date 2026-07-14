import React from "react";
import { Navigate, Outlet, useNavigate } from "react-router-dom";


function ProtectedRoute(){

    const isAuthenticated = localStorage.getItem('user_token') || sessionStorage.getItem('user_token');

    return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
}

export default ProtectedRoute;