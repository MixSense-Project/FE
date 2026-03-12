import { api } from "./client";

export const sendOtp = ({ email }) =>
  api.post("/auth/send-otp", { email }).then((res) => res.data);

export const verifyOtp = ({ email, token, type = "email" }) =>
  api.post("/auth/verify", { email, token, type }).then((res) => res.data);

export const signup = ({ email, password, username, token }) =>
  api.post(
    "/auth/signup",
    { email, password, username },
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  ).then((res) => res.data);

export const login = ({ email, password }) =>
  api.post("/auth/login", { email, password }).then((res) => res.data);