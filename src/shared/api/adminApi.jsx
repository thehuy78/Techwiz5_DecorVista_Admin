import axiosAdmin from "./axiosAdmin";
import { useQuery } from "@tanstack/react-query";

export const adminRequest = () => {
  const request = async () => {
    const response = await axiosAdmin.get("authadmin/admin");
    return response.data;
  };

  return useQuery({
    queryKey: ["admin"],
    queryFn: request,
    retry: 0,
  });
};
