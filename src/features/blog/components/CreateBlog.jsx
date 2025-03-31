import React, { useRef, useState } from "react";
import TextEditor from "@/features/product/components/TextEditor/TextEditor";
import styled from "styled-components";
import { CreateBlogMutation } from "../api/blogApi";
import "../assets/css/blog.css";
import { useNavigate } from "react-router-dom";
import Avatar from "react-avatar";
import { FaRegImages } from "react-icons/fa6";
import TextInput from "@/shared/components/Input/TextInput";
import Button1 from "@/shared/components/Button/Button1";
import ErrorPopUp from "@/shared/components/PopUp/ErrorPopUp";
import { adminRequest } from "@/shared/api/adminApi";
import CropImagePopUp from "@/shared/components/PopUp/CropImagePopUp";

const StyledError = styled.h5`
  font-size: 17px;
  color: red;
`;
const Container = styled.div`
  margin-bottom: 16px;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  font-size: 17px;
`;

const StyledContainer = styled.div`
  margin: 2rem;
  padding: 2rem;

  display: flex;
  flex-direction: column;
  gap: 1rem;

  display: grid;
  grid-template-columns: 3fr 1fr;
  gap: 2rem;
`;

const StyleContainerButton = styled.div`
  display: flex;
  justify-content: space-around;
  gap: 1rem;
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

const LeftContainer = styled.div`
  box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;
  background-color: white;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;

  > div {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
`;

const RightContainer = styled.div`
  > div {
    background-color: white;
    padding: 1rem;
    box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;
    position: sticky;
    top: 5rem;
  }
`;

export default function CreateBlog() {
  const [imageCrop, setImageCrop] = useState();
  const admin = adminRequest();
  const imgUploadRef = useRef();
  const [content, setContent] = useState("");
  const [errors, setErrors] = useState({});
  const [imageError, setImageError] = useState();
  const [imgSrc, setImgSrc] = useState();
  const [title, setTitle] = useState("");
  const createBlogMutation = CreateBlogMutation();
  const navi = useNavigate();

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

  const handleSubmit = () => {
    let isOk = true;

    if (!title) {
      setErrors((prev) => {
        return { ...prev, title: "Title cannot be empty" };
      });
      isOk = false;
    } else {
      setErrors((prev) => {
        return { ...prev, title: null };
      });
    }

    if (!content) {
      setErrors((prev) => {
        return { ...prev, content: "Content cannot be empty" };
      });
      isOk = false;
    } else {
      setErrors((prev) => {
        return { ...prev, content: null };
      });
    }

    if (!imgSrc) {
      setErrors((prev) => {
        return { ...prev, image: "Image cannot be empty" };
      });
      isOk = false;
    } else {
      setErrors((prev) => {
        return { ...prev, image: null };
      });
    }

    if (isOk) {
      const formData = new FormData();

      // Append các dữ liệu cần thiết vào FormData
      formData.append("title", title);
      formData.append("content", content);
      formData.append("imagesFile", imgSrc); // Append tệp hình ảnh

      // Gọi mutation để submit form
      createBlogMutation.mutate(formData, {
        onSuccess: (response) => {
          if (response.status == 200) {
            if (admin.data.data.role == "admin") {
              navi("/blog");
            } else {
              navi("/designer_blogs");
            }
            return;
          }

          console.log(response);
        },
        onError: (error) => {
          console.log(error);
        },
      });
    }
  };

  return (
    <>
      <StyledContainer>
        <LeftContainer>
          <Container>
            <h5>Blog Title</h5>
            <TextInput state={title} setState={setTitle} />
          </Container>
          {errors.title && <StyledError>{errors.title}</StyledError>}

          <Container>
            <h5>Blog content</h5>
            <TextEditor state={content} setState={setContent} />
          </Container>
          {errors.content && <StyledError>{errors.content}</StyledError>}

          <Container>
            <h5>Blog Cover</h5>
            <ImageDefault onClick={() => imgUploadRef.current.click()}>
              {imgSrc ? (
                <Avatar src={URL.createObjectURL(imgSrc)} size="300" alt="Selected" />
              ) : (
                <FaRegImages />
              )}
            </ImageDefault>
            <input
              ref={imgUploadRef}
              accept="image/*"
              onChange={handleImageChange}
              type="file"
              id="images"
              style={{ display: "none" }} // Hide the file input
            />
          </Container>
          {errors.image && <StyledError>{errors.image}</StyledError>}
        </LeftContainer>

        <RightContainer>
          <StyleContainerButton>
            <Button1 onClick={() => window.location.reload()}>Cancel</Button1>
            <Button1 onClick={handleSubmit}>Submit</Button1>
          </StyleContainerButton>
        </RightContainer>
      </StyledContainer>
      {imageError && <ErrorPopUp message={imageError} action={() => setImageError()} />}
      {imageCrop && (
        <CropImagePopUp
          action={() => setImageCrop()}
          onSuccess={(image) => {
            setImgSrc(image);
          }}
          image={imageCrop}
          aspect={1.5 / 1}
        />
      )}
    </>
  );
}
