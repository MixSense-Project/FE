import React from 'react'
import Logo from '../../assets/img/logo.svg'

const Splash = () => {
    return (
    <div className='Splash_Wrap'>
        <div className="main_logo">
            <img src={Logo} alt="" />
            <h1>MixSense</h1>
        </div>
        <div className="splash_btns">
            <button className="login">
                <p>Login</p>
            </button>
            <button className="account">
                <p>Account</p>
            </button>
        </div>
    </div>
    )
}

export default Splash
