import axiosAdmin from "@/shared/api/axiosAdmin";
import { useMutation } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";

export const getAdminNotificationRequest = (type, pageNumber, pageSize) => {
  const request = async (type, pageNumber, pageSize) => {
    const response = await axiosAdmin.get("NotificationAdmin/admin_notification", {
      params: {
        type,
        pageNumber,
        pageSize,
      },
    });

    return response.data;
  };

  return useQuery({
    queryKey: ["admin_notification", type, pageNumber, pageSize],
    queryFn: () => request(type, pageNumber, pageSize),
  });
};

export const deleteNotificationRequest = () => {
  const request = async (payload) => {
    const response = await axiosAdmin.post("NotificationAdmin/delete_notification", payload);
    return response.data;
  };

  return useMutation({
    mutationFn: request,
  });
};

export const readNotificationRequest = () => {
  const request = async (payload) => {
    const response = await axiosAdmin.post("NotificationAdmin/mark_read_notification", payload);
    return response.data;
  };

  return useMutation({
    mutationFn: request,
  });
};

export const sendAdminNotificationRequest = () => {
  const request = async (payload) => {
    const response = await axiosAdmin.post("NotificationAdmin/send_notification", payload);
    return response.data;
  };

  return useMutation({
    mutationFn: request,
  });
};
