import styled from "styled-components";
import { useState } from "react";
import TextInput from "@/shared/components/Input/TextInput";
import SelectInput from "@/shared/components/Input/SelectInput";
import NumberInput from "@/shared/components/Input/NumberInput";
import { useRef } from "react";
import Avatar from "react-avatar";
import Button1 from "@/shared/components/Button/Button1";
import ErrorPopUp from "@/shared/components/PopUp/ErrorPopUp";
import SuccessPopUp from "@/shared/components/PopUp/SuccessPopUp";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import AlertPopUp from "@/shared/components/PopUp/AlertPopUp";
import WaitingPopUp from "@/shared/components/PopUp/WaitingPopUp";
import { getEmployeeByIdRequest } from "./api/employeeUpdateApi";
import { useSearchParams } from "react-router-dom";
import { useEffect } from "react";
import notfound from "@/shared/assets/images/404.png";
import default_avatar from "@/shared/assets/images/default_avatar.jpg";
import { updateEmployeeAvatarRequest } from "./api/employeeUpdateApi";
import { updateEmployeeRequest } from "./api/employeeUpdateApi";
import getFirebaseImageUrl from "@/shared/utils/getFireBaseImage";

const Container = styled.div`
  background-color: white;
  margin: 2rem;
  padding: 2rem;

  & span {
    color: red;
  }
`;

const Form = styled.form`
  display: grid;
  grid-template-columns: 2fr 1fr;

  align-items: center;
  gap: 4rem;
`;

const LeftForm = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const RightForm = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: center;
  border-left: 1px solid rgba(0, 0, 0, 0.1);
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
`;

const InputContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 10px 0;
`;

const Images = styled.div`
  > input {
    display: none;
  }
`;

const GenderDobContainer = styled.div`
  display: grid;
  grid-template-columns: 150px auto;
  align-items: center;
  gap: 3rem;
`;

const DatePickerStyled = styled(DatePicker)`
  padding: 0;
  margin: 0;
  outline: none;
`;

const DateContainer = styled.div`
  display: flex;
  flex-direction: column;
  > label {
    margin-bottom: 10px;
  }
`;

const NotFound = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const options = [
  { value: "Male", label: "Male" },
  { value: "Female", label: "Female" },
];

const EmailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PasswordRegex = /^[A-Za-z0-9]{6,}$/;

