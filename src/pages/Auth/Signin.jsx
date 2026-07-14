import React from "react";
import { useState } from "react";
import { AiOutlineMail } from "react-icons/ai";
import { MdOutlineLock } from "react-icons/md";
import { FaArrowRightLong } from "react-icons/fa6";
import { Link, useNavigate } from "react-router-dom";
import '../../styles/Signin.css'



function Signin(){
    const [isValid, setisValid] = useState(null);
    const navigate = useNavigate();
    const [form, setForm] = useState({
        email: '',
        password: '',
    })

    const handleChange = e =>{
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
        if (isValid === "Wrong Credentials"){
            setisValid(null);
        }
    }

    const handleSubmit = e =>{
        e.preventDefault();
        const raw_user_data = localStorage.getItem('dummyUser');
        const mock_token = 'shitgang';


        localStorage.setItem('user_token', mock_token)
        if (!raw_user_data) {
            setisValid('Wrong Credentials');
            return;
        }
        console.log(raw_user_data);
        const user_data = JSON.parse(raw_user_data);

        if (form.email === user_data.email && form.password === user_data.password) {
            setisValid('Signing in...');
        
            setTimeout(() => {
                navigate('/dashboard');
            }, 800);
        }   
        else {
            setisValid('Wrong Credentials');
        }
    }

    return(
        <div className="login-form">
            <div className="login-wrapper">
                {isValid === 'Wrong Credentials' && (
                <p className="login-error-alert">
                 The email or password you entered is incorrect.
                </p>
                )}
                <span className="login-logo">pHarMa</span>
                <h1 className="login-greeting">Welcome Back</h1>
                <p className="login-mess">Sign in to access your medicine</p><p className="login-mess">authentication dashboard</p>
                <form className="sign-in-form" onSubmit={handleSubmit}>
                    <label><AiOutlineMail color="black" size="1em"/>Email</label>
                    <input type="email" name="email" value={form.email} onChange={handleChange} required></input>
                    <label><MdOutlineLock size="1em"/>Password</label>
                    <input type="password" name="password" value={form.password} onChange={handleChange} required></input>

                    <div className="radio-space">
                        <input type="radio" className="radio-button" /><label className="radio-label">Stay signed in for 30 days</label>
                    </div>
                    <button type="submit" disabled={isValid === 'Signing in...'}>
                        {isValid ? (
                        isValid
                        ) : (
                        <>
                            Sign In <FaArrowRightLong />
                        </>
                        )}
                    </button>
                    <hr />
                    <p className="login-notice">Don't have an account? <Link to="/register">Sign Up</Link></p>
                </form>
            </div>
        </div>
    );
}

export default Signin;