import React from "react";
import { Link } from "react-router-dom";
import '../styles/Nav.css'
import '../index.css'


//import goes above

function Nav(){
    return(
    
    <div className="nav-bar">

        <nav className="nav">
            <Link to='/' className="logo">pHarMa</Link>
            <div className="nav-links">
                <Link to="/register">Register</Link>
                <Link to="/login">Sign In</Link>
            </div>
        </nav>

    </div>
    )
}


export default Nav;