export default function EmployeeUpdate() {
  const fileRef = useRef();
  const updateEmployeeAvatar = updateEmployeeAvatarRequest();
  const updateEmployee = updateEmployeeRequest();
  let [searchParams, setSearchParams] = useSearchParams();
  const getEmployeeById = getEmployeeByIdRequest(searchParams.get("employeeId"));

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeat, setRepeat] = useState("");
  const [name, setName] = useState("");
  const [dob, setDob] = useState(new Date());
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [gender, setGender] = useState(options[0]);
  const [avatar, setAvatar] = useState("");

  const [errors, setErrors] = useState({});
  const [imageError, setImageError] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [alert, setAlert] = useState("");

  useEffect(() => {
    if (getEmployeeById.isSuccess && getEmployeeById.data.status == 200) {
      const data = getEmployeeById.data.data;

      setEmail(data.email);

      if (!name) {
        setName(data.fullName);
      }
      if (!phone) {
        setPhone(data.phoneNumber);
      }

      if (!dob) {
        setDob(new Date(data.dob));
      }
      setGender(data.gender == "Male" ? options[0] : options[1]);

      setAvatar(data.avatar);
    }
  }, [getEmployeeById.status, getEmployeeById.fetchStatus]);

  if (getEmployeeById.isLoading) {
    return <WaitingPopUp />;
  }

  if (getEmployeeById.isSuccess && getEmployeeById.data.status == 404) {
    return (
      <Container>
        <NotFound>
          <img src={notfound} />
        </NotFound>
      </Container>
    );
  }

  const onClickSelectImage = () => {
    fileRef.current.click();
  };

  const handleImageChange = (ev) => {
    const allowedFileTypes = ["image/jpeg", "image/png", "image/gif", "image/jpg"];
    const maxFileSize = 1 * 1024 * 1024;

    if (ev.target.files.length > 0) {
      const isValidFileType = Array.from(ev.target.files).every((file) =>
        allowedFileTypes.includes(file.type)
      );

      const isValidFileSize = Array.from(ev.target.files).every((file) => file.size <= maxFileSize);

      if (!isValidFileType) {
        setImageError("Invalid file type. Please upload an image of type JPEG, PNG, GIF or JPG.");
        return;
      }

      if (!isValidFileSize) {
        setImageError("File size too large. Please upload an image smaller than 1 MB.");
        return;
      }

      const formData = new FormData();
      formData.append("employeeId", getEmployeeById.data.data.id);
      formData.append("avatar", ev.target.files[0]);
      updateEmployeeAvatar.mutate(formData, {
        onSuccess: (response) => {
          if (response.status == 200) {
            getEmployeeById.refetch();
          }
          if (response.status == 404) {
            setAlert(response.message);
          }
          ev.target.value = null;
        },
        onError: (error) => {
          console.log(error);
        },
      });

      ev.target.value = null;
    }
  };

  const onSelectDob = (date) => {
    if (date - new Date() > 0) {
      setDob(dob);
      return;
    }

    setDob(date);
  };

  const onUpdateEmployee = (event) => {
    event.preventDefault();
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

    if (password && password.length < 6) {
      setErrors((prev) => {
        return { ...prev, password_pattern: "Password need to be more than 6 characters" };
      });
      isOk = false;
    } else {
      setErrors((prev) => {
        return { ...prev, password_pattern: null };
      });
    }

    if (password && password != repeat) {
      setErrors((prev) => {
        return { ...prev, repeat: "Wrong password confirm" };
      });
      isOk = false;
    } else {
      setErrors((prev) => {
        return { ...prev, repeat: null };
      });
    }

    if (!name) {
      setErrors((prev) => {
        return { ...prev, name: "Name cannot be empty" };
      });
      isOk = false;
    } else {
      setErrors((prev) => {
        return { ...prev, name: null };
      });
    }

    if (!phone) {
      setErrors((prev) => {
        return { ...prev, phone: "Phone cannot be empty" };
      });
      isOk = false;
    } else {
      setErrors((prev) => {
        return { ...prev, phone: null };
      });
    }

    if (!address) {
      setErrors((prev) => {
        return { ...prev, address: "Address cannot be empty" };
      });
      isOk = false;
    } else {
      setErrors((prev) => {
        return { ...prev, address: null };
      });
    }

    if (isOk) {
      const formData = new FormData();
      formData.append("id", getEmployeeById.data.data.id);
      formData.append("email", email);
      if (password) {
        formData.append("password", password);
      }
      formData.append("name", name);
      formData.append("phone", phone);
      formData.append("address", address);
      formData.append("gender", gender.value);
      formData.append("dob", `${dob.getFullYear()}-${dob.getMonth() + 1}-${dob.getDate()}`);

      updateEmployee.mutate(formData, {
        onSuccess: (response) => {
          console.log(response);
          if (response.status == 200) {
            setIsSuccess(true);
            return;
          }

          if (response.status == 403) {
            setAlert(response.message);
            return;
          }
        },
        onError: (error) => {
          console.log(error);
        },
      });
    }
  };

  return (
    <>
      <Container>
        <Form>
          <LeftForm>
            <InputContainer>
              <label>
                Email <span>*</span>
              </label>
              <TextInput readOnly={true} state={email} setState={setEmail} />
            </InputContainer>
            {errors.email && <h5>{errors.email}</h5>}
            {errors.email_pattern && <h5>{errors.email_pattern}</h5>}
            <InputContainer>
              <label>
                Password <span>*</span>
              </label>
              <TextInput state={password} setState={setPassword} type={"password"} />
            </InputContainer>
            {errors.password && <h5>{errors.password}</h5>}
            {errors.password_pattern && <h5>{errors.password_pattern}</h5>}
            <InputContainer>
              <label>
                Password Repeat <span>*</span>
              </label>
              <TextInput state={repeat} setState={setRepeat} type={"password"} />
            </InputContainer>
            {errors.repeat && <h5>{errors.repeat}</h5>}
            <InputContainer>
              <label>
                Employee name <span>*</span>
              </label>
              <TextInput state={name} setState={setName} />
            </InputContainer>
            {errors.name && <h5>{errors.name}</h5>}
            <InputContainer>
              <label>
                Phone <span>*</span>
              </label>
              <NumberInput state={phone} setState={setPhone} />
            </InputContainer>
            {errors.phone && <h5>{errors.phone}</h5>}
            <InputContainer>
              <label>
                Address <span>*</span>
              </label>
              <TextInput state={address} setState={setAddress} />
            </InputContainer>
            {errors.address && <h5>{errors.address}</h5>}
            <GenderDobContainer>
              <InputContainer>
                <label>
                  Gender <span>*</span>
                </label>
                <SelectInput options={options} setState={setGender} state={gender} />
              </InputContainer>
              <DateContainer>
                <label>
                  Birthdate <span>*</span>
                </label>
                <DatePickerStyled
                  showIcon
                  preventOpenOnFocus
                  selected={dob}
                  onChange={onSelectDob}
                />
              </DateContainer>
            </GenderDobContainer>
            <ButtonContainer>
              <Button1 type="submit" onClick={onUpdateEmployee}>
                Save
              </Button1>
            </ButtonContainer>
          </LeftForm>
          <RightForm>
            <Images>
              {!avatar ? (
                <div>
                  <Avatar round size="150" src={default_avatar} />
                </div>
              ) : (
                <div>
                  <Avatar src={getFirebaseImageUrl(avatar)} round size="150" />
                </div>
              )}
              <input type="file" onChange={handleImageChange} ref={fileRef} />
            </Images>
            <p>Maximum file size 1 MB</p>
            <Button1 type={"button"} onClick={onClickSelectImage}>
              Select Avatar
            </Button1>
          </RightForm>
        </Form>
      </Container>

      {isSuccess && (
        <SuccessPopUp message={"Success update employee"} action={() => setIsSuccess(false)} />
      )}
      {imageError && <ErrorPopUp message={imageError} action={() => setImageError("")} />}
      {alert && <AlertPopUp message={alert} action={() => setAlert("")} />}
    </>
  );
}
