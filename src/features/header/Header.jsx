import styled from "styled-components";
import Avatar from "react-avatar";
import { useState } from "react";
import { CiUser } from "react-icons/ci";
import { CiLogout } from "react-icons/ci";
import { useEffect } from "react";
import { useRef } from "react";
import { FaBars } from "react-icons/fa6";
import { FaArrowRight } from "react-icons/fa6";
import sidebar_content from "../sidebar/data/sidebar_content";
import { useLocation } from "react-router-dom";
import TextInput from "@/shared/components/Input/TextInput";
import { Link } from "react-router-dom";
import { adminRequest } from "@/shared/api/adminApi";
import Cookies from "js-cookie";
import getFirebaseImageUrl from "@/shared/utils/getFireBaseImage";
import PopUp from "@/shared/components/PopUp/PopUp";
import Button1 from "@/shared/components/Button/Button1";
import { changePasswordRequest } from "./api/resetPasswordApi";

const Container = styled.div`
  position: sticky;
  top: 0;
  z-index: 1;
  background-color: white;
  display: flex;
  justify-content: space-between;
  height: 4.8rem;
  align-items: center;
  padding: 0 1rem;

  & p {
    margin: 0;
  }
`;

const Left = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  width: max-content;
`;

const Right = styled.div``;

const ProfileGroup = styled.div`
  position: relative;
`;

const Profile = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;

  & p {
    font-size: 12px;
    text-align: end;
  }
`;

const HideShowButton = styled.div`
  cursor: pointer;

  & svg {
    font-size: 20px;
  }
`;

const DropDown = styled.div`
  position: absolute;
  background-color: white;
  box-shadow: rgba(0, 0, 0, 0.16) 0px 1px 4px;
  margin-top: 1rem;
  width: 7rem;
  transform: translateX(10px);
  width: max-content;
`;

const DropDownButton = styled.button`
  display: flex;
  width: 100%;
  align-items: center;
  gap: 1rem;
  background-color: white;

  border: none;
  font-size: 14px;
  padding: 0.5rem;
  cursor: pointer;
  color: #4066d5;

  &:hover {
    color: black;
    background-color: #f4f5f7;
  }
`;

const CustomTextInput = styled(TextInput)`
  width: auto;
  padding: 6px;

  &:focus + div {
    display: block;
  }
`;

const SearchBox = styled.div`
  position: relative;
`;

const SearchOptions = styled.div`
  display: none;
  position: absolute;
  box-shadow: rgba(0, 0, 0, 0.16) 0px 1px 4px;
  width: 100%;

  &:hover {
    display: block;
  }
  background-color: white;
`;
const SearchOption = styled(Link)`
  width: 100%;
  padding: 0.5rem;
  cursor: pointer;
  color: black;
  text-decoration: none;
  display: block;

  &:hover {
    background-color: #f7f6f6;
  }

  display: flex;
  flex-direction: column;

  > p {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 0 1rem;

    > svg {
      font-size: 20px;
    }
  }
`;

