import styled from "styled-components";
import { useRef, useState } from "react";
import SelectInput from "@/shared/components/Input/SelectInput";
import TextInput from "@/shared/components/Input/TextInput";
import InputCheckBox from "@/shared/components/Input/InputCheckBox";
import Button1 from "@/shared/components/Button/Button1";
import TextEditor from "../product/components/TextEditor/TextEditor";
import { BiImageAdd } from "react-icons/bi";
import ErrorPopUp from "@/shared/components/PopUp/ErrorPopUp";
import { AiOutlineClose } from "react-icons/ai";
import CreatableSelect from "react-select/creatable";
import useUpdateProduct from "./hooks/useUpdateProduct";
import { useEffect } from "react";
import optionsFunction from "../product/data/optionsFunction";
import variantOptions from "../product/data/variantOptions";
import Select from "react-select";
import AlertPopUp from "@/shared/components/PopUp/AlertPopUp";
import WaitingPopUp from "@/shared/components/PopUp/WaitingPopUp";
import optionsBrand from "@/features/product/data/optionsBrand";
import CropImagePopUp from "@/shared/components/PopUp/CropImagePopUp";
import { getProductByIdRequest } from "./api/updateProductApi";
import { useSearchParams } from "react-router-dom";
import notfound from "@/shared/assets/images/404.png";
import getFirebaseImageUrl from "@/shared/utils/getFireBaseImage";
import VariantDetailUpdatePopUp from "./components/VariantDetailUpdatePopUp";
import brandOptions from "@/features/product/data/optionsBrand";
import AllVariantUpdatePopUp from "./components/AllVariantUpdatePopUp";
import { updateProductRequest } from "./api/updateProductApi";
import { adminRequest } from "@/shared/api/adminApi";

const Container = styled.div`
  margin: 2rem;
  padding: 1rem;
  margin-bottom: 5rem;

  & margin {
    padding: 0;
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
`;

const LeftContainer = styled.div`
  background-color: white;
  padding: 0 1rem;
  padding-bottom: 1rem;
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

const CatgoryContainer = styled.div``;

const SelectContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
`;

const SaveContainer = styled.div`
  box-shadow: rgba(0, 0, 0, 0.02) 0px 1px 3px 0px, rgba(27, 31, 35, 0.15) 0px 0px 0px 1px;
  padding: 2rem;

  > div {
    display: flex;
  }
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

const VariantDetail = styled.div`
  display: flex;
  align-items: center;
  gap: 2rem;

  > .createselect {
    flex: 1;
  }

  > .trash {
  }

  > svg {
    color: red;
    cursor: pointer;
  }
`;

const Input = styled(Select)`
  border-radius: 3px;

  border: 1px solid rgba(0, 0, 0, 0.1);
  width: 10rem;

  transition: all 0.3s;
  & * {
    cursor: pointer;
    outline: none !important;
    border: none !important;
  }
`;

const Creatable = styled(CreatableSelect)`
  border-radius: 3px;

  border: 1px solid rgba(0, 0, 0, 0.1);
  width: 10rem;

  transition: all 0.3s;
  & * {
    cursor: pointer;
    outline: none !important;
    border: none !important;
  }
`;

const VariantContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 10px 0;

  > button {
    color: #2962ff;
    display: flex;
    align-items: center;
    background-color: white;
    border: none;
    gap: 1rem;
    font-size: 15px;
    cursor: pointer;
    width: 100%;
  }
`;

const VariantItem = styled.div`
  border: 1px solid rgba(0, 0, 0, 0.1);
  cursor: pointer;
  display: flex;
  padding: 0 1rem;

  > span:nth-of-type(1) {
    flex: 1;
  }

  & .variant_click {
    width: 100%;
    display: flex;
    justify-content: space-between;

    padding: 1rem 0;
  }

  gap: 1rem;
  align-items: center;
`;

const VariantItemContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const ShowInfo = styled.div`
  padding: 10px;
  background-color: white;
`;

const ContentItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;

  & h5 {
    color: #6c798f;
    font-weight: 700;
    font-size: 15px;
  }

  ${(props) => {
    if (props.$split == true) {
      return css`
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 1rem;

        > div {
          display: flex;
          flex-direction: column;
          gap: 5px;
        }
      `;
    }
  }}
`;

const ActionContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 0.4rem 0;

  > input {
  }
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

const DiscardButton = styled.button`
  cursor: pointer;
  border: 1px solid black;
  background-color: white;
  border-radius: 5px;
  padding: 0.3rem 0;
  font-weight: 600;
