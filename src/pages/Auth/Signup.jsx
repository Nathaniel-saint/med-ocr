import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import '../../styles/Signup.css'
import { GiTargetDummy } from "react-icons/gi";

function Signup(){
    const navigate = useNavigate();
    const [form, setForm] = useState({
        fullName: '',
        email: '',
        password: '',
    })

    // As user make edit and changes

    const handleChange = e =>{
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    }

    const handleSubmit = e =>{
        e.preventDefault();
        const userdata = {
            fullname: form.fullName,
            email: form.email,
            password: form.password
        }

        const temporarySessionMockToken = "auth_session_token_node_" + Date.now();
        localStorage.setItem("user_token", temporarySessionMockToken);

        localStorage.setItem('dummyUser',JSON.stringify(userdata));
        console.log(userdata);
        navigate('/dashboard');
    }

    return(
        <div className="form-bg">
            <form className="form-wrapper" onSubmit={handleSubmit} >
                <h1 className="form-head">Create Your Account</h1>
                <div className="name-email-wrapper">
                    <div className="name-wrapper">
                        <label>Full Name</label>
                        <input type="text" required name="fullName" value={form.fullName} onChange={handleChange}></input>
                    </div>

                    <div className="email-wrapper">
                        <label>Email</label>
                        <input type="email" name="email" value={form.email} onChange={handleChange} required></input>
                    </div>
                </div>

                <div className="password-wrapper">
                    <label>Password</label>
                    <input type="password" name="password" value={form.password} onChange={handleChange} required></input>
                    <p className="instruct">Must be at least 12 characters with symbols</p>
                </div>
                <button type="submit">Create Account</button>
                <p className="notice">By signing up, you agree to our <Link to='/terms'>Terms of Services</Link> and <Link to='/privacy_policy'>Regulatory Privacy Standards</Link>.</p>
            </form>
        </div>
    );
}

export default Signup;