import React from "react";
import styled from "styled-components";
import { useState } from "react";
import PopUp from "@/shared/components/PopUp/PopUp";
import XButton from "@/shared/components/Button/XButton";
import { BiImageAdd } from "react-icons/bi";
import { useRef } from "react";
import { AiOutlineClose } from "react-icons/ai";
import { adminRequest } from "@/shared/api/adminApi";
import { createNewStoryRequest } from "../api/designerStoryApi";
import Button1 from "@/shared/components/Button/Button1";
import ErrorPopUp from "@/shared/components/PopUp/ErrorPopUp";
import CropImagePopUp from "@/shared/components/PopUp/CropImagePopUp";

const CustomPopUp = styled(PopUp)`
  padding: 0;
  width: 50rem;

  & p {
    margin: 0;
  }
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  padding: 1rem;
  justify-content: space-between;

  & h5 {
    font-weight: 600;
  }
`;

const TextArea = styled.textarea`
  padding: 8px;
  border-radius: 3px;
  width: 100%;
  height: 15rem;
  resize: none;
  margin: 0;

  border: 1px solid rgba(0, 0, 0, 0.1);
  outline: none;
  transition: all 0.3s;
`;

const ImageContainer = styled.div`
  > input {
    display: none;
  }

  display: flex;
  flex-direction: column;
  gap: 10px;
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

const ButtonContainer = styled.div`
  margin: 10px 0;
  display: flex;
  flex-direction: column;
`;

export default function NewStoryPopUp({ action }) {
  const [cropImage, setCropImage] = useState();
  const admin = adminRequest();
  const [images, setImages] = useState([]);
  const [content, setContent] = useState("");
  const inputRef = useRef();
  const createNewStory = createNewStoryRequest();

  const [imageError, setImageError] = useState();
  const [error, setError] = useState();

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

      setImages((prev) => [...prev, ...ev.target.files]);
      setImageError(null);
      ev.target.files = [];
    }
  };

  const onCreateNewStory = () => {
    if (images.length == 0) {
      setError("You need atleast 1 image");
      return;
    }

    if (!content) {
      setError("Content cannot be empty");
      return;
    }

    const formData = new FormData();

    formData.append("interior_designer_id", admin.data.data.interiordesigner.id);
    formData.append("content", content);
    images.forEach((image) => formData.append("upload_images", image));

    createNewStory.mutate(formData, {
      onSuccess: (response) => {
        if (response.status == 200) {
          action();
        }
      },
    });
  };

  return (
    <>
      <CustomPopUp action={() => {}}>
        <Header>
          <span></span>
          <h5>Create new story</h5>
          <XButton action={action} />
        </Header>

        <TextArea
          value={content}
          onChange={(ev) => setContent(ev.target.value)}
          placeholder="What is your new story"
        />

        <ImageContainer>
          {images.length > 0 && (
            <Images>
              {images.map((item, index) => {
                return (
                  <ImageItem key={index}>
                    <ImageLayout>
                      <AiOutlineClose
                        onClick={() => {
                          setImages((prev) => [...prev.filter((_, pos) => pos != index)]);
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

          {images.length == 0 && (
            <AddImageButton onClick={() => inputRef.current.click()}>
              <BiImageAdd />
              <span>Add Image</span>
            </AddImageButton>
          )}
          <input ref={inputRef} onChange={handleImageChange} type="file" multiple />
        </ImageContainer>
        <ButtonContainer>
          <Button1 onClick={onCreateNewStory}>Upload</Button1>
        </ButtonContainer>
      </CustomPopUp>
      {imageError && <ErrorPopUp message={imageError} action={() => setImageError("")} />}
      {error && <ErrorPopUp message={error} action={() => setError("")} />}
    </>
  );
}
