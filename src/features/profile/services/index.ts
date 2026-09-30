import { apiClient } from "@/lib/axios";
import { IResponse } from "@/types/api.type";
import { IChangePassword, IUpdateProfile } from "../types";

const PATH = {
  GET_ME: "/users/me",
  UPDATE_PROFILE: "/users/update-profile",
  CHANGE_PASSWORD: "/users/change-password",
};

export const profileService = {
  getMe: (): Promise<IResponse<User>> => apiClient.get(PATH.GET_ME),
  updateProfile: (payload: IUpdateProfile): Promise<IResponse<User>> =>
    apiClient.patch(PATH.UPDATE_PROFILE, payload),
  changePassword: (payload: IChangePassword): Promise<IResponse<void>> =>
    apiClient.post(PATH.CHANGE_PASSWORD, payload),
};
