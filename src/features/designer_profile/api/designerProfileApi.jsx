import { useMutation, useQuery } from "@tanstack/react-query";
import axiosAdmin from "@/shared/api/axiosAdmin";

export const getDesignerProfileRequest = () => {
  const request = async () => {
    const response = await axiosAdmin.get("DesignerAdmin/designer_profile");
    return response.data;
  };

  return useQuery({
    queryKey: ["designer-profile"],
    queryFn: request,
  });
};

export const updateDesignerAvatarRequest = () => {
  const request = async (payload) => {
    const response = await axiosAdmin.put("DesignerAdmin/update_image", payload);
    return response.data;
  };

  return useMutation({
    mutationFn: request,
  });
};

export const updatePortfolioRequest = () => {
  const request = async (payload) => {
    const response = await axiosAdmin.put("DesignerAdmin/update_portfolio", payload);
    return response.data;
  };

  return useMutation({
    mutationFn: request,
  });
};

export const updateDowDesignerRequest = () => {
  const request = async (payload) => {
    const response = await axiosAdmin.put("DesignerAdmin/update_dow", payload);
    return response.data;
  };

  return useMutation({
    mutationFn: request,
  });
};

export const updateInfoDesignerRequest = () => {
  const request = async (payload) => {
    const response = await axiosAdmin.put("DesignerAdmin/update_info", payload);
    return response.data;
  };

  return useMutation({
    mutationFn: request,
  });
};

export const updateCertificateRequest = () => {
  const request = async (payload) => {
    const response = await axiosAdmin.put("DesignerAdmin/update_certificate", payload);
    return response.data;
  };

  return useMutation({
    mutationFn: request,
  });
};
