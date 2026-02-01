import React, { useMemo, useState } from "react";
import SubHeader from "../../components/SubHeader";

const Splash_Login = () => {
  const [form, setForm] = useState({
    username: "",
    email: "",
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

    // TODO: 여기서 로그인 API 호출하면 됨
    console.log("login submit", form);
  };

  return (
    <div className="splash_login_wrap">
      <div className="container">
        <SubHeader title={"Log in"} />

        <div className="login_form" onSubmit={onSubmit}>
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
            <input
              name="email"
              value={form.email}
              onChange={onChange}
              placeholder="Email Address"
              autoComplete="email"
              inputMode="email"
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
              autoComplete="current-password"
            />
          </label>

          <button
            type="submit"
            className={`login_btn ${isEnabled ? "active" : ""}`}
            disabled={!isEnabled}
          >
            Log in
          </button>
        </div>
      </div>
    </div>
  );
};

export default Splash_Login;
