import axiosAdmin from "@/shared/api/axiosAdmin";
import { useQuery } from "@tanstack/react-query";

export const getApprovedDesignerDetailRequest = (designerId) => {
  const request = async () => {
    const response = await axiosAdmin.get("DesignerAdmin/get_approved_designer", {
      params: { designerId },
    });
    return response.data;
  };

  return useQuery({
    queryKey: ["approve", designerId],
    queryFn: () => {
      return request(designerId);
    },
  });
};
