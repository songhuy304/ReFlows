import { useMutation } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { profileService } from "../services";
import { IChangePassword } from "../types";

const useChangePassword = () => {
  const t = useTranslations();

  const changePasswordMutation = useMutation({
    mutationFn: (body: IChangePassword) => profileService.changePassword(body),
    onSuccess: () => {
      toast.success(t("Profile.change-password-success"));
    },
    onError: (error: Error) => {
      toast.error(t(error.message));
    },
  });

  const onChangePassword = (body: IChangePassword, form: any) => {
    changePasswordMutation.mutate(body, {
      onSuccess() {
        form.reset();
      },
    });
  };

  return {
    ...changePasswordMutation,
    onChangePassword,
  };
};

export { useChangePassword };
