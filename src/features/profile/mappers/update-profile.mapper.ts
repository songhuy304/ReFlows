import { UpdateProfileFormValues } from "../schemas/profile.schema";
import { IUpdateProfile } from "../types";

export const profileMapper = {
  toEntity: (data: UpdateProfileFormValues): IUpdateProfile => {
    return {
      fullName: data.fullName,
      avatar: data.avatar,
    };
  },
};
