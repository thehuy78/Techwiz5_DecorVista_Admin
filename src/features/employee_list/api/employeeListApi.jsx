import axiosAdmin from "@/shared/api/axiosAdmin";
import { useQuery } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";

export const getEmployeeRequest = (pageNumber, pageSize) => {
  const request = async (pageNumber, pageSize) => {
    const response = await axiosAdmin.get("EmployeeAdmin/get_employee", {
      params: {
        pageNumber,
        pageSize,
      },
    });

    return response.data;
  };

  return useQuery({
    queryKey: ["employees", pageNumber, pageSize],
    queryFn: () => {
      return request(pageNumber, pageSize);
    },
  });
};

export const changeEmployeeActiveRequest = () => {
  const request = async (payload) => {
    const response = await axiosAdmin.put("EmployeeAdmin/change_active", payload);
    return response.data;
  };

  return useMutation({
    mutationFn: request,
  });
};

export const changeEmployeePermissionRequest = () => {
  const request = async (payload) => {
    const response = await axiosAdmin.put("EmployeeAdmin/change_permission", payload);
    return response.data;
  };

  return useMutation({
    mutationFn: request,
  });
};
