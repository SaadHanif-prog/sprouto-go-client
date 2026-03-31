import { apiClient } from "@/src/api/apiClient";
import type {SignupApiResponse, CreateSignup, LoginApiResponse, CreateLogin, VerifyMe, LogoutApiResponse, GetAllUsersApiResponse, ForgotPasswordPayload, ForgotPasswordResponse, ResetPasswordPayload, ResetPasswordResponse} from "../types/auth.types";

import ENDPOINTS from "@/src/api/endpoints";

// Signup
export const signup = async (signupPayload : CreateSignup): Promise<SignupApiResponse> => {
  const {data} = await apiClient.post<SignupApiResponse>(`${ENDPOINTS.auth}/signup`, signupPayload);
  return data; 
};

// Login
export const login = async (loginPayload: CreateLogin): Promise<LoginApiResponse> => {
  const { data } = await apiClient.post<LoginApiResponse>(`${ENDPOINTS.auth}/login`, loginPayload);
  return data;
};

// Logout
export const logout = async (): Promise<LogoutApiResponse> => {
  const { data } = await apiClient.post<LogoutApiResponse>(`${ENDPOINTS.auth}/logout`, {});
  return data;
};

// Verify Me 
export const verifyMe = async (): Promise<VerifyMe> => {
  const { data } = await apiClient.get<VerifyMe>(`${ENDPOINTS.auth}/verify-me`);
  return data;
};

// Get All Users
export const getAllUsers = async (): Promise<GetAllUsersApiResponse> => {
  const { data } = await apiClient.get<GetAllUsersApiResponse>(
    `${ENDPOINTS.auth}/users`
  );
  return data;
};


// Forgot Password
export const forgotPassword = async (
  payload: ForgotPasswordPayload
): Promise<ForgotPasswordResponse> => {
  const { data } = await apiClient.post<ForgotPasswordResponse>(
    `${ENDPOINTS.auth}/forgot-password`,
    payload
  );
  return data;
};

// Reset Password
export const resetPassword = async (
  token: string,
  payload: ResetPasswordPayload
): Promise<ResetPasswordResponse> => {
  const { data } = await apiClient.post<ResetPasswordResponse>(
    `${ENDPOINTS.auth}/reset-password/${token}`,
    payload
  );
  return data;
};
