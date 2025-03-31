import styled, { css } from "styled-components";
import { useState } from "react";
import TextInput from "@/shared/components/Input/TextInput";
import NumberInput from "@/shared/components/Input/NumberInput";
import { useRef } from "react";
import Avatar from "react-avatar";
import Button1 from "@/shared/components/Button/Button1";
import ErrorPopUp from "@/shared/components/PopUp/ErrorPopUp";
import SuccessPopUp from "@/shared/components/PopUp/SuccessPopUp";
import "react-datepicker/dist/react-datepicker.css";
import AlertPopUp from "@/shared/components/PopUp/AlertPopUp";
import { useNavigate } from "react-router-dom";
import TextEditor from "../product/components/TextEditor/TextEditor";
import { useEffect } from "react";
import { getApprovedDesignerDetailRequest } from "./api/designerDetailApi";
import { useSearchParams } from "react-router-dom";
import getFirebaseImageUrl from "@/shared/utils/getFireBaseImage";
import notfound from "@/shared/assets/images/404.png";
import { approveDesignerRequest } from "../pending_approved_designer/api/pendingApprovedApi";
import { denyDesignerRequest } from "../pending_approved_designer/api/pendingApprovedApi";
import { changeDesignerStatusRequest } from "../designer_list/api/designerListApi";
import WaitingPopUp from "@/shared/components/PopUp/WaitingPopUp";
import InputCheckBox from "@/shared/components/Input/InputCheckBox";

const Container = styled.div`
  background-color: white;
  margin: 2rem 2rem;
  padding: 2rem;

  & span {
    color: red;
  }

  h5 {
    color: red;
  }
`;

const Form = styled.div`
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
  gap: 2rem;
`;

const InputContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 10px 0;
`;

const AvatarImages = styled.div`
  > input {
    display: none;
  }
`;

const DetailContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const Header = styled.div`
  display: flex;
  margin-bottom: 1rem;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);

  > button {
    flex: 1;
  }
`;

const HeaderButton = styled.button`
  cursor: pointer;
  background-color: white;
  transition: all 0.5s;
  border: none;
  border-bottom: 2px solid white;
  font-size: 18px;
  ${(props) => {
    if (props.$active) {
      return css`
        border-bottom: 2px solid red;
      `;
    }
  }}
`;

const ImageContainer = styled.div`
  > input {
    display: none;
  }

  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 10px 0;
`;

const Images = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  grid-auto-rows: 9rem;
  gap: 10px;

  > div:nth-of-type(1) {
    grid-column: 1/3;
    grid-row: 1/3;
  }

  > div {
    border: 1px dotted rgba(0, 0, 0, 0.2);
    display: flex;
    align-items: center;
    justify-content: center;
  }

  & img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
`;

const ImageLayout = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0);
  cursor: pointer;
  display: flex;
  justify-content: flex-end;
  padding: 5px;

  > svg {
    display: none;
    font-size: 1.2rem;
    background-color: white;
    padding: none;
    border-radius: 5px;
  }

  > svg:nth-of-type(1) {
    width: 2rem;
    height: 2rem;
    margin-left: 30px;
    background-color: rgba(0, 0, 0, 0);
    color: white;
    border: 2px dotted rgba(255, 255, 255, 1);
  }

  &:hover {
    background: rgba(0, 0, 0, 0.4);
  }

  &:hover svg {
    display: block;
  }
`;

const ImageItem = styled.div`
  position: relative;
`;

const NotFound = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const DateOfWorkContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  padding: 0 2rem;

  & p {
    margin: 0;
    padding: 0;
  }

  > div {
    display: flex;
    gap: 1rem;
    align-items: center;
  }
`;

