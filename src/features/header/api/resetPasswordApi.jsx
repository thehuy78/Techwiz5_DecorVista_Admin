import axiosAdmin from "@/shared/api/axiosAdmin";
import { useMutation } from "@tanstack/react-query";

export const changePasswordRequest = () => {
  const request = async (payload) => {
    const response = await axiosAdmin.put("AuthAdmin/reset_password", payload);
    return response.data;
  };

  return useMutation({
    mutationFn: request,
  });
};
