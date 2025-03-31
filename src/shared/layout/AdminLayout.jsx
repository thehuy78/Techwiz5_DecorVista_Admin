import { Outlet } from "react-router-dom";
import styled, { css } from "styled-components";
import SideBar from "@/features/sidebar/SideBar";
import Header from "@/features/header/Header";
import { useEffect } from "react";
import WebFont from "webfontloader";
import { useState } from "react";
import { adminRequest } from "../api/adminApi";
import WaitingPopUp from "../components/PopUp/WaitingPopUp";
import { useNavigate } from "react-router-dom";
import { HubConnectionBuilder, LogLevel } from "@microsoft/signalr";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Bounce } from "react-toastify";
import { useRef } from "react";
import Cookies from "js-cookie";

const Container = styled.div`
  display: grid;
  grid-template-columns: 240px 1fr;
  min-height: 100vh;

  transition: all 0.1s;

  ${(props) => {
    if (props.$isSideBarSmall) {
      return css`
        grid-template-columns: 56px 1fr;
      `;
    }
  }}
`;

const AdminBody = styled.div`
  display: flex;
  flex-direction: column;
`;

const OutletContainer = styled.div`
  background-color: #f7f6f6;
`;

export default function AdminLayout() {
  const navigate = useNavigate();
  const [isSideBarSmall, setIsSideBarSmall] = useState(false);
  const admin = adminRequest();
  const connectionRef = useRef();
  const [newMessage, setNewMessage] = useState();

  useEffect(() => {
    WebFont.load({
      google: {
        families: ["Open Sans"],
      },
    });
  }, []);

  const notify = (message) =>
    toast.info(message, {
      position: "bottom-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
      transition: Bounce,
    });

  useEffect(() => {
    const startConnection = async () => {
      if (connectionRef.current) {
        await connectionRef.current.stop();
      }

      const conn = new HubConnectionBuilder()
        .withUrl("https://localhost:7229/chat")
        .configureLogging(LogLevel.Information)
        .build();

      try {
        await conn.start();

        await conn.invoke("JoinAdminRoom", {
          id: admin.data.data.id,
          email: admin.data.data.email,
        });

        conn.on("NotifyAdmin", (notifyMessage) => {
          if (!window.location.href.includes("chat")) {
            notify("New message from " + notifyMessage.email);
          } else {
            setNewMessage(notifyMessage);
          }
        });

        connectionRef.current = conn;
      } catch (error) {
        console.error("Something went wrong while starting the connection", error);
      }
    };

    if (admin.isSuccess && admin.data.status === 200 && !connectionRef.current) {
      startConnection();
    }

    return async () => {
      if (connectionRef.current) {
        await connectionRef.current.stop();
      }
    };
  }, [admin.isSuccess, admin.data?.status]);

  if (admin.isLoading) {
    return <WaitingPopUp />;
  }

  if (admin.isError) {
    navigate("/login");
    return;
  }

  if (admin.isSuccess && admin.data.status == 404) {
    navigate("/login");
    return;
  }

  if (
    admin.isSuccess &&
    admin.data.status == 200 &&
    admin.data.data.role == "designer" &&
    admin.data.data.interiordesigner.status == false
  ) {
    Cookies.remove("ADMIN_ACCESS_TOKEN");
    admin.refetch();
  }

  return (
    <>
      <Container $isSideBarSmall={isSideBarSmall}>
        <SideBar isSideBarSmall={isSideBarSmall} />

        <AdminBody>
          <Header isSideBarSmall={isSideBarSmall} setIsSideBarSmall={setIsSideBarSmall} />
          <OutletContainer>
            <Outlet context={{ newMessage, setNewMessage, connectionRef }} />
          </OutletContainer>
        </AdminBody>
      </Container>
      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
        transition:Bounce
      />
    </>
  );
}
