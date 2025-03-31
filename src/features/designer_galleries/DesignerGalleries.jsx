import { useState } from "react";
import styled, { css } from "styled-components";
import { getDesignerGalleriesRequest } from "./api/designerGalleriesApi";
import Pagination from "@/shared/components/Pagination/pagination";
import { useNavigate } from "react-router-dom";
import SelectReact from "react-select";
import Button1 from "@/shared/components/Button/Button1";
import TextInput from "@/shared/components/Input/TextInput";
import { Link } from "react-router-dom";
import SelectInput from "@/shared/components/Input/SelectInput";
import Avatar from "react-avatar";
import getFirebaseImageUrl from "@/shared/utils/getFireBaseImage";
import Button2 from "@/shared/components/Button/Button2";
import roomOptions from "../add_gallery/data/roomOptions";
import chroma from "chroma-js";

const StyledContainer = styled.div`
  margin: 2rem;
  padding: 2rem;
  background-color: white;
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

const ColorTone = styled.span`
  display: flex;
  align-items: center;

  &::before {
    background-color: ${(props) => `${props.$color}`};
    content: " ";
    display: inline-block;
    width: 20px;
    height: 20px;
    margin-right: 12px;
    border: 2px solid #000;
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

const colourOptions = [
  { value: "", label: "All", color: "#808080" },
  { value: "white", label: "White", color: "#e9ecef" },
  { value: "black", label: "Black", color: "#000000" },
  { value: "ocean", label: "Ocean", color: "#00B8D9" },
  { value: "blue", label: "Blue", color: "#0052CC" },
  { value: "purple", label: "Purple", color: "#5243AA" },
  { value: "red", label: "Red", color: "#FF5630" },
  { value: "orange", label: "Orange", color: "#FF8B00" },
  { value: "yellow", label: "Yellow", color: "#FFC400" },
  { value: "green", label: "Green", color: "#36B37E" },
  { value: "forest", label: "Forest", color: "#00875A" },
  { value: "slate", label: "Slate", color: "#253858" },
  { value: "silver", label: "Silver", color: "#666666" },
];

export default function DesignerGalleries() {
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSeach] = useState("");
  const navigate = useNavigate();
  const [colorTone, setColorTone] = useState(colourOptions[0]);

  const [filterStatus, setFilterStatus] = useState(activeOptions[0]);
  const [isFilterDropDown, setIsFilterDropDown] = useState(false);
  const [by, setBy] = useState([]);
  const [designerName, setDesignerName] = useState("");

  const getDesignerGalleries = getDesignerGalleriesRequest(
    currentPage,
    10,
    filterStatus.value,
    colorTone.value,
    search
  );

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

  return (
    <StyledContainer>
      <SearchContainer>
        <FilterBox>
          <Button1 onClick={() => setIsFilterDropDown((prev) => !prev)}>Filter Option</Button1>
          {isFilterDropDown && (
            <FilterDropDown>
              <div>
                <h5>Color tone</h5>
                <SelectReact
                  value={colorTone}
                  onChange={setColorTone}
                  options={colourOptions}
                  styles={colourStyles}
                />
              </div>
            </FilterDropDown>
          )}
        </FilterBox>
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

            <th>Room type</th>
            <th>Color tone</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {getDesignerGalleries.isSuccess &&
            getDesignerGalleries.data.data.map((gallery, index) => {
              return (
                <tr key={index}>
                  <td>
                    <EmailColumn>
                      <Avatar
                        size={60}
                        round
                        src={getFirebaseImageUrl(gallery.imageName.split("; ")[1])}
                      />{" "}
                      <div>
                        <CustomLink to={"/update_gallery?id=" + gallery.id}>
                          {getWords(gallery.gallery_name, 5)}
                        </CustomLink>
                        <span className="date">Added {convertDate(gallery.created_date)}</span>
                      </div>
                    </EmailColumn>
                  </td>
                  <td>{roomOptions.find((room) => room.value == gallery.room_type_id).label}</td>
                  <td>
                    <ColorTone
                      $color={
                        colourOptions.find((color) => color.value == gallery.color_tone).color
                      }
                    >
                      {colourOptions.find((color) => color.value == gallery.color_tone).label}
                    </ColorTone>
                  </td>
                  <td>
                    {gallery.status ? <Active>Active</Active> : <Deactive>Not active</Deactive>}
                  </td>
                  <td>
                    <Button2 onClick={() => navigate("/update_gallery?id=" + gallery.id)}>
                      Detail
                    </Button2>
                  </td>
                </tr>
              );
            })}
        </tbody>
      </TableContent>

      <Footer>
        {getDesignerGalleries.isSuccess && (
          <Pagination
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            totalPage={getDesignerGalleries.data.totalPages}
          />
        )}
      </Footer>
    </StyledContainer>
  );
}