`;

const ButtonContainer = styled.div`
  margin-top: 10px;
  display: flex;
  gap: 1rem;

  > button {
    flex: 1;
  }
`;

const VariantUpdateButton = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 1rem 0;
  align-items: center;
  padding: 0 0 0 1rem;
  > div {
    display: flex;
    align-items: center;
    gap: 1rem;
  }
`;

const ColorButton = styled.div`
  background-color: white;
  cursor: pointer;
  border: 1px solid black;
  padding: 10px;
  border-radius: 5px;

  > svg {
    color: red;
  }
`;

const NotFound = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const PriceContainer = styled.span`
  > span:nth-of-type(1) {
    font-weight: 700;
    font-size: 17px;
  }

  > span:nth-of-type(2) {
    position: relative;
    color: rgba(0, 0, 0, 0.4);
    &::before {
      border: 1px solid rgba(0, 0, 0, 0.4);
      content: "";
      position: absolute;
      width: 100%;
      transform: translateY(13px);
    }
  }
`;

const components = {
  DropdownIndicator: null,
};

const createOption = (label) => ({
  label,
  value: label,
});

export default function UpdateProduct() {
  const admin = adminRequest();
  const updateProduct = updateProductRequest();
  const [searchParams, setSearchParams] = useSearchParams();
  const getProductById = getProductByIdRequest(searchParams.get("id"));
  const [imageCrop, setImageCrop] = useState();
  const [errors, setErrors] = useState({});
  const [images, setImages] = useState([]);
  const [imageError, setImageError] = useState();
  const [state, dispatch, ACTIONS] = useUpdateProduct();
  const [variantDetailPopUp, setVariantDetailPopUp] = useState(false);
  const [chosenVariantDetail, setChosenVariantDetail] = useState(null);
  const [onEditAll, setOnEditAll] = useState();
  const [isAlert, setIsAlert] = useState("");
  const inputRef = useRef();
  const [checkedAll, setCheckedAll] = useState(false);
  const [colorPopUp, setColorPopUp] = useState(false);
  const [inputValue, setInputValue] = useState(["", "", "", "", ""]);
  const [value, setValue] = useState([[], [], [], [], []]);

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

      setImageCrop(ev.target.files[0]);
      setImageError(null);
      ev.target.value = null;
    }
  };

  const onClickAddImage = () => {
    inputRef.current.click();
  };

  const onUpdateProduct = () => {
    let isOk = true;

    if (!state.productName) {
      setErrors((prev) => {
        return { ...prev, name: "Name cannot be empty" };
      });
      isOk = false;
    } else {
      setErrors((prev) => {
        return { ...prev, name: null };
      });
    }

    if (!state.description) {
      setErrors((prev) => {
        return { ...prev, description: "Description cannot be empty" };
      });
      isOk = false;
    } else {
      setErrors((prev) => {
        return { ...prev, description: null };
      });
    }

    if (state.images.length == 0) {
      setErrors((prev) => {
        return { ...prev, image: "Image cannot be empty" };
      });
      isOk = false;
    } else {
      setErrors((prev) => {
        return { ...prev, image: null };
      });
    }

    if (state.variants.find((item) => !item || item.length == 0)) {
      setErrors((prev) => {
        return { ...prev, type: "Variant type cannot be empty" };
      });
      isOk = false;
    } else {
      setErrors((prev) => {
        return { ...prev, type: null };
      });
    }

    if (value.find((item, index) => index < state.variants.length && item.length == 0)) {
      setErrors((prev) => {
        return { ...prev, variant: "Variant cannot be empty" };
      });
      isOk = false;
    } else {
      setErrors((prev) => {
        return { ...prev, variant: null };
      });
    }

    if (isOk) {
      const formData = new FormData();
      formData.append("id", getProductById.data.data.id);
      formData.append("ProductName", state.productName);
      formData.append("Brand", state.brand.value);
      formData.append("Description", state.description);
      formData.append("Status", state.active);
      formData.append("RoomFuncion", state.roomFuncion.value);

      state.images.forEach(
        (image) => typeof image == "object" && formData.append("UploadImages", image)
      );

      state.images.forEach(
        (image) => typeof image != "object" && formData.append("OldImages", image)
      );

      state.variant_detail.forEach((item) => formData.append("VariantJson", JSON.stringify(item)));

      updateProduct.mutate(formData, {
        onSuccess: (response) => {
          if (response.status == 200) {
            getProductById.refetch();
          }
        },
      });
    }
  };

  useEffect(() => {
    let isOk = true;

    if (state.variant_detail.length == 0) {
      return;
    }

    for (let item of state.variant_detail) {
      if (item.selected == false) {
        isOk = false;
        break;
      }
    }

    setCheckedAll(isOk);
  }, [state.variant_detail]);

  useEffect(() => {
    if (
      getProductById.isSuccess &&
      getProductById.data.status == 200 &&
      getProductById.data.data != null
    ) {
      const data = getProductById.data.data;

      dispatch({ type: ACTIONS.CHANGE_NAME, next: data.productname });
      dispatch({ type: ACTIONS.CHANGE_DESCRIPTION, next: data.description });
      dispatch({
        type: ACTIONS.CHANGE_IMAGES,
        next: [...data.images.map((image) => image.imagename)],
      });
      dispatch({
        type: ACTIONS.CHANGE_BRAND,
        next: brandOptions.find((brand) => brand.value == data.brand),
      });
      dispatch({
        type: ACTIONS.CHANGE_FUNCTION,
        next: optionsFunction.find((func) => func.value == data.functionality_id),
      });

      dispatch({
        type: ACTIONS.CHANGE_VARIANTS,
        next: data.variants[0].variantattributes.map((type) => {
          return { label: type.attributetype, value: type.attributetype };
        }),
      });

      const maxType = data.variants[0].variantattributes.length;

      const newVariantValue = [[], [], [], [], []];

      for (let i = 0; i < maxType; i++) {
        for (let variant of data.variants) {
          if (
            !newVariantValue[i].find(
              (item) => item.value == variant.variantattributes[i].attributevalue
            )
          ) {
            newVariantValue[i].push({
              label: variant.variantattributes[i].attributevalue,
              value: variant.variantattributes[i].attributevalue,
            });
          }
        }
      }
      setValue(newVariantValue);

      dispatch({
        type: ACTIONS.CHANGE_VARIANT_DETAIL,
        next: data.variants.map((item) => {
          return { ...item, selected: false };
        }),
      });
      dispatch({ type: ACTIONS.CHANGE_ACTIVE, next: data.status });
    }
  }, [getProductById.status]);

  if (getProductById.isSuccess && getProductById.data.data == null) {
    return (
      <Container>
        <NotFound>
          <img src={notfound} />
        </NotFound>
      </Container>
    );
  }

  if (updateProduct.isPending) {
    return <WaitingPopUp />;
  }

  return (
    <>
      <Container>
        <FormContainer>
          <LeftContainer>
            <InputContainer>
              <h5>Product Name</h5>
              <TextInput
                state={state.productName}
                setState={(value) => dispatch({ type: ACTIONS.CHANGE_NAME, next: value })}
              />
            </InputContainer>
            {errors.name && <h5 className="error">{errors.name}</h5>}

            <SelectContainer>
              <InputContainer>
                <h5>Brand</h5>
                <SelectInput
                  state={state.brand}
                  setState={(value) => dispatch({ type: ACTIONS.CHANGE_BRAND, next: value })}
                  options={optionsBrand}
                />
              </InputContainer>

              <InputContainer>
                <label>Room function</label>
                <SelectInput
                  state={state.roomFuncion}
                  setState={(value) => dispatch({ type: ACTIONS.CHANGE_FUNCTION, next: value })}
                  options={optionsFunction}
                />
              </InputContainer>
            </SelectContainer>

            <InputContainer>
              <h5>Product Name</h5>
              <TextEditor
                state={state.description}
                setState={(value) => dispatch({ type: ACTIONS.CHANGE_DESCRIPTION, next: value })}
              />
            </InputContainer>

            {errors.description && <h5 className="error">{errors.description}</h5>}

            <ImageContainer>
              <h5>Image container</h5>
              {state.images.length > 0 && (
                <Images>
                  {state.images.map((item, index) => {
                    return (
                      <ImageItem key={index}>
                        <ImageLayout>
                          <AiOutlineClose
                            onClick={() => {
                              dispatch({
                                type: ACTIONS.CHANGE_IMAGES,
                                next: state.images.filter((image, position) => position != index),
                              });
                            }}
                          />
                        </ImageLayout>
                        <img
                          src={
                            typeof item == "object"
                              ? URL.createObjectURL(item)
                              : getFirebaseImageUrl(item)
                          }
                        />
                      </ImageItem>
                    );
                  })}
                  <AddImageButton onClick={onClickAddImage}>
                    <BiImageAdd />
                  </AddImageButton>
                </Images>
              )}

              {state.images.length == 0 && (
                <AddImageButton onClick={onClickAddImage}>
                  <BiImageAdd />
                  <span>Add Image</span>
                </AddImageButton>
              )}
              <input ref={inputRef} onChange={handleImageChange} type="file" />
            </ImageContainer>
            {errors.image && <h5 className="error">{errors.image}</h5>}
            <VariantContainer>
              <h5>Variants </h5>
              {state.variants.map((item, index) => {
                return (
                  <VariantDetail key={index}>
                    <Creatable value={item} isSearchable />
                    <CreatableSelect
                      className="createselect"
                      components={components}
                      inputValue={inputValue[index]}
                      isMulti
                      menuIsOpen={false}
                      value={value[index]}
                    />
                  </VariantDetail>
                );
              })}
            </VariantContainer>
            {state.variant_detail.length != 0 && (
              <VariantUpdateButton>
                <div>
                  <InputCheckBox
                    checked={checkedAll}
                    onChange={() => {
                      if (checkedAll == true) {
                        for (let item of state.variant_detail) {
                          item.selected = false;
                        }
                        dispatch({
                          type: ACTIONS.CHANGE_VARIANT_DETAIL,
                          next: [...state.variant_detail],
                        });
                      } else {
                        for (let item of state.variant_detail) {
                          item.selected = true;
                        }
                        dispatch({
                          type: ACTIONS.CHANGE_VARIANT_DETAIL,
                          next: [...state.variant_detail],
                        });
                      }
                    }}
                  />
                  <span>All</span>
                </div>
                <Button1 onClick={() => setOnEditAll(true)}>Update Variant</Button1>
              </VariantUpdateButton>
            )}
            <VariantItemContainer>
              {state.variant_detail.map((item, index) => {
                return (
                  <VariantItem key={index}>
                    <InputCheckBox
                      checked={item.selected}
                      onChange={(ev) => {
                        ev.stopPropagation();
                        ev.nativeEvent.stopImmediatePropagation();
                        state.variant_detail[index].selected = !item.selected;
                        dispatch({
                          type: ACTIONS.CHANGE_VARIANT_DETAIL,
                          next: [...state.variant_detail],
                        });
                      }}
                    />
                    <div
                      className="variant_click"
                      onClick={() => {
                        setChosenVariantDetail(item);
                        setVariantDetailPopUp(true);
                      }}
                    >
                      <span>
                        {item.variantattributes
                          .map((attribute) => attribute.attributevalue)
                          .join(" / ")}
                      </span>
                      <PriceContainer>
                        <span>${item.price}</span>
                        {item.saleprice != 0 && (
                          <>
                            {" / "}
                            <span>${item.saleprice}</span>
                          </>
                        )}
                      </PriceContainer>
                    </div>
                  </VariantItem>
                );
              })}
            </VariantItemContainer>
            {errors.variant && <h5 className="error">{errors.variant}</h5>}
            {errors.type && <h5 className="error">{errors.type}</h5>}
          </LeftContainer>
          <RightContainer>
            {admin.data.data.role == "admin" && (
              <ShowInfo>
                <ContentItem>
                  <h5>Status</h5>
                  <hr />
                  <ActionContainer>
                    <InputCheckBox
                      checked={state.active}
                      onChange={() => {
                        dispatch({ type: ACTIONS.CHANGE_ACTIVE, next: !state.active });
                      }}
                    />
                    Product Active
                  </ActionContainer>
                  <hr />
                  <ButtonContainer>
                    <ConfirmButton onClick={() => onUpdateProduct()}>Save</ConfirmButton>
                    <DiscardButton onClick={() => window.location.reload()}>Discard</DiscardButton>
                  </ButtonContainer>
                </ContentItem>
              </ShowInfo>
            )}
          </RightContainer>
        </FormContainer>
      </Container>
      {imageError && <ErrorPopUp message={imageError} action={() => setImageError("")} />}
      {variantDetailPopUp && (
        <VariantDetailUpdatePopUp
          state={chosenVariantDetail}
          action={() => setVariantDetailPopUp(false)}
          setState={() => {
            dispatch({ type: ACTIONS.CHANGE_VARIANT_DETAIL, next: state.variant_detail });
          }}
        />
      )}
      {onEditAll && (
        <AllVariantUpdatePopUp
          setState={() => {
            dispatch({ type: ACTIONS.CHANGE_VARIANT_DETAIL, next: state.variant_detail });
          }}
          action={() => setOnEditAll()}
          state={state.variant_detail}
        />
      )}
      {isAlert && <AlertPopUp message={isAlert} action={() => setIsAlert("")} />}

      {imageCrop && (
        <CropImagePopUp
          action={() => setImageCrop()}
          onSuccess={(image) => {
            dispatch({ type: ACTIONS.CHANGE_IMAGES, next: [...state.images, image] });
          }}
          image={imageCrop}
          aspect={1 / 1}
        />
      )}
    </>
  );
}
