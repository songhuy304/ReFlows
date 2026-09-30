import { QUERY_KEY } from "@/config/query-keys";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { profileService } from "../services";
import { IUpdateProfile } from "../types";

const useUpdateProfile = () => {
  const t = useTranslations();
  const queryClient = useQueryClient();

  const updateProfileMutation = useMutation({
    mutationFn: (body: IUpdateProfile) => profileService.updateProfile(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.USER.ROOT] });
      toast.success(t("Profile.update-profile-success"));
    },
    onError: (error: Error) => {
      toast.error(t(error.message));
    },
  });

  const onUpdateProfile = (body: IUpdateProfile) => {
    updateProfileMutation.mutate(body);
  };

  return {
    ...updateProfileMutation,
    onUpdateProfile,
  };
};

export { useUpdateProfile };
