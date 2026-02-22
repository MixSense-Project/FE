import React from 'react'
import { Link } from 'react-router-dom'
import Logo from '../../assets/img/logo.svg'
import email_icon from '../../assets/img/Splash/email_icon.svg'
import google_icon from '../../assets/img/Splash/google_icon.png'

const Splash = () => {
    return (
    <div className='Splash_Wrap'>
        <div className="main_logo">
            <img src={Logo} alt="" />
        </div>
        <div className="splash_btns">
            <button className="email_btn">
                <img src={email_icon} alt="" />
                <Link to='/splash_login'>
                <p>Log in with Email</p></Link>
            </button>
            <button className="google_btn">
                <img src={google_icon} alt="" />
                <p>Log in with Google</p>
            </button>
            <button className="account_btn">
                <Link to='/splash_account'>
                    <p>Create Account</p>
                </Link>
            </button>
        </div>
    </div>
    )
}

export default Splash
