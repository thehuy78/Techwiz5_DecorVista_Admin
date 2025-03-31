import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import background from "./assets/forgot.jpg";
import { HiOutlineArrowUturnLeft } from "react-icons/hi2";
import WebFont from "webfontloader";
import { sendRequestToReset } from "./api/forgotApi";
import SuccessPopUp from "@/shared/components/PopUp/SuccessPopUp";
import { useNavigate } from "react-router-dom";
import ErrorPopUp from "@/shared/components/PopUp/ErrorPopUp";

const Container = styled.div`
  .forgot_password_page {
    width: 100%;
    height: 100vh;

    display: flex;
    justify-content: right;
    align-items: center;
    padding: 2rem;
    background-image: url(${background});
    background-position: left bottom;
    background-repeat: no-repeat;
    background-size: contain;
    .back_to_home {
      & svg {
        font-size: 28px;
      }
      position: absolute;
      inset: 0;
      width: 3rem;
      height: 3rem;
      padding: 0.5rem;
      background-color: black;
      display: flex;
      justify-content: center;
      align-items: center;
      border-bottom-right-radius: 0.5rem;
      i {
        transform: rotate(180deg);
        color: white;
        font-size: 1.5rem;
      }
    }
    form {
      background-color: white;
      padding: 2rem 3rem;
      .title_1 {
        font-size: 4rem;
        color: rgb(35, 38, 47);
        font-weight: 900;
        letter-spacing: 0.2rem;
        font-family: serif;
      }
      .title_2 {
        font-size: 4rem;
        color: rgb(35, 38, 47);
        font-weight: 900;
        letter-spacing: 0.2rem;
        font-family: serif;
      }
      .form_group {
        padding-top: 4rem;
        display: flex;
        padding-bottom: 1rem;
        flex-direction: column;
        label {
          font-weight: 700;
          font-size: 1.3rem;
          color: rgba(0, 0, 0, 0.4);
        }
        input {
          font-size: 1.2rem;
          line-height: 1.6rem;
          padding: 0.5rem;
          box-shadow: 0.1rem 0.1rem 0.2rem rgba(0, 0, 0, 0.4);
          outline: none;
          border: none;
          background-color: rgba(128, 128, 128, 0.096);
          border-bottom: 0.1rem solid gray;
          &::placeholder {
            font-size: 0.8rem;
            font-weight: 700;
            color: rgba(0, 0, 0, 0.4);
          }
        }
      }
      .form_btn {
        display: flex;
        width: 100%;
        padding: 1rem 0;
        input {
          width: 100%;
          padding: 0.7rem;
          border: none;
          background-color: black;
          font-weight: 800;
          outline: none;
          color: white;
          border-radius: 0.4rem;
          transition: 0.3s ease-in;
          cursor: pointer;
          box-shadow: 0.1rem 0.1rem 0.2rem rgba(0, 0, 0, 0.4);
        }
        input:hover {
          transform: scale(1.02);
        }
        input:active {
          transform: scale(0.98);
        }
      }
    }
  }
`;

export default function Forgot() {
  const [isError, setIsError] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const sendRequest = sendRequestToReset();
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    WebFont.load({
      google: {
        families: ["Open Sans"],
      },
    });
  }, []);

  const onSendRequest = (ev) => {
    ev.preventDefault();

    const formData = new FormData();

    formData.append("email", email);

    sendRequest.mutate(formData, {
      onSuccess: (response) => {
        console.log(response);
        if (response.status == 200) {
          setIsSuccess(true);
        }

        if (response.status == 400) {
          setIsError(true);
        }
      },
      onError: (error) => {
        console.log(error);
        setIsError(true);
      },
    });
  };

  return (
    <>
      <Container>
        <div className="forgot_password_page">
          <form onSubmit={onSendRequest}>
            <p className="title_1">Forgot</p>
            <p className="title_2">Your Password</p>
            <div className="form_group">
              <label>Email address:</label>
              <input
                value={email}
                onChange={(ev) => setEmail(ev.target.value)}
                type="email"
                placeholder="Input email reset password"
              />
            </div>
            <div className="form_btn">
              <input type="submit" value={"Reset Password"} />
            </div>
          </form>
          <Link to={"/login"} className="back_to_home">
            <span class="fa-solid fa-right-to-bracket">
              <HiOutlineArrowUturnLeft />
            </span>
          </Link>
        </div>
      </Container>
      {isSuccess && <SuccessPopUp message={"Success"} action={() => navigate("/login")} />}
      {isError && <ErrorPopUp message={"Email not exist"} action={() => setIsError()} />}
    </>
  );
}
