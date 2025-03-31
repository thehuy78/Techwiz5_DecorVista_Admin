import styled, { css } from "styled-components";
import { useState } from "react";
import TextInput from "@/shared/components/Input/TextInput";
import useCreateGallery from "./hooks/useCreateGallery";
import SelectInput from "@/shared/components/Input/SelectInput";
import Select from "react-select";
import roomOptions from "./data/roomOptions";
import colourOptions from "./data/colorOptions";
import chroma from "chroma-js";
import TextEditor from "../product/components/TextEditor/TextEditor";
import Avatar from "react-avatar";
import { FaRegImages } from "react-icons/fa6";
import { useRef } from "react";
import { getProductByIdRequest, searchProductRequest } from "./api/addGalleryApi";
import getFirebaseImageUrl from "@/shared/utils/getFireBaseImage";
import Button1 from "@/shared/components/Button/Button1";
import XButton from "@/shared/components/Button/XButton";
import ErrorPopUp from "@/shared/components/PopUp/ErrorPopUp";
import { createGalleryRequest } from "./api/addGalleryApi";
import WaitingPopUp from "@/shared/components/PopUp/WaitingPopUp";
import { BiImageAdd } from "react-icons/bi";
import { AiOutlineClose } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import { adminRequest } from "@/shared/api/adminApi";
import CropImagePopUp from "@/shared/components/PopUp/CropImagePopUp";

const Container = styled.div`
  margin: 2rem;
  padding: 2rem;
  margin-bottom: 5rem;

  p {
    margin: 0;
  }

  & h5 {
    font-size: 15px;
    font-weight: 600;
    color: rgba(0, 0, 0, 0.6);
  }

  & .error {
    color: red;
  }
`;

const StyleContainerButton = styled.div`
  display: flex;
  justify-content: space-around;
  gap: 1rem;
  padding: 1rem;
`;

const FormContainer = styled.div`
  display: grid;
  grid-template-columns: 3fr 1fr;
  gap: 1rem;
`;

const InputContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 10px 0;
  position: relative;
`;

const LeftContainer = styled.div`
  background-color: white;
  padding: 1rem;
  box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;
`;

const RightContainer = styled.div`
  > div {
    box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;
    background-color: white;
    position: sticky;
    top: 5rem;
  }
`;

const SelectContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
`;

const ConfirmButton = styled.button`
  cursor: pointer;
  color: white;
  background-color: #2962ff;
  border: none;
  padding: 0.3rem 0;
  border-radius: 5px;

  &:hover {
    background-color: #0052cc;
  }
`;

const ImageDefault = styled.div`
  width: 20rem;
  height: 20rem;

  border: 1px dotted rgba(0, 0, 0, 0.3);
  cursor: pointer;

  display: flex;
  justify-content: center;
  align-items: center;

  > svg {
    font-size: 100px;
  }
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

const DropDown = styled.div`
  position: absolute;
  display: none;
  z-index: 1;

  &:hover {
    display: block;
  }

  box-shadow: rgba(50, 50, 93, 0.25) 0px 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px;
  width: 100%;
  background-color: white;
  transform: translateY(80px);
  max-height: 400px;
  overflow-y: scroll;
`;

const DropDownItem = styled.div`
  cursor: pointer;
  display: flex;
  gap: 1rem;
  padding: 10px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);

  > div {
    display: flex;
    flex-direction: column;
    > p:nth-of-type(2) {
      color: rgba(0, 0, 0, 0.5);
      font-size: 14px;
    }
  }
`;

const CustomTextInput = styled(TextInput)`
  &:focus + div {
    display: block;
  }
`;

const SelectedProductContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 10px 0;
  position: relative;

  height: 400px;
  overflow: auto;
  padding: 1rem;
`;

const SelectedProduct = styled.div`
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: 1rem;
  padding: 5px;

  > div:nth-of-type(2) {
    > p:nth-of-type(2) {
      color: rgba(0, 0, 0, 0.5);
      font-size: 14px;
    }
  }

  border: 1px solid rgba(0, 0, 0, 0.1);
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

const AddImageButton = styled.button`
  background-color: white;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  gap: 10px;
  padding: 3rem 2rem;
  border: 1px dotted rgba(0, 0, 0, 0.2);

  > span {
    color: rgba(0, 0, 255, 0.5);
    font-size: 16px;
  }

  > svg {
    font-size: 45px;
    opacity: 0.3;
  }
