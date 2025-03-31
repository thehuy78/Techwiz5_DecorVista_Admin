import axiosAdmin from "@/shared/api/axiosAdmin";
import { useQuery } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";
import qs from "qs";
export const getAllBlog = () => {
  const request = async () => {
    const response = await axiosAdmin.get("blog");
    return response.data;
  };

  return useQuery({
    queryKey: ["blogs"],
    queryFn: request,
  });
};

const getBlogByUserId = async (ownerBlogId) => {
  const response = await axiosAdmin.get("blog/getblogbyuserid?ownerBlogId=" + ownerBlogId);
  return response.data;
};

export function GetAllBlogByUser(ownerBlogId) {
  return useQuery({
    queryKey: ["allBlogByUser", ownerBlogId],
    queryFn: () => getBlogByUserId(ownerBlogId), // Pass ownerBlogId to the function
  });
}
const getBlogById = async (id) => {
  const response = await axiosAdmin.get("blog/getblogbyid?id=" + id);
  return response.data;
};
export function GetBlogById(id) {
  return useQuery({
    queryKey: ["getBlogById", id],
    queryFn: () => getBlogById(id), // Pass ownerBlogId to the function
  });
}

const filterBlogByStatus = async (pageNumber, pageSize, status, by, designerName, name) => {
  const response = await axiosAdmin.get("blog/getblogbystatus", {
    params: {
      pageNumber,
      pageSize,
      status,
      by,
      designerName,
      name,
    },
    paramsSerializer: (params) => qs.stringify(params, { arrayFormat: "repeat" }),
  });
  return response.data;
};

export function FilterBlogByStatus(pageNumber, pageSize, status, by, designerName, name) {
  return useQuery({
    queryKey: ["filterBlogByStatus", pageNumber, pageSize, status, by, designerName, name],
    queryFn: () => filterBlogByStatus(pageNumber, pageSize, status, by, designerName, name),
  });
}

const activeBlog = async (payload) => {
  const response = await axiosAdmin.put("blog/activeBlog", payload);
  return response.data;
};

export function ActiveBlog() {
  const activeMutation = useMutation({
    mutationFn: activeBlog,
  });

  return activeMutation;
}
const getBlogByTitle = async (text) => {
  const response = await axiosAdmin.get("blog/getblogbytitle?title=" + text);
  return response.data;
};
export function FilterBlogByName(text) {
  return useQuery({
    queryKey: ["filterBlogByTitle", text],
    queryFn: () => getBlogByTitle(text), // Pass ownerBlogId to the function
  });
}
const createBlog = async (payload) => {
  const response = await axiosAdmin.post("blog", payload);
  return response.data;
};
export const CreateBlogMutation = () => {
  const blogMutation = useMutation({
    mutationFn: createBlog,
    onSuccess: () => {
      //   queryClient.invalidateQueries({ queryKey: ["Blog"] });
      //thay bằng onSuccess bên nút submit
    },
  });

  return blogMutation;
};

export const updateBlogRequest = () => {
  const request = async (payload) => {
    const response = await axiosAdmin.put("blog/update_blog", payload);
    return response.data;
  };

  return useMutation({
    mutationFn: request,
  });
};

export const getBlogByDesignerRequest = (pageNumber, pageSize, status, name) => {
  const request = async () => {
    const response = await axiosAdmin.get("Blog/get_blog_by_designer", {
      params: {
        pageNumber,
        pageSize,
        status,
        name,
      },
    });
    return response.data;
  };

  return useQuery({
    queryKey: ["designer_blog", pageNumber, pageSize, status, name],
    queryFn: () => request(pageNumber, pageSize, status, name),
  });
};
