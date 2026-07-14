import React from 'react';
import '../styles/Footer.css'
import '../index.css'

function Footer(){
    return(
        <div className='footer-container'>
            <div className="footer-child">
                <div className="upper">
                    <span>pHarMa</span>
                    <p>Intelligent Medicine Authentication Ecosystem</p>
                </div>
                
                <div className='lower'>
                    <p>&copy; 2026 pHarMa. All rights reserved. Registered with the Ghana FDA Register.</p>
                    <div className='footer-bottom'>
                        <p>Privacy Policy</p>
                        <p>Terms of Services</p>
                    </div>
                </div>
            </div>
        </div>
    );

}

export default Footer;