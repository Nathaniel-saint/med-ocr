import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

//import components below
import Nav from "./sections/Nav";
import Hero from "./sections/Hero";
import Footer from "./sections/Footer";
import Signup from "./pages/Auth/Signup";
import Signin from "./pages/Auth/Signin";
import Dashnav from "./pages/Dashboard/Dashnav";
import Dashboard from "./pages/Dashboard/Dashboard";
import Scan from "./pages/Dashboard/Scan";
import History from "./pages/Dashboard/History";
import Insight from "./pages/Dashboard/Insight";
import ProtectedRoute from "./pages/Auth/ProtectedRoute";
import './index.css'

// import goes up there


function App(){
    return(
        <div>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<div className="home-page"><Nav /><Hero /> <Footer /></div> } />
                    <Route path="/register" element={<Signup />} />
                    <Route path="/login" element={<Signin />} />

                    <Route element={<ProtectedRoute />}>
                        <Route path="/dashboard" element={<Dashnav />}>
                            <Route index element={<Dashboard />}/>
                            <Route path="scan" element={<Scan />}/>
                            <Route path="history" element={<History />}/>
                            <Route path="insight" element={<Insight />}/>
                        </Route>
                    </Route>
                </Routes>
            </BrowserRouter>
        </div>
    );
}

export default App;