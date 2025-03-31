import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { GetBlogById, ActiveBlog } from "../api/blogApi";
import styled from "styled-components";
import TextEditor from "@/features/product/components/TextEditor/TextEditor";
import { adminRequest } from "@/shared/api/adminApi";
import TextInput from "@/shared/components/Input/TextInput";
import Avatar from "react-avatar";
import { useEffect } from "react";
import { useState } from "react";
import { useRef } from "react";
import getFirebaseImageUrl from "@/shared/utils/getFireBaseImage";
import notfound from "@/shared/assets/images/404.png";
import Button1 from "@/shared/components/Button/Button1";
import { updateBlogRequest } from "../api/blogApi";
import ErrorPopUp from "@/shared/components/PopUp/ErrorPopUp";
import WaitingPopUp from "@/shared/components/PopUp/WaitingPopUp";
import CropImagePopUp from "@/shared/components/PopUp/CropImagePopUp";

const Container = styled.div`
  margin: 2rem;
  padding: 2rem;

  display: grid;
  grid-template-columns: 3fr 1fr;
  gap: 2rem;
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

const NotFound = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
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

const ButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;

  & h5 {
    font-size: 17px;
  }

  > div:nth-of-type(1) {
    display: flex;
    flex-direction: column;
    gap: 10px;
    > div {
      display: flex;
      gap: 1rem;
    }
    padding-bottom: 1rem;
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  }

  > div:nth-of-type(2) {
    display: flex;
    flex-direction: column;
  }
`;

export default function Blog() {
  const [imageCrop, setImageCrop] = useState();
  const imgUploadRef = useRef();
  const admin = adminRequest();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const idBlog = queryParams.get("id");
  const [title, setTitle] = useState();
  const getBlogById = GetBlogById(idBlog);
  const updateBlog = updateBlogRequest();
  const [content, setContent] = useState("");
  const [isUpdatable, setIsUpdatable] = useState(false);
  const [image, setImage] = useState();
  const [imageError, setImageError] = useState(false);

  const activeBlog = ActiveBlog();

  useEffect(() => {
    if (getBlogById.isSuccess && getBlogById.data.status == 200) {
      const data = getBlogById.data.data;
      setTitle(data.title);
      setContent(data.content);
      setImage(data.images);

      if (
        (admin.data.data.role == "admin" && getBlogById.data.data.interior_designer_id == null) ||
        (admin.data.data.role == "designer" &&
          admin.data.data.interiordesigner.id == getBlogById.data.data.interior_designer_id)
      ) {
        setIsUpdatable(true);
      }
    }
  }, [getBlogById.isSuccess]);

  if (getBlogById.isSuccess && getBlogById.data.status == 400) {
    return (
      <Container>
        <NotFound>
          <img src={notfound} />
        </NotFound>
      </Container>
    );
  }

  if (updateBlog.isPending) {
    return <WaitingPopUp />;
  }

  const handleAccept = (decision) => {
    const formData = new FormData();
    formData.append("blogId", idBlog);
    formData.append("yes", decision);
    activeBlog.mutate(formData, {
      onSuccess: () => {
        getBlogById.refetch();
      },
    });
  };

  const onUpdateBlog = () => {
    const formData = new FormData();

    formData.append("Id", getBlogById.data.data.id);
    formData.append("Title", title);
    formData.append("Content", content);

    if (typeof image == "object") {
      formData.append("Image", image);
    }

    updateBlog.mutate(formData, {
      onSuccess: (response) => {
        if (response.status == 200) {
          getBlogById.refetch();
        }
      },
    });
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

      setImageCrop(ev.target.files[0]);
      setImageError(null);
      ev.target.value = null;
    }
  };

  return (
    <>
      <Container>
        {getBlogById.isSuccess && (
          <>
            <LeftContainer>
              <div>
                <h5>Title</h5>
                <TextInput state={title} setState={isUpdatable && setTitle} />
              </div>
              <div>
                <h5>Conent</h5>
                <TextEditor state={content} setState={setContent} />
              </div>
              <div>
                <h5>Blog Cover</h5>
                <ImageDefault onClick={isUpdatable ? () => imgUploadRef.current.click() : () => {}}>
                  <Avatar
                    src={
                      typeof image == "object"
                        ? URL.createObjectURL(image)
                        : getFirebaseImageUrl(image)
                    }
                    size="300"
                    alt="Selected"
                  />
                </ImageDefault>
                <input
                  ref={imgUploadRef}
                  accept="image/*"
                  onChange={handleImageChange}
                  type="file"
                  id="images"
                  style={{ display: "none" }} // Hide the file input
                />
              </div>
            </LeftContainer>
            {(isUpdatable || admin.data.data.role == "admin") && (
              <RightContainer>
                <ButtonContainer>
                  {isUpdatable && (
                    <div>
                      <h5>This blog is updatable</h5>
                      <div>
                        <Button1 onClick={() => onUpdateBlog()}>Update</Button1>
                        <Button1 onClick={() => window.location.reload()}>Cancel</Button1>
                      </div>
                    </div>
                  )}
                  {admin.data.data.role == "admin" && (
                    <div>
                      <Button1
                        onClick={() => handleAccept(getBlogById.data.data.status ? false : true)}
                      >
                        {getBlogById.data.data.status ? "Deactive" : "Activate"}
                      </Button1>
                    </div>
                  )}
                </ButtonContainer>
              </RightContainer>
            )}
          </>
        )}
      </Container>
      {imageError && <ErrorPopUp message={imageError} action={() => setImageError()} />}
      {imageCrop && (
        <CropImagePopUp
          action={() => setImageCrop()}
          onSuccess={(image) => {
            setImage(image);
          }}
          image={imageCrop}
          aspect={1.5 / 1}
        />
      )}
    </>
  );
}
