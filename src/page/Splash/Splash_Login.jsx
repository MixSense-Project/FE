import React, { useMemo, useState } from "react";
import SubHeader from "../../components/SubHeader";
import { login } from "../../api/auth";
// import { useNavigate } from "react-router-dom";

const Splash_Login = () => {
  // const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "", // UI용(백엔드 안 받으면 유지/삭제 선택)
    email: "",
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
      form.username.trim().length > 0 &&
      form.email.trim().length > 0 &&
      form.password.trim().length > 0
    );
  }, [form]);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!isEnabled) return;

    try {
      setLoading(true);
      setMsg("");

      const tokenOrMessage = await login({
        email: form.email.trim(),
        password: form.password.trim(),
      });

      // ✅ 200 응답이 "string" 이니까 보통 토큰이라고 가정하고 저장
      if (typeof tokenOrMessage === "string" && tokenOrMessage.length > 0) {
        localStorage.setItem("access_token", tokenOrMessage);
      }

      setMsg("로그인 성공!");
      // navigate("/home");
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

        {/* ✅ div -> form 으로 변경 */}
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

          {msg && <p style={{ marginTop: 8 }}>{msg}</p>}

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