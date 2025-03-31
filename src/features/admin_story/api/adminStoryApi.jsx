import axiosAdmin from "@/shared/api/axiosAdmin";
import { useMutation, useQuery } from "@tanstack/react-query";

export const getAdminStoryRequest = (pageNumber, pageSize, date, status, designerName) => {
  const request = async (pageNumber, pageSize, date, status, designerName) => {
    const response = await axiosAdmin.get("StoryAdmin/get_story_admin", {
      params: {
        pageNumber,
        pageSize,
        from: date.startDate
          ? `${date.startDate.getFullYear()}-${
              date.startDate.getMonth() + 1
            }-${date.startDate.getDate()}`
          : null,
        to: date.endDate
          ? `${date.endDate.getFullYear()}-${date.endDate.getMonth() + 1}-${date.endDate.getDate()}`
          : null,
        status,
        designerName,
      },
    });

    return response.data;
  };

  return useQuery({
    queryKey: ["admin_story", pageNumber, pageSize, date, status, designerName],
    queryFn: () => request(pageNumber, pageSize, date, status, designerName),
  });
};

export const changeStoryStatusRequest = () => {
  const request = async (payload) => {
    const response = await axiosAdmin.put("StoryAdmin/update_status", payload);
    return response.data;
  };

  return useMutation({
    mutationFn: request,
  });
};
