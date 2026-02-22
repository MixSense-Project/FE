import React, { useEffect, useMemo, useRef, useState } from "react";
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

    const [loading, setLoading] = useState({
        send: false,
        verify: false,
        signup: false,
    });

    const [msg, setMsg] = useState("");

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
            setMsg("");
            return;
        }

        if (name === "email") {
            setOtpSent(false);
            setIsVerified(false);
            setIsEmailIconActive(false);
            setMsg("");
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
        if (!email) {
            setMsg("이메일을 먼저 입력해줘.");
            return;
        }

        try {
            setLoading((p) => ({ ...p, send: true }));
            setMsg("");

            // ✅ 재전송/재시도 시 상태 초기화 (구코드 입력 방지)
            setForm((prev) => ({ ...prev, authentication: "" }));
            setIsVerified(false);
            setIsEmailIconActive(false);
            lastVerifiedTokenRef.current = "";

            await sendOtp({ email, type: "signup" });

            setOtpSent(true);
            setMsg("인증코드를 전송했어. 메일의 가장 최신 코드를 입력해줘.");
        } catch (err) {
            setOtpSent(false);
            setMsg(getErrorMsg(err, "OTP 전송 실패"));
        } finally {
            setLoading((p) => ({ ...p, send: false }));
        }
    };

    // 2) 자동 인증 (useEffect)
    useEffect(() => {
        const email = form.email.trim();
        const token = form.authentication.trim();

        // ✅ sendOtp 누른 후에만 verify
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
                setMsg("");

                await verifyOtp({ email, token, type: "signup" });

                lastVerifiedTokenRef.current = token;
                setIsVerified(true);
                setIsEmailIconActive(true);
                setMsg("이메일 인증이 완료됐어.");
            } catch (err) {
                setIsVerified(false);
                setIsEmailIconActive(false);

                const serverMsg = getErrorMsg(err, "인증번호가 일치하지 않거나 만료됐어.");

                // UX: 만료/무효면 재전송 유도 문구
                if (typeof serverMsg === "string" && serverMsg.includes("expired")) {
                    setMsg("인증코드가 만료됐어. '인증코드 받기'를 다시 눌러서 새 코드를 받아줘.");
                } else if (typeof serverMsg === "string" && serverMsg.includes("invalid")) {
                    setMsg("인증코드가 올바르지 않아. 메일의 최신 코드를 입력하거나 재전송해줘.");
                } else {
                    setMsg(serverMsg);
                }
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

        if (!isVerified) {
            setMsg("이메일 인증을 먼저 완료해줘.");
            return;
        }

        try {
            setLoading((p) => ({ ...p, signup: true }));
            await signup({ email, password });
            setMsg("회원가입 완료! 이제 로그인 페이지로 이동할게.");
            // 예: setTimeout(() => navigate("/login"), 1500);
        } catch (err) {
            setMsg(getErrorMsg(err, "회원가입 실패"));
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
                            <span style={{ fontSize: 12, opacity: 0.8 }}>
                                {!otpSent
                                    ? "인증코드 받기를 눌러줘"
                                    : loading.verify
                                        ? "인증 확인 중..."
                                        : isVerified
                                            ? "✅ 인증 완료"
                                            : `인증번호 ${OTP_LEN}자리를 입력해줘`}
                            </span>
                        </div>
                        {msg && <p style={{ marginTop: 8, color: isVerified ? "blue" : "red" }}>{msg}</p>}
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