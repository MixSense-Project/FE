import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import SubHeader from "../../components/SubHeader";
import eamil_icon from "../../assets/img/Splash/signup_email.svg";
import coloreamil_icon from "../../assets/img/Splash/coloremail_icon.svg";
import { sendOtp, verifyOtp, signup } from "../../api/auth";


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
    const navigate = useNavigate();
    const [accessToken, setAccessToken] = useState("");

    const [loading, setLoading] = useState({
        send: false,
        verify: false,
        signup: false,
    });

    // 자동 verify 제어용 Ref
    const verifyTimerRef = useRef(null);
    const verifyingRef = useRef(false);
    const lastVerifiedTokenRef = useRef("");

    const canSignup = useMemo(() => {
        return (
            form.email.trim().length > 0 &&
            form.password.trim().length > 0 &&
            isVerified
        );
    }, [form.email, form.password, isVerified]);

    const onChange = (e) => {
        const { name, value } = e.target;

        if (name === "authentication") {
            // 숫자만 추출하여 6자리 제한
            const digitsOnly = value.replace(/\D/g, "").slice(0, OTP_LEN);
            setForm((prev) => ({ ...prev, authentication: digitsOnly }));

            // 번호를 수정하면 즉시 인증 상태 해제
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

    const getErrorMsg = (err, fallback = "요청 실패") => {
        return (
            err?.response?.data?.detail?.[0]?.msg ||
            err?.response?.data?.detail || // 가끔 detail이 배열이 아닐 때 대응
            err?.response?.data?.message ||
            err?.message ||
            fallback
        );
    };

    // 1) OTP 전송
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
            setOtpSent(false);
        } finally {
            setLoading((p) => ({ ...p, send: false }));
        }
    };

    // 2) 자동 인증 (useEffect)
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

                const res = await verifyOtp({ email, token, type: "email" });
                if (res.session && res.session.access_token) {
                    setAccessToken(res.session.access_token);
                }

                lastVerifiedTokenRef.current = token;
                setIsVerified(true);
                setIsEmailIconActive(true);
            } catch (err) {
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

    // 3) 최종 회원가입
    const onSubmit = async (e) => {
        e.preventDefault();
        const email = form.email.trim();
        const password = form.password.trim();

        if (!isVerified || !accessToken) {
            return;
        }

        try {
            setLoading((p) => ({ ...p, signup: true }));

            await signup({
                email,
                password,
                username: form.username.trim(),
                token: accessToken
            });

            // ✅ 회원가입 성공 후 로그인 페이지로 이동
            navigate("/splash_login", { replace: true });

        } catch (err) {
        } finally {
            setLoading((p) => ({ ...p, signup: false }));
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
                    </label>

                    <button
                        type="submit"
                        className="login_btn"
                        disabled={loading.signup || !canSignup}
                    >
                        {loading.signup ? "Creating..." : "Create Account"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Splash_Signup;