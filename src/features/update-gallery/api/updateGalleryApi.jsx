import axiosAdmin from "@/shared/api/axiosAdmin";
import { useMutation } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";

export const getGalleryByIdRequest = (id) => {
  const request = async (id) => {
    const response = await axiosAdmin.get("Gallery/GetById/" + id);
    return response.data;
  };

  return useQuery({
    queryKey: ["gallery", id],
    queryFn: () => request(id),
  });
};

export const changeGalleryStatusRequest = () => {
  const request = async (payload) => {
    const response = await axiosAdmin.put("Gallery/ChangeStatus/", payload);
    return response.data;
  };

  return useMutation({
    mutationFn: request,
  });
};

export const updateGalleryRequest = () => {
  const request = async (payload) => {
    const response = await axiosAdmin.put("Gallery", payload);
    return response.data;
  };

  return useMutation({
    mutationFn: request,
  });
};
