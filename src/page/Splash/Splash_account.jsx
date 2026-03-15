import React, { useState } from "react";
import { Link } from "react-router-dom";
import Logo from "../../assets/img/logo.svg";
import email_icon from "../../assets/img/Splash/email_icon.svg";
import google_icon from "../../assets/img/Splash/google_icon.png";

const Splash_account = () => {
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleGoogleLogin = async (e) => {
    e.preventDefault();
    console.log("google click fired");

    const base = import.meta.env.VITE_API_BASE_URL;
    console.log("base:", base);

    if (!base) {
      alert("VITE_API_BASE_URL이 없습니다.");
      return;
    }

    try {
      setGoogleLoading(true);

      const res = await fetch(`${base}/auth/google/start`, {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      });

      console.log("status:", res.status);

      const data = await res.json();
      console.log("google start response:", data);

      if (!data?.authorize_url) {
        throw new Error("authorize_url not found");
      }

      window.location.assign(data.authorize_url);
    } catch (err) {
      console.error("google login error:", err);
      alert("Google 로그인 연결에 실패했습니다.");
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div className="Splash_account_Wrap">
      <div className="main_logo">
        <img src={Logo} alt="Logo" />
      </div>

      <div className="splash_btns">
        <Link to="/splash_signup" className="email_btn">
          <img src={email_icon} alt="email" />
          <p>Sign in with Email</p>
        </Link>

        <button
          type="button"
          className="google_btn"
          onClick={handleGoogleLogin}
          disabled={googleLoading}
        >
          <img src={google_icon} alt="google" />
          <p>{googleLoading ? "Connecting..." : "Sign in with Google"}</p>
        </button>

        <Link to="/" className="account_btn">
          <p>Log in</p>
        </Link>
      </div>
    </div>
  );
};

export default Splash_account;