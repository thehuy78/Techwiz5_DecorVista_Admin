import axiosAdmin from "@/shared/api/axiosAdmin";
import { useMutation } from "@tanstack/react-query";

export const registerNewDesignerRequest = () => {
  const request = async (payload) => {
    const response = await axiosAdmin.post("DesignerAdmin/designer_register", payload);
    return response.data;
  };

  return useMutation({
    mutationFn: request,
  });
};
