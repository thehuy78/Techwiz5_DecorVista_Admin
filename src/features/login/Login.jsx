import { useState } from "react";
import styled from "styled-components";
import TextInput from "@/shared/components/Input/TextInput";
import WebFont from "webfontloader";
import { useEffect } from "react";
import { loginRequest } from "./api/loginApi";
import Cookies from "js-cookie";
import SuccessPopUp from "@/shared/components/PopUp/SuccessPopUp";
import { useNavigate } from "react-router-dom";
import ErrorPopUp from "@/shared/components/PopUp/ErrorPopUp";
import Button1 from "@/shared/components/Button/Button1";
import background from "./assets/images/background.jpg";
import { adminRequest } from "@/shared/api/adminApi";

const Container = styled.div`
  height: 100vh;

  background: url(${background});

  & h5 {
    font-size: 16px;
    font-weight: 600;
  }
`;

const LoginForm = styled.form`
  background-color: white;
  box-shadow: rgba(0, 0, 0, 0.02) 0px 1px 3px 0px, rgba(27, 31, 35, 0.15) 0px 0px 0px 1px;
  padding: 1rem;
  position: absolute;
  left: 50%;
  transform: translate(-50%, 5rem);
  display: flex;
  flex-direction: column;
  gap: 1rem;
  border-radius: 5px;
`;

const InputContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.6rem;

  > label {
    font-size: 17px;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: flex-end;
  gap: 1rem;

  > p {
    &:hover {
      text-decoration: underline;
    }
    cursor: pointer;
  }

  > button {
    /* background-color: white;
    border: 1px solid blue; */
  }
`;

const CustomInput = styled(TextInput)`
  padding: 6px;
  width: 20rem;
  height: 3rem;
`;

const HeaderContainer = styled.div`
  display: flex;
  justify-content: flex-end;

  padding: 2rem;
`;

const EmailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Login() {
  const admin = adminRequest();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [isWrongAccount, setIsWrongAccount] = useState(false);
  const [isNotActive, setIsNotActive] = useState(false);
  const [errors, setErrors] = useState({});

  const login = loginRequest();

  useEffect(() => {
    WebFont.load({
      google: {
        families: ["Open Sans"],
      },
    });
  }, []);

  const onLogin = (ev) => {
    ev.preventDefault();

    let isOk = true;

    if (!email) {
      setErrors((prev) => {
        return { ...prev, email: "Email cannot be empty" };
      });
      isOk = false;
    } else {
      setErrors((prev) => {
        return { ...prev, email: null };
      });
    }

    if (email && !EmailRegex.test(email)) {
      setErrors((prev) => {
        return { ...prev, email_pattern: "Wrong pattern of email" };
      });
      isOk = false;
    } else {
      setErrors((prev) => {
        return { ...prev, email_pattern: null };
      });
    }

    if (!password) {
      setErrors((prev) => {
        return { ...prev, password: "Password cannot be empty" };
      });
      isOk = false;
    } else {
      setErrors((prev) => {
        return { ...prev, password: null };
      });
    }

    if (isOk) {
      const formData = new FormData();

      formData.append("email", email);
      formData.append("password", password);

      login.mutate(formData, {
        onSuccess: (response) => {
          if (response.status == 200) {
            Cookies.set("ADMIN_ACCESS_TOKEN", response.data);
            setIsSuccess(true);
          }

          if (response.status == 403) {
            setIsNotActive(response.message);
            return;
          }

          if (response.status == 401) {
            setIsNotActive(response.message);
            return;
          }

          if (response.status == 404) {
            setIsWrongAccount(true);
            return;
          }
        },
        onError: (error) => {
          console.log(error);
          alert("error");
        },
      });
    }
  };

  return (
    <>
      <Container>
        <HeaderContainer>
          <Button1
            onClick={() => {
              navigate("/designer_register");
            }}
          >
            Become a Designer
          </Button1>
        </HeaderContainer>
        <LoginForm>
          <InputContainer>
            <label>Email</label>
            <CustomInput state={email} setState={setEmail} />
          </InputContainer>
          {errors.email && <h5>{errors.email}</h5>}
          {errors.email_pattern && <h5>{errors.email_pattern}</h5>}
          <InputContainer>
            <label>Password</label>
            <CustomInput type={"password"} state={password} setState={setPassword} />
          </InputContainer>
          {errors.password && <h5>{errors.password}</h5>}
          <ButtonContainer>
            <p onClick={() => navigate("/forgot")}>Forgot your password</p>
            <Button1 onClick={onLogin}>Login</Button1>
          </ButtonContainer>
        </LoginForm>
      </Container>
      {isSuccess && <SuccessPopUp message={"login success"} action={() => navigate("/")} />}
      {isWrongAccount && (
        <ErrorPopUp
          message={"Wrong username or password"}
          action={() => setIsWrongAccount(false)}
        />
      )}
      {isNotActive && <ErrorPopUp message={isNotActive} action={() => setIsNotActive(false)} />}
    </>
  );
}
