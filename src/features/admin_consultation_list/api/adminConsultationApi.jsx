import axiosAdmin from "@/shared/api/axiosAdmin";
import { useQuery } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";

export const getAdminConsultationRequest = (pageNumber, pageSize, status) => {
  const request = async () => {
    const response = await axiosAdmin.get("ConsultationAdmin/consultation_list", {
      params: {
        pageNumber,
        pageSize,
        status,
      },
    });

    return response.data;
  };

  return useQuery({
    queryKey: ["designer-consultation", pageNumber, pageSize, status],
    queryFn: () => {
      return request(pageNumber, pageSize, status);
    },
  });
};
