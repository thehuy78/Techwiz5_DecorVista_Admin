import { useSearchParams } from "react-router-dom";
import ConfirmPopUp from "@/shared/components/PopUp/ConfirmPopUp";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosAdmin from "@/shared/api/axiosAdmin";
import WebFont from "webfontloader";
import { useEffect } from "react";

export default function ForgotPassword() {
  let [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const encodedUserId = searchParams.get("id");

  const decodeBase64 = (encoded) => {
    return atob(encoded);
  };

  const request = async (userId) => {
    const response = await axiosAdmin.get("DesignerAdmin/ResetPassword", { params: { userId } });
    return response.data;
  };

  const decodedUserId = decodeBase64(encodedUserId);

  useEffect(() => {
    WebFont.load({
      google: {
        families: ["Open Sans"],
      },
    });
  }, []);

  return (
    <div>
      <ConfirmPopUp
        confirm={() => {
          request(decodedUserId).then(() => {
            alert("please check your mail for new password");
            navigate("/login");
          });
        }}
        cancel={() => navigate("/login")}
        message={"Do you want to reset your password"}
      />
    </div>
  );
}
