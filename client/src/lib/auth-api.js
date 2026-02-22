import api from "./axios";

export const login = async (data) => {
  const response = await api.post("/auth/login", data);
  return response;
};

export const register = async (data) => {
  const response = await api.post("/auth/register", data);
  return response;
};

export const verifyEmail = async (token) => {
  const response = await api.post(`/auth/verify-email/${token}`);
  return response.data;
};

export const sendForgetPasswordEmail = async (email) => {
  const response = await api.post("/auth/send-forgot-password-email", {
    email,
  });
  return response.data;
};

export const verifyForgetPasswordToken = async (token) => {
  const response = await api.post(
    `/auth/verify-forgot-password-token/${token}`,
  );
  return response.data;
};

export const resetPassword = async (token, newPassword) => {
  const response = await api.post(`/auth/reset-password/${token}`, {
    newPassword,
  });
  return response.data;
};

export const logout = async () => {
  await api.post("/auth/logout");
};
