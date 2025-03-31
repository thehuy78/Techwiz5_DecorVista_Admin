import axiosAdmin from "@/shared/api/axiosAdmin";
import { useMutation, useQuery } from "@tanstack/react-query";

export const getEmployeeByIdRequest = (employeeId) => {
  const request = async (employeeId) => {
    const response = await axiosAdmin.get("EmployeeAdmin/get_employee_by_id", {
      params: { employeeId },
    });

    return response.data;
  };

  return useQuery({
    queryKey: ["employee", employeeId],
    queryFn: () => {
      return request(employeeId);
    },
  });
};

export const updateEmployeeAvatarRequest = () => {
  const request = async (payload) => {
    const response = await axiosAdmin.put("EmployeeAdmin/update_employee_avatar", payload);
    return response.data;
  };

  return useMutation({
    mutationFn: request,
  });
};

export const updateEmployeeRequest = () => {
  const request = async (payload) => {
    const response = await axiosAdmin.put("EmployeeAdmin/update_employee", payload);
    return response.data;
  };

  return useMutation({
    mutationFn: request,
  });
};