export default function Header({ isSideBarSmall, setIsSideBarSmall }) {
  const [isPopUp, setIsPopUp] = useState(false);
  const location = useLocation();
  const [dropDown, setDropDown] = useState(false);
  const dropDownRef = useRef();
  const dropDownButton = useRef();
  const [currentPage, setCurrentPage] = useState();
  const [search, setSearch] = useState("");
  const admin = adminRequest();

  const edited_sidebar = [];
  for (let item of sidebar_content) {
    if (item.children == null) {
      edited_sidebar.push(item);
    }

    if (item.children != null) {
      for (let children of item.children) {
        edited_sidebar.push(children);
      }
    }
  }

  useEffect(() => {
    const event = (ev) => {
      if (
        dropDownRef.current &&
        !dropDownRef.current.contains(ev.target) &&
        !dropDownButton.current.contains(ev.target)
      ) {
        setDropDown((prev) => !prev);
      }
    };

    document.addEventListener("mousedown", event);

    return () => {
      document.removeEventListener("mousedown", event);
    };
  }, []);

  useEffect(() => {
    for (let item of sidebar_content) {
      if (item.link == location.pathname) {
        setCurrentPage(item.name);
      }

      if (item.children != null) {
        for (let child of item.children) {
          if (child.link == location.pathname) {
            setCurrentPage(child.name);
          }
        }
      }
    }
  }, [location.pathname]);

  const onLogout = () => {
    Cookies.remove("ADMIN_ACCESS_TOKEN");
    admin.refetch();
  };

  return (
    <>
      <Container>
        <Left>
          <HideShowButton onClick={() => setIsSideBarSmall((prev) => !prev)}>
            {!isSideBarSmall ? <FaBars /> : <FaArrowRight />}
          </HideShowButton>
          <p>{currentPage}</p>
        </Left>
        <Right>
          <ProfileGroup ref={dropDownButton}>
            <Profile onClick={() => setDropDown((prev) => !prev)}>
              <div>
                <p>{admin.data.data.userdetails ? "Admin" : "Designer"}</p>
                <h5>
                  {(admin.data.data.userdetails
                    ? admin.data.data.userdetails.first_name
                    : admin.data.data.interiordesigner.first_name) +
                    " " +
                    (admin.data.data.userdetails
                      ? admin.data.data.userdetails.last_name
                      : admin.data.data.interiordesigner.last_name)}
                </h5>
              </div>
              <Avatar
                name={
                  admin.data.data.userdetails != null
                    ? admin.data.data.userdetails.first_name
                    : admin.data.data.interiordesigner.first_name
                }
                src={getFirebaseImageUrl(
                  admin.data.data.userdetails
                    ? admin.data.data.userdetails.avatar
                    : admin.data.data.interiordesigner.avatar
                )}
                size="40"
                round
              />
            </Profile>
            {dropDown && (
              <DropDown ref={dropDownRef}>
                <DropDownButton onClick={() => setIsPopUp(true)}>Reset password</DropDownButton>
                <DropDownButton onClick={onLogout}>
                  <CiLogout />
                  Log out
                </DropDownButton>
              </DropDown>
            )}
          </ProfileGroup>
        </Right>
      </Container>
      {isPopUp && <ResetPopUp action={() => setIsPopUp(false)} />}
    </>
  );
}

const CustomPopup = styled(PopUp)`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 1rem;
`;

function ResetPopUp({ action }) {
  const [previous, setPrevious] = useState();
  const [newPassword, setNewPassword] = useState();
  const [confirm, setConfirm] = useState();

  const changePassword = changePasswordRequest();

  const onResetPassword = () => {
    if (!newPassword || !previous) {
      alert("input password");
      return;
    }

    if (newPassword && newPassword != confirm) {
      alert("wrong password confirm");
      return;
    }
    const formData = new FormData();
    formData.append("previous", previous);
    formData.append("newPassword", newPassword);

    changePassword.mutate(formData, {
      onSuccess: (response) => {
        if (response.status == 200) {
          window.alert("success");
          action();
        } else {
          console.log(response);
          window.alert("wrong password");
        }
      },
    });
  };

  return (
    <CustomPopup action={() => {}}>
      <div>
        <label>Previous password</label>
        <TextInput type="password" state={previous} setState={setPrevious} />
      </div>
      <div>
        <label>New password</label>
        <TextInput type="password" state={newPassword} setState={setNewPassword} />
      </div>
      <div>
        <label>Password confirm</label>
        <TextInput type="password" state={confirm} setState={setConfirm} />
      </div>
      <ButtonContainer>
        <Button1 onClick={onResetPassword}>Reset Password</Button1>
        <Button1 onClick={action}>Cancel</Button1>
      </ButtonContainer>
    </CustomPopup>
  );
}
