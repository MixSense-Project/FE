import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../api/client";

const Authcallback = () => {
  const navigate = useNavigate();
  const [message, setMessage] = useState("로그인 처리 중입니다...");

  useEffect(() => {
    const run = async () => {
      try {
        console.log("[Authcallback] mounted");
        console.log("[Authcallback] full url:", window.location.href);
        console.log("[Authcallback] hash:", window.location.hash);

        const hash = window.location.hash.startsWith("#")
          ? window.location.hash.slice(1)
          : "";

        const params = new URLSearchParams(hash);

        const accessToken = params.get("access_token") || "";
        const refreshToken = params.get("refresh_token") || "";
        const expiresAt = params.get("expires_at") || "";
        const tokenType = params.get("token_type") || "";

        console.log("[Authcallback] accessToken exists:", !!accessToken);

        if (!accessToken) {
          setMessage("로그인 정보가 없습니다.");
          setTimeout(() => navigate("/", { replace: true }), 1200);
          return;
        }

        localStorage.setItem("access_token", accessToken);
        if (refreshToken) localStorage.setItem("refresh_token", refreshToken);
        if (expiresAt) localStorage.setItem("expires_at", expiresAt);
        if (tokenType) localStorage.setItem("token_type", tokenType);

        setMessage("사용자 정보를 확인하는 중입니다...");

        const res = await api.get("/auth/me", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        console.log("[Authcallback] /auth/me response:", res?.data);

        const me = res?.data || {};

        const userId = me?.id || "";
        const email = me?.email || "";
        const username = me?.username || me?.name || "";
        const hasPreferences =
          typeof me?.has_preferences === "boolean"
            ? me.has_preferences
            : Array.isArray(me?.favorite_genres) &&
              Array.isArray(me?.favorite_artists) &&
              me.favorite_genres.length > 0 &&
              me.favorite_artists.length > 0;

        if (userId) localStorage.setItem("user_id", userId);
        if (email) localStorage.setItem("email", email);
        if (username) localStorage.setItem("username", username);
        localStorage.setItem("login_provider", "google");

        setMessage("이동 중입니다...");

        if (hasPreferences) {
          navigate("/home", { replace: true });
          return;
        }

        navigate("/preference_genre", {
          replace: true,
          state: {
            oauthUser: {
              id: userId,
              email,
              username,
              provider: me?.provider || "google",
            },
          },
        });
      } catch (err) {
        console.error("[Authcallback] error:", err);
        console.error("[Authcallback] response:", err?.response?.data);
        setMessage("로그인 처리에 실패했습니다.");
        setTimeout(() => navigate("/", { replace: true }), 1500);
      }
    };

    run();
  }, [navigate]);

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#000",
        color: "#fff",
        padding: "20px",
        textAlign: "center",
      }}
    >
      <p>{message}</p>
    </div>
  );
};

export default Authcallback;