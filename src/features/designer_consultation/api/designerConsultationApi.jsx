import axiosAdmin from "@/shared/api/axiosAdmin";
import { useQuery } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";

export const getDesignerConsultationRequest = (pageNumber, pageSize, status, from, to, search) => {
  const request = async (pageNumber, pageSize, status, from, to, search) => {
    const response = await axiosAdmin.get("ConsultationAdmin/designer_consultation_list", {
      params: {
        pageNumber,
        pageSize,
        status,
        from: from ? `${from.getFullYear()}-${from.getMonth() + 1}-${from.getDate()}` : null,
        to: to ? `${to.getFullYear()}-${to.getMonth() + 1}-${to.getDate()}` : null,
        search,
      },
    });

    return response.data;
  };

  return useQuery({
    queryKey: ["designer-consultation", pageNumber, pageSize, status, from, to, search],
    queryFn: () => {
      return request(pageNumber, pageSize, status, from, to, search);
    },
  });
};

export const aproveConsultationRequest = () => {
  const request = async (payload) => {
    const response = await axiosAdmin.put(
      "ConsultationAdmin/designer_approve_consultation",
      payload
    );
    return response.data;
  };

  return useMutation({
    mutationFn: request,
  });
};

export const denyConsultationRequest = () => {
  const request = async (payload) => {
    const response = await axiosAdmin.put("ConsultationAdmin/designer_deny_consultation", payload);
    return response.data;
  };

  return useMutation({
    mutationFn: request,
  });
};

export const finishConsultationRequest = () => {
  const request = async (payload) => {
    const response = await axiosAdmin.put(
      "ConsultationAdmin/designer_finished_consultation",
      payload
    );
    return response.data;
  };

  return useMutation({
    mutationFn: request,
  });
};

export const getCustomerOrderListRequest = (pageNumber, pageSize, userId) => {
  const request = async () => {
    const response = await axiosAdmin.get("OrderAdmin/get_user_order_history", {
      params: {
        pageNumber,
        pageSize,
        userId,
      },
    });

    return response.data;
  };

  return useQuery({
    queryKey: ["user_order_list", pageNumber, pageSize, userId],
    queryFn: () => {
      return request(pageNumber, pageSize, userId);
    },
  });
};
