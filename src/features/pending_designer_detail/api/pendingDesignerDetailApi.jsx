import axiosAdmin from "@/shared/api/axiosAdmin";
import { useQuery } from "@tanstack/react-query";

export const getDesignerDetailRequest = (designerId) => {
  const request = async () => {
    const response = await axiosAdmin.get("DesignerAdmin/get_unapproved_designer", {
      params: { designerId },
    });
    return response.data;
  };

  return useQuery({
    queryKey: ["unapprove", designerId],
    queryFn: () => {
      return request(designerId);
    },
  });
};
