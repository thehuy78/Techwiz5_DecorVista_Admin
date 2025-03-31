import React, { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import getFirebaseImageUrl from "@/shared/utils/getFireBaseImage";
import styled, { css } from "styled-components";
import Avatar from "react-avatar";
import Button2 from "@/shared/components/Button/Button2";
import Pagination from "@/shared/components/Pagination/pagination";
import TextInput from "@/shared/components/Input/TextInput";
import { Link } from "react-router-dom";
import SelectInput from "@/shared/components/Input/SelectInput";
import { getBlogByDesignerRequest } from "../api/blogApi";

const StyledContainer = styled.div`
  margin: 2rem;
  padding: 2rem;
  background-color: white;

  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const TableContent = styled.table`
  border-collapse: collapse;
  width: 100%;
  min-width: 700px;
  overflow-x: scroll;
  font-size: 0.9em;
  overflow: hidden;

  thead tr {
    /* background-color: #0091ea; */
    /* color: #ffffff; */
    border-bottom: 3px solid #eeeff4;
    text-align: left;
    font-weight: bold;
  }

  & p {
    text-align: left;
  }

  th,
  td {
    padding: 18px 15px;
  }

  tbody tr {
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  }

  tbody tr:last-of-type {
    border-bottom: 2px solid #009879;
  }

  tbody tr.active-row {
    font-weight: bold;
    color: #009879;
  }
`;

const FilterHeader = styled.div`
  display: flex;
  transition: all 1s linear;

  & > p {
    background-color: white;
    text-align: center;
    padding-bottom: 1rem;
  }
`;

const FilterButton = styled.p`
  flex: 1;
  cursor: pointer;
  border-bottom: 2px solid white;

  ${(props) => {
    if (props.$active) {
      return css`
        border-bottom: 2px solid red;
      `;
    }
  }}
`;

const EmailColumn = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;

  & > div {
    display: flex;
    flex-direction: column;
    gap: 5px;

    & span:nth-of-type(1) {
      font-weight: 500;
    }

    & span:nth-of-type(2) {
      font-size: 13px;
      color: rgba(0, 0, 0, 0.5);
    }

    & .date {
      font-size: 13px;
      color: rgba(0, 0, 0, 0.5);
    }
  }
`;

const Active = styled.span`
  &::before {
    background-color: red;
    border-color: #78d965;
    box-shadow: 0px 0px 6px 1.5px #94e185;
    content: " ";
    display: inline-block;
    width: 10px;
    height: 10px;
    margin-right: 12px;
    border: 1px solid #000;
    border-radius: 10px;
  }
`;

const Deactive = styled.span`
  &::before {
    background-color: #ffc182;
    border-color: #ffb161;
    box-shadow: 0px 0px 6px 1.5px #ffc182;
    content: " ";
    display: inline-block;
    width: 10px;
    height: 10px;
    margin-right: 12px;
    border: 1px solid #000;
    border-radius: 10px;
  }
`;

const Footer = styled.div`
  margin-top: 5rem;
`;

const SearchContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 2rem;
`;

const FilterBox = styled.div`
  position: relative;
  > button {
    width: max-content;
  }
`;

const FilterDropDown = styled.div`
  margin-top: 5px;
  background-color: white;
  position: absolute;
  width: 200%;

  box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
  padding: 1rem;

  h5 {
    font-size: 16px;
  }

  display: flex;
  flex-direction: column;
  gap: 1rem;

  & .active_filter {
    display: flex;
    gap: 1rem;
  }
`;

const CustomSelectInput = styled(SelectInput)`
  width: 15rem;
`;

const activeOptions = [
  { label: "Active", value: true },
  { label: "Not active", value: false },
];

const byOptions = [
  { label: "Admin", value: "Admin" },
  { label: "Designer", value: "Designer" },
];

const CustomLink = styled(Link)``;

export default function DesignerBlogs() {
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();
  const [search, setSeach] = useState("");
  const [filterStatus, setFilterStatus] = useState(activeOptions[0]);
  const getBlogByDesigner = getBlogByDesignerRequest(currentPage, 10, filterStatus.value, search);

  const convertDate = (dateStr) => {
    const dateObj = new Date(dateStr);
    const formattedDate = dateObj.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
    return formattedDate;
  };

  const onChangeBlog = (blogId, yes) => {
    const formData = new FormData();

    formData.append("blogId", blogId);
    formData.append("yes", !yes);

    activeBlog.mutate(formData, {
      onSuccess: (response) => {
        if (response.status == 200) {
          getBlogByDesigner.refetch();
        }
      },
    });
  };

  function getWords(str, n) {
    // Split the string into an array of words
    const words = str.split(" ");

    // If the number of words is less than or equal to n, return the string as is
    if (words.length <= n) {
      return str;
    }

    // Otherwise, return the first n words joined with spaces and add "..."
    return words.slice(0, n).join(" ") + "...";
  }

  return (
    <StyledContainer>
      <SearchContainer>
        <TextInput state={search} setState={setSeach} placeholder={"Search"} />
        <CustomSelectInput
          state={filterStatus}
          setState={setFilterStatus}
          options={activeOptions}
        />
      </SearchContainer>

      <TableContent>
        <thead>
          <tr>
            <th>Name</th>

            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {getBlogByDesigner.isSuccess &&
            getBlogByDesigner.data.data.map((blog, index) => {
              return (
                <tr key={index}>
                  <td>
                    <EmailColumn>
                      <Avatar size={60} round src={getFirebaseImageUrl(blog.images)} />{" "}
                      <div>
                        <CustomLink to={"/getblogbyid?id=" + blog.id}>
                          {getWords(blog.title, 5)}
                        </CustomLink>
                        <span className="date">Added {convertDate(blog.createdDate)}</span>
                      </div>
                    </EmailColumn>
                  </td>
                  <td>{blog.status ? <Active>Active</Active> : <Deactive>Not active</Deactive>}</td>
                  <td>
                    <Button2 onClick={() => navigate("/getblogbyid?id=" + blog.id)}>Detail</Button2>
                  </td>
                </tr>
              );
            })}
        </tbody>
      </TableContent>

      <Footer>
        {getBlogByDesigner.isSuccess && (
          <Pagination
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            totalPage={getBlogByDesigner.data.totalPages}
          />
        )}
      </Footer>
    </StyledContainer>
  );
}
