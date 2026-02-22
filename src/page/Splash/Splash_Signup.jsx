import React, { useMemo, useState } from "react";
import SubHeader from "../../components/SubHeader";
import eamil_icon from "../../assets/img/Splash/signup_email.svg"
import coloreamil_icon from "../../assets/img/Splash/coloremail_icon.svg"

const Splash_Signup = () => {
    const [form, setForm] = useState({
        username: "",
        email: "",
        authentication: "",
        password: "",
    });

    const onChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const isEnabled = useMemo(() => {
        return (
            form.username.trim().length > 0 &&
            form.email.trim().length > 0 &&
            form.password.trim().length > 0
        );
    }, [form]);

    const onSubmit = (e) => {
        e.preventDefault();
        if (!isEnabled) return;
        console.log("signup submit", form);
    };
    const [isEmailIconActive, setIsEmailIconActive] = useState(false);
    const toggleEmailIcon = () => {
        setIsEmailIconActive(prev => !prev);
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

                        <div className="input_with_icon">
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
                                onClick={toggleEmailIcon}
                            />

                        </div>

                        <input
                            name="authentication"
                            value={form.authentication}
                            onChange={onChange}
                            placeholder="Authentication number"
                            autoComplete="one-time-code"
                            inputMode="numeric"
                        />
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
                        className={`login_btn ${isEnabled ? "active" : ""}`}
                        disabled={!isEnabled}
                    >
                        Create Account
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Splash_Signup;
