import axiosAdmin from "@/shared/api/axiosAdmin";
import { useMutation, useQuery } from "@tanstack/react-query";
import qs from "qs";

export const searchProductRequest = (productName) => {
  const request = async (productName) => {
    const response = await axiosAdmin.get("ProductAdmin/search_product", {
      params: { productName },
    });
    return response.data;
  };

  return useQuery({
    queryKey: ["search_product", productName],
    queryFn: () => request(productName),
    retry: 0,
  });
};

export const getProductByIdRequest = (productId) => {
  const request = async (productId) => {
    const response = await axiosAdmin.get("ProductAdmin/show_specific_product", {
      params: { productId },
      paramsSerializer: (params) => qs.stringify(params, { arrayFormat: "repeat" }),
    });
    return response.data;
  };

  return useQuery({
    queryKey: ["specific_product", productId],
    queryFn: () => request(productId),
    retry: 0,
  });
};

export const createGalleryRequest = () => {
  const request = async (payload) => {
    const response = await axiosAdmin.post("Gallery/createNew", payload);
    return response.data;
  };

  return useMutation({
    mutationFn: request,
  });
};
