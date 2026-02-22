import { api } from "./client";

/** OTP 발송 (백엔드는 email만 사용, type 무시) */
export const sendOtp = ({ email }) =>
  api.post("/auth/send-otp", { email }).then((res) => res.data);

/**
 * OTP 검증
 * - OTP를 "인증코드 받기"(sendOtp)로 받았으면 type 생략 또는 "email" (기본값)
 * - OTP를 signup 후 메일로 받았으면 type: "signup" 전달
 */
export const verifyOtp = ({ email, token, type = "email" }) =>
  api.post("/auth/verify", { email, token, type }).then((res) => res.data);

/** 회원가입 (username 있으면 Supabase user_metadata에 저장) */
export const signup = ({ email, password, username }) =>
  api.post("/auth/signup", { email, password, username }).then((res) => res.data);

export const login = ({ email, password }) =>
  api.post("/auth/login", { email, password }).then((res) => res.data);