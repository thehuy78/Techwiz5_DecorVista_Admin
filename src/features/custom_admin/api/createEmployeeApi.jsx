import { useMutation } from "@tanstack/react-query";
import axiosAdmin from "@/shared/api/axiosAdmin";

export const createEmployeeRequest = () => {
  const request = async (payload) => {
    const response = await axiosAdmin.post("employeeadmin/create_employee", payload);
    return response.data;
  };

  return useMutation({
    mutationFn: request,
  });
};
