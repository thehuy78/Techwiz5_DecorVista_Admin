import { useMutation, useQuery } from "@tanstack/react-query";
import axiosAdmin from "@/shared/api/axiosAdmin";
import qs from "qs";

export const getProductListRequest = (
  pageNumber,
  pageSize,
  active,
  functionalityId,
  brand,
  search
) => {
  const request = async (pageNumber, pageSize, active, functionalityId, brand, search) => {
    const response = await axiosAdmin.get("ProductAdmin/get_products", {
      params: {
        pageNumber,
        pageSize,
        active,
        functionalityId,
        brand,
        search,
      },
      paramsSerializer: (params) => qs.stringify(params, { arrayFormat: "repeat" }),
    });

    return response.data;
  };

  return useQuery({
    queryKey: ["product_list", pageNumber, pageSize, active, functionalityId, brand, search],
    queryFn: () => {
      return request(pageNumber, pageSize, active, functionalityId, brand, search);
    },
    retry: 0,
  });
};

export const changeProductStatusRequest = () => {
  const request = async (payload) => {
    const response = await axiosAdmin.put("ProductAdmin/change_product_status", payload);
    return response.data;
  };

  return useMutation({
    mutationFn: request,
  });
};
