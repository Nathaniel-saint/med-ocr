import React from "react";
import { useOutletContext } from "react-router-dom";
import { IoMdNotificationsOutline, IoMdCheckmarkCircleOutline } from "react-icons/io";
import { CgProfile } from "react-icons/cg";
import { BsUpcScan } from "react-icons/bs";
import { GoAlert } from "react-icons/go";
import '../../styles/Dashboard.css'

// import goes up there

function Dashboard(){
    const rawUser = localStorage.getItem('dummyUser');
    const user = rawUser? JSON.parse(rawUser) : { fullname: 'User' };
    const firstName = user.fullname.trim().split(/\s+/)[0];

    const raw_history = localStorage.getItem('medicine_history');
    const history = raw_history ? JSON.parse(raw_history) : [];
    const totalScan = history.length;

    const registeredScans = history.filter(drug => drug.verdict === 'REGISTERED');
    const registeredCount = ((registeredScans.length/totalScan)*100);

    const unregistered = history.filter(med => med.verdict === 'UNREGISTERED');
    const unregisteredCount = ((unregistered.length/totalScan)*100);

    return(
        <div>
            <div className="not-user-pro">
                <IoMdNotificationsOutline  size="1.3em"/>
                <div className="pro-ico">{firstName}<CgProfile/></div>
            </div>
            <div className="user-greeting">
                <h2>Hello {user.fullname}</h2>
                <p>The pharmaceutical verification system is active. All security protocols are currently within optimal regulatory parameters</p>
            </div>

            <div className="grid-stat-container">
                <div className="stat-container sum-scan-container">
                    <div className="ico-container sum-scan">
                        <BsUpcScan className="sum-icon" size="1.5em"/> <span>+14% this week</span>
                    </div>
                    <div className="count-scan">
                        <h4>TOTAL SCANS</h4>
                        <h3>{totalScan}</h3>
                    </div>
                </div>

                <div className="stat-container sum-scan-container">
                    <div className="ico-container flagged-scan">
                        <GoAlert className="flagged-icon" size="1.5em"/> <span>Requires Review</span>
                    </div>
                    <div className="count-flagged">
                        <h4>FLAGGED DRUGS</h4>
                        <h3>{unregisteredCount.toFixed(2)}%</h3>
                    </div>
                </div>

                <div className="stat-container verified-container">
                    <div className="ico-container verified-scan">
                        <IoMdCheckmarkCircleOutline className="verified-icon" size="1.5em" /> <span>Secure</span>
                    </div>
                    <div className="count-verified">
                        <h4>VERIFIED DRUGS</h4>
                        <h3>{registeredCount.toFixed(2)}%</h3>
                    </div>

                </div>
            </div>
        </div>
    );
}


export default Dashboard;