export default function DesignerDetail() {
  const changeDesignerStatus = changeDesignerStatusRequest();
  const approveDesigner = approveDesignerRequest();
  const denyDesigner = denyDesignerRequest();
  const [avatarError, setAvatarError] = useState();
  let [searchParams, setSearchParams] = useSearchParams();
  const getApprovedDesignerDetail = getApprovedDesignerDetailRequest(searchParams.get("id"));
  let fileRef = useRef();
  let certificateRef = useRef();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [specialize, setSpecialize] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [dow, setDow] = useState({
    Mon: false,
    Tue: false,
    Wed: false,
    Thu: false,
    Fri: false,
    Sat: false,
    Sun: false,
  });
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [avatar, setAvatar] = useState();
  const [year, setYear] = useState("");
  const [portfolio, setPortfolio] = useState("");
  const [certificateImages, setCertificateImages] = useState([]);
  const [header, setHeader] = useState("info");
  const [errors, setErrors] = useState({});
  const [imageError, setImageError] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [alert, setAlert] = useState("");

  useEffect(() => {
    if (getApprovedDesignerDetail.isSuccess && getApprovedDesignerDetail.data.status == 200) {
      const data = getApprovedDesignerDetail.data.data;

      setEmail(data.user.email);
      setFirstName(data.first_name);
      setLastName(data.last_name);
      setPhone(data.contact_number);
      setAddress(data.address);
      setSpecialize(data.specialization);
      setYear(data.yearsofexperience);
      setPortfolio(data.portfolio);
      setAvatar(data.avatar);

      const images = data.certificate.split("; ").filter((item) => item.length != 0);

      setCertificateImages(images);

      const dowQuery = data.daywork.split("-");

      for (let item of dowQuery) {
        setDow((prev) => {
          return { ...prev, [item]: true };
        });
      }
    }
  }, [getApprovedDesignerDetail.status]);

  if (getApprovedDesignerDetail.isSuccess && getApprovedDesignerDetail.data.status == 404) {
    return (
      <Container>
        <NotFound>
          <img src={notfound} />
        </NotFound>
      </Container>
    );
  }

  const onChangeDesignerStatus = (designerId) => {
    const formData = new FormData();

    formData.append("designerId", designerId);

    changeDesignerStatus.mutate(formData, {
      onSuccess: (response) => {
        if (response.status == 200) {
          getApprovedDesignerDetail.refetch();
        }
      },
    });
  };

  if (changeDesignerStatus.isPending) {
    return <WaitingPopUp />;
  }

  return (
    <>
      <Container>
        <Form>
          <LeftForm>
            <Header>
              <HeaderButton
                $active={header == "info"}
                onClick={(ev) => {
                  ev.preventDefault();
                  setHeader("info");
                }}
              >
                Designer information
              </HeaderButton>
              <HeaderButton
                $active={header == "portfolio"}
                onClick={(ev) => {
                  ev.preventDefault();
                  setHeader("portfolio");
                }}
              >
                Porfolio
              </HeaderButton>
              <HeaderButton
                $active={header == "certificate"}
                onClick={(ev) => {
                  ev.preventDefault();
                  setHeader("certificate");
                }}
              >
                Certificate
              </HeaderButton>
              <HeaderButton
                $active={header == "dow"}
                onClick={(ev) => {
                  ev.preventDefault();
                  setHeader("dow");
                }}
              >
                Day of work
              </HeaderButton>
            </Header>
            {header == "info" && (
              <DetailContainer>
                <InputContainer>
                  <label>
                    Email <span>*</span>
                  </label>
                  <TextInput readOnly={true} state={email} setState={setEmail} />
                </InputContainer>

                <InputContainer>
                  <label>
                    First Name <span>*</span>
                  </label>
                  <TextInput readOnly={true} state={firstName} setState={setFirstName} />
                </InputContainer>
                {errors.firstName && <h5>{errors.firstName}</h5>}
                <InputContainer>
                  <label>
                    Last Name <span>*</span>
                  </label>
                  <TextInput readOnly={true} state={lastName} setState={setLastName} />
                </InputContainer>
                {errors.lastName && <h5>{errors.lastName}</h5>}
                <InputContainer>
                  <label>
                    Phone <span>*</span>
                  </label>
                  <NumberInput readOnly={true} state={phone} setState={setPhone} />
                </InputContainer>
                {errors.phone && <h5>{errors.phone}</h5>}
                <InputContainer>
                  <label>
                    Address <span>*</span>
                  </label>
                  <TextInput readOnly={true} state={address} setState={setAddress} />
                </InputContainer>
                {errors.address && <h5>{errors.address}</h5>}

                <InputContainer>
                  <label>
                    Specialization <span>*</span>
                  </label>
                  <TextInput readOnly={true} state={specialize} setState={setSpecialize} />
                </InputContainer>
                {errors.specialize && <h5>{errors.specialize}</h5>}
                <InputContainer>
                  <label>
                    Year of Expirience <span>*</span>
                  </label>
                  <NumberInput readOnly={true} state={year} setState={setYear} />
                </InputContainer>
                {errors.year && <h5>{errors.year}</h5>}
              </DetailContainer>
            )}

            {header == "portfolio" && (
              <div>
                <TextEditor state={portfolio} />
              </div>
            )}

            {header == "certificate" && (
              <ImageContainer>
                {certificateImages.length > 0 && (
                  <Images>
                    {certificateImages.map((item, index) => {
                      return (
                        <ImageItem key={index}>
                          <ImageLayout></ImageLayout>
                          <img src={getFirebaseImageUrl(item)} />
                        </ImageItem>
                      );
                    })}
                  </Images>
                )}
              </ImageContainer>
            )}

            {header == "dow" && (
              <DateOfWorkContainer>
                <div>
                  <InputCheckBox readOnly={true} checked={dow.Mon} />
                  <p>Monday</p>
                </div>
                <div>
                  <InputCheckBox readOnly={true} checked={dow.Tue} />
                  <p>Tuesday</p>
                </div>
                <div>
                  <InputCheckBox readOnly={true} checked={dow.Wed} />
                  <p>Wednesday</p>
                </div>
                <div>
                  <InputCheckBox readOnly={true} checked={dow.Thu} />
                  <p>Thursday</p>
                </div>
                <div>
                  <InputCheckBox readOnly={true} checked={dow.Fri} />
                  <p>Friday</p>
                </div>
                <div>
                  <InputCheckBox readOnly={true} checked={dow.Sat} />
                  <p>Saturday</p>
                </div>
                <div>
                  <InputCheckBox readOnly={true} checked={dow.Sun} />
                  <p>Sunday</p>
                </div>
              </DateOfWorkContainer>
            )}

            <ButtonContainer>
              {getApprovedDesignerDetail.isSuccess && (
                <Button1
                  onClick={() => onChangeDesignerStatus(getApprovedDesignerDetail.data.data.id)}
                >
                  {getApprovedDesignerDetail.data.data.status == true ? "Deactivate" : "Activate"}
                </Button1>
              )}
            </ButtonContainer>
          </LeftForm>
          <RightForm>
            <AvatarImages>
              <div>
                <Avatar src={getFirebaseImageUrl(avatar)} round size="150" />
              </div>

              <input type="file" ref={fileRef} />
            </AvatarImages>
          </RightForm>
        </Form>
      </Container>

      {isSuccess && (
        <SuccessPopUp
          message={"Success, please wait for admin to response"}
          action={() => {
            setIsSuccess(false);
            navigate("/login");
          }}
        />
      )}
      {imageError && <ErrorPopUp message={imageError} action={() => setImageError("")} />}
      {alert && <AlertPopUp message={alert} action={() => setAlert("")} />}
      {avatarError && <AlertPopUp message={"Avatar is required"} action={() => setAvatarError()} />}
    </>
  );
}
