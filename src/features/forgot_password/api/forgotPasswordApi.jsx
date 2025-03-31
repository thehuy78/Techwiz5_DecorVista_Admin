import axiosAdmin from "@/shared/api/axiosAdmin";
import { useQuery } from "@tanstack/react-query";

export const sendPasswordResetRequest = () => {
  const requset = async () => {
    const response = await axiosAdmin.get("DesignerAdmin/ResetPassword");
    return response.data;
  };

  return useQuery({});
};
