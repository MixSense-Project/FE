import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import SubHeader from "../../components/SubHeader";
import eamil_icon from "../../assets/img/Splash/signup_email.svg";
import coloreamil_icon from "../../assets/img/Splash/coloremail_icon.svg";
import { sendOtp, verifyOtp } from "../../api/auth";

const OTP_LEN = 6;

const Splash_Signup = () => {
  const [form, setForm] = useState({
    username: "",
    email: "",
    authentication: "",
    password: "",
  });

  const [otpSent, setOtpSent] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [isEmailIconActive, setIsEmailIconActive] = useState(false);
  const [accessToken, setAccessToken] = useState("");
  const navigate = useNavigate();

  const [loading, setLoading] = useState({
    send: false,
    verify: false,
    next: false,
  });

  const verifyTimerRef = useRef(null);
  const verifyingRef = useRef(false);
  const lastVerifiedTokenRef = useRef("");

  const canNext = useMemo(() => {
    return (
      form.username.trim().length > 0 &&
      form.email.trim().length > 0 &&
      form.password.trim().length >= 6 &&
      isVerified &&
      !!accessToken
    );
  }, [form.username, form.email, form.password, isVerified, accessToken]);

  const onChange = (e) => {
    const { name, value } = e.target;

    if (name === "authentication") {
      const digitsOnly = value.replace(/\D/g, "").slice(0, OTP_LEN);
      setForm((prev) => ({ ...prev, authentication: digitsOnly }));
      setIsVerified(false);
      setIsEmailIconActive(false);
      return;
    }

    if (name === "email") {
      setOtpSent(false);
      setIsVerified(false);
      setIsEmailIconActive(false);
      setAccessToken("");
      lastVerifiedTokenRef.current = "";
      setForm((prev) => ({ ...prev, email: value, authentication: "" }));
      return;
    }

    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSendOtp = async () => {
    const email = form.email.trim();
    if (!email) return;

    try {
      setLoading((p) => ({ ...p, send: true }));

      setForm((prev) => ({ ...prev, authentication: "" }));
      setIsVerified(false);
      setIsEmailIconActive(false);
      setAccessToken("");
      lastVerifiedTokenRef.current = "";

      await sendOtp({ email, type: "signup" });
      setOtpSent(true);
    } catch (err) {
      console.error("[send otp] error:", err?.response?.data || err);
      setOtpSent(false);
    } finally {
      setLoading((p) => ({ ...p, send: false }));
    }
  };

  useEffect(() => {
    const email = form.email.trim();
    const token = form.authentication.trim();

    if (!otpSent) return;
    if (!email) return;
    if (token.length !== OTP_LEN) return;
    if (verifyingRef.current) return;
    if (isVerified && lastVerifiedTokenRef.current === token) return;

    if (verifyTimerRef.current) clearTimeout(verifyTimerRef.current);

    verifyTimerRef.current = setTimeout(async () => {
      verifyingRef.current = true;

      try {
        setLoading((p) => ({ ...p, verify: true }));

        const res = await verifyOtp({ email, token, type: "signup" });

        if (res?.session?.access_token) {
          setAccessToken(res.session.access_token);
        }

        lastVerifiedTokenRef.current = token;
        setIsVerified(true);
        setIsEmailIconActive(true);
      } catch (err) {
        console.error("[verify otp] error:", err);
        setIsVerified(false);
        setIsEmailIconActive(false);
        setAccessToken("");
      } finally {
        verifyingRef.current = false;
        setLoading((p) => ({ ...p, verify: false }));
      }
    }, 500);

    return () => {
      if (verifyTimerRef.current) clearTimeout(verifyTimerRef.current);
    };
  }, [form.email, form.authentication, otpSent, isVerified]);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!canNext) return;

    try {
      setLoading((p) => ({ ...p, next: true }));

      navigate("/preference_genre", {
        state: {
          signupDraft: {
            username: form.username.trim(),
            email: form.email.trim(),
            password: form.password.trim(),
            token: accessToken,
          },
        },
      });
    } finally {
      setLoading((p) => ({ ...p, next: false }));
    }
  };

  return (
    <div className="splash_signup_wrap">
      <div className="container">
        <SubHeader title={"Sign up"} />

        <form className="login_form" onSubmit={onSubmit}>
          <label className="field">
            <span className="label">Username</span>
            <input
              name="username"
              value={form.username}
              onChange={onChange}
              placeholder="Username"
              autoComplete="username"
            />
          </label>

          <label className="field">
            <span className="label">Email</span>
            <div className="input_with_icon" style={{ gap: 8 }}>
              <input
                name="email"
                value={form.email}
                onChange={onChange}
                placeholder="Email Address"
                autoComplete="email"
                inputMode="email"
              />
              <img
                className="email_icon"
                src={isEmailIconActive ? coloreamil_icon : eamil_icon}
                alt="email icon"
                onClick={handleSendOtp}
                style={{ cursor: "pointer" }}
              />
              <button
                type="button"
                onClick={handleSendOtp}
                disabled={loading.send}
                style={{ whiteSpace: "nowrap" }}
              >
                {loading.send ? "Sending..." : "인증코드 받기"}
              </button>
            </div>

            <div className="input_with_icon" style={{ gap: 8, marginTop: 10 }}>
              <input
                name="authentication"
                value={form.authentication}
                onChange={onChange}
                placeholder="Authentication number"
                autoComplete="one-time-code"
                inputMode="numeric"
                maxLength={OTP_LEN}
              />
            </div>
          </label>

          <label className="field">
            <span className="label">Password</span>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={onChange}
              placeholder="Password"
              autoComplete="new-password"
            />

            <div style={{ minHeight: "18px", marginTop: "6px" }}>
              {form.password.length > 0 && form.password.length < 6 && (
                <p
                  style={{
                    color: "var(--main)",
                    fontSize: "12px",
                    margin: 0,
                    lineHeight: 1.4,
                  }}
                >
                  비밀번호는 6자리 이상 입력해주세요
                </p>
              )}
            </div>
          </label>

          <button
            type="submit"
            className="login_btn"
            disabled={!canNext || loading.next}
          >
            {loading.next ? "Moving..." : "Next"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Splash_Signup;