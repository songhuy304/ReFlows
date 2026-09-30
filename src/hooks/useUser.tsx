import { selectUser } from "@/store";
import { useAppSelector } from "./useRedux";

export const useUser = () => {
  const user = useAppSelector(selectUser);

  return {
    user,
  };
};
