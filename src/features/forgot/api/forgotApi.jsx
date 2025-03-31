import axiosAdmin from "@/shared/api/axiosAdmin";
import { useMutation } from "@tanstack/react-query";

export const sendRequestToReset = () => {
  const request = async (payload) => {
    const response = await axiosAdmin.put("DesignerAdmin/ForgortPassword", payload);
    return response.data;
  };

  return useMutation({
    mutationFn: request,
  });
};
