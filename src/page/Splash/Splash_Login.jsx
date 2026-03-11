import React, { useMemo, useState } from "react";
import SubHeader from "../../components/SubHeader";
import { login } from "../../api/auth";
import { useLocation, useNavigate } from "react-router-dom";

const Splash_Login = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [form, setForm] = useState({
    username: "",
    email: location.state?.prefillEmail || "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setMsg("");
  };

  const isEnabled = useMemo(() => {
    return (
      form.email.trim().length > 0 &&
      form.password.trim().length > 0
    );
  }, [form.email, form.password]);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!isEnabled) return;

    try {
      setLoading(true);
      setMsg("");

      const res = await login({
        email: form.email.trim(),
        password: form.password.trim(),
      });

      if (res?.session?.access_token) {
        localStorage.setItem("access_token", res.session.access_token);

        if (res?.session?.refresh_token) {
          localStorage.setItem("refresh_token", res.session.refresh_token);
        }

        const usernameFromRes =
          res?.session?.user?.user_metadata?.username ||
          res?.session?.user?.user_metadata?.display_name ||
          form.username.trim() ||
          "";

        const emailFromRes =
          res?.session?.user?.email ||
          res?.session?.user?.user_metadata?.email ||
          form.email.trim();

        if (usernameFromRes) localStorage.setItem("username", usernameFromRes);
        if (emailFromRes) localStorage.setItem("email", emailFromRes);

        const userId = res?.session?.user?.id;
        if (userId) localStorage.setItem("user_id", userId);

        navigate("/home", { replace: true });
      }
    } catch (err) {
      const apiMsg =
        err?.response?.data?.detail?.[0]?.msg ||
        err?.response?.data?.message ||
        err?.message ||
        "로그인 실패";
      setMsg(apiMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="splash_login_wrap">
      <div className="container">
        <SubHeader title={"Log in"} />

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

          {msg && <p>{msg}</p>}

          <button
            type="submit"
            className={`login_btn ${isEnabled ? "active" : ""}`}
            disabled={!isEnabled || loading}
          >
            {loading ? "Logging in..." : "Log in"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Splash_Login;