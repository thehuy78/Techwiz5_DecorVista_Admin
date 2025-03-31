import { createBrowserRouter } from "react-router-dom";
import AdminLayout from "./layout/AdminLayout";
import Dashboard from "@/features/dashboard/Dashboard";
import Login from "@/features/login/Login";
import CustomAdmin from "@/features/custom_admin/CustomAdmin";
import EmployeeList from "@/features/employee_list/EmployeeList";
import EmployeeUpdate from "@/features/employee_update/EmployeeUpdate";
import Product from "@/features/product/Product";
import DesignerRegister from "@/features/designer_register/DesignerRegister";
import PendingApprovedDesigner from "@/features/pending_approved_designer/PendingApprovedDesigner";
import DesignerList from "@/features/designer_list/DesignerList";
import DesignerProfile from "@/features/designer_profile/DesignerProfile";
import DesignerConsultation from "@/features/designer_consultation/DesignerConsultation";
import ProductList from "@/features/product_list/ProductList";
import ForgotPassword from "@/features/forgot_password/ForgotPassword";
import Forgot from "@/features/forgot/Forgot";
import Order from "@/features/Order/Order";
import OrderDetail from "@/features/OrderDetail/OrderDetail";
import Blogs from "@/features/blog/Blogs";
import CreateBlog from "@/features/blog/components/CreateBlog";
import Blog from "@/features/blog/components/Blog";
import AdminConsultationList from "@/features/admin_consultation_list/AdminConsultationList";
import PendingDesignerDetail from "@/features/pending_designer_detail/PendingDesignerDetail";
import DesignerDetail from "@/features/designer_detail/DesignerDetail";
import DesignerBlogs from "@/features/blog/components/DesignerBlogs";
import AddGallery from "@/features/add_gallery/AddGallery";
import UpdateGallery from "@/features/update-gallery/UpdateGallery";
import AdminGalleries from "@/features/admin_galleries/AdminGalleries";
import DesignerGalleries from "@/features/designer_galleries/DesignerGalleries";
import DesignerStories from "@/features/designer_stories/DesignerStories";
import AdminNotification from "@/features/admin_notification/AdminNotification";
import UpdateProduct from "@/features/update_product/UpdateProduct";
import DesignerNotification from "@/features/designer_notification/DesignerNotification";
import AdminStory from "@/features/admin_story/AdminStory";

const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <AdminLayout />,
      children: [
        {
          path: "/",
          element: <Dashboard />,
        },
        {
          path: "/custom_admin",
          element: <CustomAdmin />,
        },
        {
          path: "/employee_list",
          element: <EmployeeList />,
        },
        {
          path: "/employee_update",
          element: <EmployeeUpdate />,
        },
        {
          path: "/new_product",
          element: <Product />,
        },
        {
          path: "/product_list",
          element: <ProductList />,
        },
        {
          path: "/pending_approved_designer",
          element: <PendingApprovedDesigner />,
        },
        {
          path: "/designer_list",
          element: <DesignerList />,
        },
        {
          path: "/designer_profile",
          element: <DesignerProfile />,
        },
        {
          path: "/consultion_list",
          element: <DesignerConsultation />,
        },
        {
          path: "/list_gallery_admin",
          element: <AdminGalleries />,
        },
        {
          path: "/list_gallery_designer",
          element: <DesignerGalleries />,
        },
        {
          path: "/list_order",
          element: <Order />,
        },
        {
          path: "/update_gallery",
          element: <UpdateGallery />,
        },
        {
          path: "/order_detail",
          element: <OrderDetail />,
        },
        {
          path: "/blog",
          element: <Blogs />,
        },
        {
          path: "/getblogbyid",
          element: <Blog />,
        },
        {
          path: "/create_blog",
          element: <CreateBlog />,
        },
        {
          path: "/admin_consultion_list",
          element: <AdminConsultationList />,
        },
        {
          path: "/pending_detail",
          element: <PendingDesignerDetail />,
        },
        {
          path: "/designer_detail",
          element: <DesignerDetail />,
        },
        {
          path: "/designer_blogs",
          element: <DesignerBlogs />,
        },
        {
          path: "/add_gallery",
          element: <AddGallery />,
        },
        {
          path: "/stories",
          element: <DesignerStories />,
        },
        {
          path: "/admin_notification",
          element: <AdminNotification />,
        },
        {
          path: "/designer_notification",
          element: <DesignerNotification />,
        },
        {
          path: "/update_product",
          element: <UpdateProduct />,
        },
        {
          path: "/admin_story",
          element: <AdminStory />,
        },
      ],
    },
    {
      path: "/forgotPassword",
      element: <ForgotPassword />,
    },
    {
      path: "/forgot",
      element: <Forgot />,
    },
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/designer_register",
      element: <DesignerRegister />,
    },
  ],
  { basename: "/techwiz_admin" }
);

export default router;
