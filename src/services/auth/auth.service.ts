import { apiClient } from "@/lib/axios";
import {
  IForgotPasswordRequest,
  IRefreshTokenRequest,
  IResetPasswordRequest,
  ISignInRequest,
  ISignUpRequest,
  ITokenResponse,
  IVerifyTokenRequest,
} from "@/services/auth/auth.type";
import { IApiBaseResponse, IResponse } from "@/types/api.type";

export const authService = {
  signIn: (payload: ISignInRequest): Promise<IResponse<ITokenResponse>> =>
    apiClient.post("/auth/login", payload),

  signUp: (payload: ISignUpRequest): Promise<IApiBaseResponse> =>
    apiClient.post("/auth/signup", payload),

  forgotPassword: (payload: IForgotPasswordRequest): Promise<IApiBaseResponse> =>
    apiClient.post("/auth/forgot-password", payload),

  resetPassword: (payload: IResetPasswordRequest): Promise<IApiBaseResponse> =>
    apiClient.post("/auth/reset-password", payload),

  verifyToken: (payload: IVerifyTokenRequest): Promise<IResponse<ITokenResponse>> =>
    apiClient.post("/auth/verify", payload),

  refreshToken: (payload: IRefreshTokenRequest): Promise<IResponse<ITokenResponse>> =>
    apiClient.post("/auth/refresh-token", payload),
};
