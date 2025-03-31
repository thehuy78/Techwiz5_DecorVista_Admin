import axiosAdmin from "@/shared/api/axiosAdmin";
import { useMutation } from "@tanstack/react-query";

export const createNewProductRequest = () => {
  const request = async (payload) => {
    const response = await axiosAdmin.post("ProductAdmin/create_product", payload);
    return response.data;
  };

  return useMutation({
    mutationFn: request,
  });
};
