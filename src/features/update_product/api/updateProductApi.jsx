import { useMutation, useQuery } from "@tanstack/react-query";
import axiosAdmin from "@/shared/api/axiosAdmin";

export const getProductByIdRequest = (productId) => {
  const request = async (productId) => {
    const response = await axiosAdmin.get("ProductAdmin/get_product", { params: { productId } });
    return response.data;
  };

  return useQuery({
    queryKey: ["product_id", productId],
    queryFn: () => request(productId),
  });
};

export const updateProductRequest = () => {
  const request = async (payload) => {
    const response = await axiosAdmin.put("ProductAdmin/update_product", payload);
    return response.data;
  };

  return useMutation({
    mutationFn: request,
  });
};
