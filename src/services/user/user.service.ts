import { apiClient } from "@/lib/axios";
import { IResponse } from "@/types/api.type";

const PATH = {
  GET_ME: "/users/me",
  UPDATE_PROFILE: "/users/update-profile",
  CHANGE_PASSWORD: "/users/change-password",
};

export const userService = {
  getMe: (): Promise<IResponse<User>> => apiClient.get(PATH.GET_ME),
  updateProfile: (formData: FormData): Promise<IResponse<User>> =>
    apiClient.put(PATH.UPDATE_PROFILE, formData),
  changePassword: (
    currentPassword: string,
    newPassword: string
  ): Promise<IResponse<void>> =>
    apiClient.post(PATH.CHANGE_PASSWORD, { currentPassword, newPassword }),
};
