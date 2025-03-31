import { useQuery } from "@tanstack/react-query";
import axiosAdmin from "@/shared/api/axiosAdmin";
import qs from "qs";

export const getAdminGalleriesRequest = (
  pageNumber,
  pageSize,
  status,
  by,
  designerName,
  colorTone,
  name
) => {
  const request = async () => {
    const response = await axiosAdmin.get("Gallery/get_admin_galleries", {
      params: { pageNumber, pageSize, status, by, designerName, colorTone, name },
      paramsSerializer: (params) => qs.stringify(params, { arrayFormat: "repeat" }),
    });

    return response.data;
  };

  return useQuery({
    queryKey: ["admin_galleries", pageNumber, pageSize, status, by, designerName, colorTone, name],
    queryFn: () => request(pageNumber, pageSize, status, by, designerName, colorTone, name),
  });
};