`;

export default function AddGallery() {
  const [state, dispatch, ACTIONS] = useCreateGallery();
  const [search, setSearch] = useState("");
  const [header, setHeader] = useState("general");
  const [imageError, setImageError] = useState(false);
  const createGallery = createGalleryRequest();
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const inputRef = useRef();
  const admin = adminRequest();
  const [isCrop, setIsCrop] = useState();

  const getProductById = getProductByIdRequest(state.product_list);
  const searchProduct = searchProductRequest(search);

  const colorDot = (color = "transparent") => ({
    alignItems: "center",
    display: "flex",
    ":before": {
      backgroundColor: color,
      borderRadius: 10,
      content: '" "',
      display: "block",
      marginRight: 8,
      height: 10,
      width: 10,
    },
  });

  const colourStyles = {
    control: (styles) => ({ ...styles, backgroundColor: "white" }),
    option: (styles, { data, isDisabled, isFocused, isSelected }) => {
      const color = chroma(data.color);
      return {
        ...styles,
        backgroundColor: isDisabled
          ? undefined
          : isSelected
          ? data.color
          : isFocused
          ? color.alpha(0.1).css()
          : undefined,
        color: isDisabled
          ? "#ccc"
          : isSelected
          ? chroma.contrast(color, "white") > 2
            ? "white"
            : "black"
          : data.color,
        cursor: isDisabled ? "not-allowed" : "default",

        ":active": {
          ...styles[":active"],
          backgroundColor: !isDisabled
            ? isSelected
              ? data.color
              : color.alpha(0.3).css()
            : undefined,
        },
      };
    },
    input: (styles) => ({ ...styles, ...colorDot() }),
    placeholder: (styles) => ({ ...styles, ...colorDot("#ccc") }),
    singleValue: (styles, { data }) => ({ ...styles, ...colorDot(data.color) }),
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

      setIsCrop(ev.target.files[0]);
      setImageError(null);
      ev.target.value = null;
    }
  };

  const onCreateGallery = () => {
    let isOk = true;

    if (!state.gallery_name) {
      setErrors((prev) => {
        return { ...prev, name: "Name cannot be empty" };
      });
      isOk = false;
    } else {
      setErrors((prev) => {
        return { ...prev, name: null };
      });
    }

    if (!state.content) {
      setErrors((prev) => {
        return { ...prev, content: "Content cannot be empty" };
      });
      isOk = false;
    } else {
      setErrors((prev) => {
        return { ...prev, content: null };
      });
    }

    if (!state.color_tone) {
      setErrors((prev) => {
        return { ...prev, color: "Color cannot be empty" };
      });
      isOk = false;
    } else {
      setErrors((prev) => {
        return { ...prev, color: null };
      });
    }

    if (!state.room_type) {
      setErrors((prev) => {
        return { ...prev, room: "Room type cannot be empty" };
      });
      isOk = false;
    } else {
      setErrors((prev) => {
        return { ...prev, room: null };
      });
    }

    if (state.image.length < 5) {
      setErrors((prev) => {
        return { ...prev, image: "Gallery need to upload atleast 5 image" };
      });
      isOk = false;
    } else {
      setErrors((prev) => {
        return { ...prev, image: null };
      });
    }

    if (state.product_list.length == 0) {
      setErrors((prev) => {
        return { ...prev, product: "Gallery product cannot be empty" };
      });
      isOk = false;
    } else {
      setErrors((prev) => {
        return { ...prev, product: null };
      });
    }

    if (isOk) {
      const formData = new FormData();
      formData.append("gallery_name", state.gallery_name);
      formData.append("room_type_id", state.room_type.value);
      formData.append("color_tone", state.color_tone.value);
      formData.append("description", state.content);

      state.image.forEach((item) => formData.append("uploadImages", item));
      state.product_list.forEach((item) => formData.append("product_list", item));

      createGallery.mutate(formData, {
        onSuccess: (response) => {
          if (response.status == 200) {
            if (admin.data.data.role == "admin") {
              navigate("/list_gallery_admin");
            } else {
              navigate("/list_gallery_designer");
            }
          }
        },
      });
    }
  };

  if (createGallery.isPending) {
    return <WaitingPopUp />;
  }

  return (
    <>
      <Container>
        <FormContainer>
          <LeftContainer>
            <Header>
              <HeaderButton
                $active={header == "general"}
                onClick={(ev) => {
                  ev.preventDefault();
                  setHeader("general");
                }}
              >
                General information
              </HeaderButton>
              <HeaderButton
                $active={header == "product"}
                onClick={(ev) => {
                  ev.preventDefault();
                  setHeader("product");
                }}
              >
                Gallery product
              </HeaderButton>
            </Header>

            {header == "general" && (
              <>
                <InputContainer>
                  <h5>Gallery name</h5>
                  <TextInput
                    state={state.gallery_name}
                    setState={(value) =>
                      dispatch({ type: ACTIONS.CHANGE_GALLERY_NAME, next: value })
                    }
                  />
                </InputContainer>

                {errors.name && <h5 className="error">{errors.name}</h5>}

                <SelectContainer>
                  <InputContainer>
                    <h5>Room type</h5>
                    <SelectInput
                      state={state.room_type}
                      setState={(value) =>
                        dispatch({ type: ACTIONS.CHANGE_ROOM_TYPE, next: value })
                      }
                      options={roomOptions}
                    />
                  </InputContainer>

                  <InputContainer>
                    <label>Color tone</label>
                    <Select
                      value={state.color_tone}
                      onChange={(value) =>
                        dispatch({ type: ACTIONS.CHANGE_COLOR_TONE, next: value })
                      }
                      options={colourOptions}
                      styles={colourStyles}
                    />
                  </InputContainer>
                </SelectContainer>
                {errors.color && <h5 className="error">{errors.color}</h5>}
                {errors.room && <h5 className="error">{errors.room}</h5>}

                <InputContainer>
                  <h5>Content</h5>
                  <TextEditor
                    state={state.content}
                    setState={(value) => dispatch({ type: ACTIONS.CHANGE_CONTENT, next: value })}
                  />
                </InputContainer>

                {errors.content && <h5 className="error">{errors.content}</h5>}

                <ImageContainer>
                  <h5>Image container</h5>
                  {state.image.length > 0 && (
                    <Images>
                      {state.image.map((item, index) => {
                        return (
                          <ImageItem key={index}>
                            <ImageLayout>
                              <AiOutlineClose
                                onClick={() => {
                                  dispatch({
                                    type: ACTIONS.CHANGE_IMAGE,
                                    next: state.image.filter((_, position) => position != index),
                                  });
                                }}
                              />
                            </ImageLayout>
                            <img src={URL.createObjectURL(item)} />
                          </ImageItem>
                        );
                      })}
                      <AddImageButton onClick={() => inputRef.current.click()}>
                        <BiImageAdd />
                      </AddImageButton>
                    </Images>
                  )}

                  {state.image.length == 0 && (
                    <AddImageButton onClick={() => inputRef.current.click()}>
                      <BiImageAdd />
                      <span>Add Image</span>
                    </AddImageButton>
                  )}
                  <input ref={inputRef} onChange={handleImageChange} type="file" />
                </ImageContainer>

                {errors.image && <h5 className="error">{errors.image}</h5>}
              </>
            )}

            {header == "product" && (
              <>
                <InputContainer>
                  <h5>Search product</h5>
                  <CustomTextInput
                    placeholder={"Input to search for product"}
                    state={search}
                    setState={setSearch}
                  />
                  {searchProduct.isSuccess && search && (
                    <DropDown>
                      {searchProduct.data.data.map((item, index) => {
                        return (
                          <DropDownItem
                            onClick={() => {
                              if (!state.product_list.includes(item.id)) {
                                dispatch({
                                  type: ACTIONS.CHANGE_PRODUCT_LIST,
                                  next: [...state.product_list, item.id],
                                });
                              }
                            }}
                            key={index}
                          >
                            <Avatar size="70" src={getFirebaseImageUrl(item.imageName)} />
                            <div>
                              <p>{item.productname}</p>
                              <p>
                                {state.product_list.includes(item.id)
                                  ? "Already added"
                                  : "Can be added"}
                              </p>
                            </div>
                          </DropDownItem>
                        );
                      })}
                    </DropDown>
                  )}
                </InputContainer>

                <InputContainer>
                  <h5>Added product</h5>
                  <SelectedProductContainer>
                    {getProductById.isSuccess &&
                      getProductById.data.data.map((item, index) => {
                        return (
                          <SelectedProduct key={index}>
                            <Avatar size="70" src={getFirebaseImageUrl(item.imageName)} />
                            <div>
                              <p>{item.productname}</p>
                              <p>{item.variants.length} variants</p>
                            </div>
                            <div>
                              <XButton
                                action={() => {
                                  dispatch({
                                    type: ACTIONS.CHANGE_PRODUCT_LIST,
                                    next: [
                                      ...state.product_list.filter(
                                        (_, position) => position != index
                                      ),
                                    ],
                                  });
                                }}
                              />
                            </div>
                          </SelectedProduct>
                        );
                      })}
                  </SelectedProductContainer>
                </InputContainer>

                {errors.product && <h5 className="error">{errors.product}</h5>}
              </>
            )}
          </LeftContainer>

          <RightContainer>
            <StyleContainerButton>
              <Button1 onClick={() => window.location.reload()}>Cancel</Button1>
              <Button1 onClick={onCreateGallery}>Submit</Button1>
            </StyleContainerButton>
          </RightContainer>
        </FormContainer>
      </Container>
      {imageError && <ErrorPopUp message={imageError} action={() => setImageError("")} />}
      {isCrop && (
        <CropImagePopUp
          action={() => setIsCrop()}
          onSuccess={(image) => {
            dispatch({ type: ACTIONS.CHANGE_IMAGE, next: [...state.image, image] });
          }}
          image={isCrop}
          aspect={16 / 9}
        />
      )}
    </>
  );
}
