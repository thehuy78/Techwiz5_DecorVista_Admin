import { useMutation } from "@tanstack/react-query";
import axiosAdmin from "@/shared/api/axiosAdmin";

export const loginRequest = () => {
  const login = async (payload) => {
    const response = await axiosAdmin.post("authadmin/admin_login", payload);
    return response.data;
  };

  return useMutation({
    mutationFn: login,
  });
};
