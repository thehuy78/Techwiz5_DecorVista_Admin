import axiosAdmin from "@/shared/api/axiosAdmin";
import { useQuery } from "@tanstack/react-query";

export const getProductQuerySelect = () => {
  const request = async () => {
    const response = await axiosAdmin.get("ProductAdmin/GetSelect");
    return response.data;
  };

  return useQuery({
    queryKey: ["select-product"],
    queryFn: request,
  });
};
