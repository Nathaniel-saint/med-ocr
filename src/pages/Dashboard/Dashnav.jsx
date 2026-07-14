import React from "react";
import { NavLink, Outlet } from "react-router-dom";
import { MdOutlineDashboard, MdOutlineQrCodeScanner, MdHistory, MdInsights, MdLogout} from "react-icons/md";
import '../../styles/Dashnav.css'

// All import goes up there

function Dashnav(){
    const handleLogout = (e) => {
    e.preventDefault();

    localStorage.removeItem('user_token');
    sessionStorage.removeItem('user_token');

    window.location.href = '/';
  }

    return(
        <div className="dashboard">
            <div className="side-links-layout">
                <span className="logo">pHarma</span>
                <aside className="side-bar">
                    <nav className="side-links">
                    <NavLink to="/dashboard" end><MdOutlineDashboard size="1.25em"/>Dashboard</NavLink>
                    <NavLink to="scan"><MdOutlineQrCodeScanner size="1.2em"/>Scan</NavLink>
                    <NavLink to="history"><MdHistory size="1.2em"/>History</NavLink>
                    <NavLink to="insight"><MdInsights size="1.2em"/>Insight</NavLink>
                    </nav>
                    <NavLink className="last-dash-link" to="#logout" onClick={handleLogout}><MdLogout />Logout</NavLink>
                </aside>
            </div>
            <main>
                <Outlet />
            </main>
        </div>
    );
}

export default Dashnav;