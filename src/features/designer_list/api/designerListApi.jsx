import axiosAdmin from "@/shared/api/axiosAdmin";
import { useMutation, useQuery } from "@tanstack/react-query";

export const getApprovedDesignerRequest = (
  pageNumber,
  pageSize,
  year,
  status,
  specialize,
  search
) => {
  const request = async (pageNumber, pageSize, year, status, specialize, search) => {
    const response = await axiosAdmin.get("DesignerAdmin/approved_list", {
      params: { pageNumber, pageSize, year, status, specialize, search },
    });

    return response.data;
  };

  return useQuery({
    queryKey: ["approved-list", pageNumber, pageSize, year, status, specialize, search],
    queryFn: () => {
      return request(pageNumber, pageSize, year, status, specialize, search);
    },
    retry: 0,
  });
};

export const changeDesignerStatusRequest = () => {
  const request = async (payload) => {
    const response = await axiosAdmin.put("DesignerAdmin/change_status", payload);
    return response.data;
  };

  return useMutation({
    mutationFn: request,
  });
};
