import React from "react";
import { Link } from "react-router-dom";
import '../styles/Hero.css'
import '../index.css'
//import goes above

function Hero(){
    return(
        <div className="main-hero">
            <div className="hero-section">
                <div className="hero">
                    <h1 className="hero-head">one platform, clears all unregistered drugs</h1>
                    <p >An AI-driven pharcovigilance ecosystem. Photograph any medicine to intantly extract structured data, match batch records, and verify regulatory legitimacy in real time.</p>
                    <div className="hero-links">
                    <Link to="/register" className="get-start">Get Started</Link>
                    <Link to="/unregistered" className="flagged">Flagged Drugs</Link>
                    </div>
                </div>
                <img className="hero-image" src="/h-pic.png" alt="drug container"/>
            </div> 
        </div>
    );
}

export default Hero;