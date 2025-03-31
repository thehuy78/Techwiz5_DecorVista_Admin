import { useState } from "react";
import styled, { css } from "styled-components";
import Avatar from "react-avatar";
import { adminRequest } from "@/shared/api/adminApi";
import getFirebaseImageUrl from "@/shared/utils/getFireBaseImage";
import NewStoryPopUp from "../designer_stories/components/NewStoryPopUp";
import { getAdminStoryRequest } from "./api/adminStoryApi";
import Pagination from "@/shared/components/Pagination/pagination";
import { formatDate } from "@/shared/utils/DateTimeHandle";
import getWords from "@/shared/utils/getWords";
import StoryPopUp from "./components/StoryPopUp";
import "react-date-range/dist/styles.css"; // main css file
import "react-date-range/dist/theme/default.css"; // theme css file
import { DateRangePicker } from "react-date-range";
import { DateRange } from "react-date-range";
import { addDays } from "date-fns";
import { DefinedRange } from "react-date-range";
import Button1 from "@/shared/components/Button/Button1";
import TextInput from "@/shared/components/Input/TextInput";
import SelectInput from "@/shared/components/Input/SelectInput";
import { changeStoryStatusRequest } from "./api/adminStoryApi";

const Container = styled.div`
  margin: 2rem;
  padding: 0 1rem;

  display: grid;
  grid-template-columns: 3fr 1fr;
`;

const LeftContainer = styled.div`
  padding: 0 1rem;

  display: flex;
  flex-direction: column;
`;

const NewButton = styled.div`
  background-color: #f0f2f5;
  padding: 1rem;
  border-radius: 50px;

  color: rgba(0, 0, 0, 0.5);
  flex: 1;
  cursor: pointer;

  &:hover {
    background-color: #e4e6e8;
  }
`;

const RightContainer = styled.div`
  > div {
    box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;

    position: sticky;
    top: 5rem;
  }
`;

const NewStoryContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;

  box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;
  background-color: white;
  padding: 1rem;
`;

const StoryContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  margin: 1rem 0;
`;

const StoryItem = styled.div`
  box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;
  background-color: white;

  display: flex;
  flex-direction: column;
  gap: 1rem;

  & button {
    background-color: white;
    border: none;
    color: blue;
  }

  > div:nth-of-type(1) {
    font-size: 17px;
    font-weight: 600;
    padding: 1rem;
  }

  > div:nth-of-type(2) {
    padding: 0 1rem;
  }
`;

const Footer = styled.div``;

const ImageContainer = styled.div`
  display: grid;

  & img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  ${(props) => {
    if (props.$length == 1) {
      return css`
        > div {
          height: 40rem;
        }
      `;
    }

    if (props.$length == 2) {
      return css`
        grid-template-columns: 1fr 1fr;
        gap: 1rem;
        > div {
          height: 20rem;
        }
      `;
    }

    if (props.$length == 3) {
      return css`
        grid-template-columns: 1fr 1fr 1fr;
        gap: 1rem;
        > div {
          height: 20rem;
        }
      `;
    }

    if (props.$length > 3) {
      return css`
        grid-template-columns: 1fr 1fr;
        gap: 1rem;
        > div {
          height: 15rem;
        }
      `;
    }
  }}
`;

const DateFilter = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;

  ${(props) => {
    if (props.$all) {
      return css`
        .all_date {
          color: blue;
        }
      `;
    }
  }}
`;

const Designer = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;

  > div:nth-of-type(2) {
    display: flex;
    flex-direction: column;
    gap: 3px;
    p {
      margin: 0;
      padding: 0;
    }

    > p:nth-of-type(2) {
      font-size: 14px;
      color: rgba(0, 0, 0, 0.4);
    }
  }

  & span {
    color: red;
  }
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
`;

const statusOptions = [
  { label: "All", value: "All" },
  { label: "Active", value: "true" },
  { label: "Unactive", value: "false" },
];

export default function AdminStory() {
  const [chosenUpdate, setChosenUpdate] = useState();
  const [currentPage, setCurrentPage] = useState(1);
  const admin = adminRequest();
  const [newStory, setNewStory] = useState(false);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState(statusOptions[0]);
  const changeStoryStatus = changeStoryStatusRequest();

  const current = new Date();

  const [date, setDate] = useState([
    {
      startDate: null,
      endDate: null,
      key: "selection",
    },
  ]);

  const getStory = getAdminStoryRequest(currentPage, 10, date[0], status.value, search);

  const onChangeStoryStatus = (storyId) => {
    const formData = new FormData();
    formData.append("storyId", storyId);

    changeStoryStatus.mutate(formData, {
      onSuccess: (response) => {
        if (response.status == 200) {
          getStory.refetch();
        }
      },
    });
  };

  return (
    <>
      <Container>
        <LeftContainer>
          <StoryContainer>
            {getStory.isSuccess &&
              getStory.data.data.map((story, index) => {
                const images = story.image.split("; ").filter((image) => image.length != 0);
                return (
                  <StoryItem key={index}>
                    <Header>
                      <Designer>
                        <div>
                          <Avatar
                            size="60"
                            round
                            src={getFirebaseImageUrl(story.interior_designer.avatar)}
                          />
                        </div>
                        <div>
                          <p>
                            {story.interior_designer.first_name} {story.interior_designer.last_name}{" "}
                            - <span>{!story.status ? "Unactive" : "Active"}</span>
                          </p>
                          <p>{formatDate(story.created_at)}</p>
                        </div>
                      </Designer>
                      <div>
                        <Button1 onClick={() => onChangeStoryStatus(story.id)}>
                          {story.status ? "Deactivate" : "Activate"}
                        </Button1>
                      </div>
                    </Header>
                    <div>
                      {getWords(story.content, 30)}{" "}
                      <button onClick={() => setChosenUpdate(story)}>See more</button>
                    </div>
                    <ImageContainer $length={images.length}>
                      {images.map((image, index) => {
                        if (index < 4)
                          return (
                            <div key={index}>
                              <img src={getFirebaseImageUrl(image)} />
                            </div>
                          );
                      })}
                    </ImageContainer>
                  </StoryItem>
                );
              })}
          </StoryContainer>
          <Footer>
            {getStory.isSuccess && (
              <Pagination
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                totalPage={getStory.data.totalPages}
              />
            )}
          </Footer>
        </LeftContainer>
        <RightContainer>
          <DateFilter $all={date[0].startDate != null && date[0].endDate != null ? false : true}>
            <SelectInput options={statusOptions} state={status} setState={setStatus} />
            <TextInput
              placeholder={"Search for designer name, email"}
              state={search}
              setState={setSearch}
            />
            <DateRange
              editableDateInputs={true}
              onChange={(item) => setDate([item.selection])}
              moveRangeOnFirstSelection={false}
              ranges={date}
            />
            <Button1
              className={"all_date"}
              onClick={() => {
                setDate([
                  {
                    startDate: null,
                    endDate: null,
                    key: "selection",
                  },
                ]);
              }}
            >
              All Date
            </Button1>
          </DateFilter>
        </RightContainer>
      </Container>

      {newStory && (
        <NewStoryPopUp
          action={() => {
            getStory.refetch();
            setNewStory();
          }}
        />
      )}
      {chosenUpdate && (
        <StoryPopUp
          action={() => {
            getStory.refetch();
            setChosenUpdate();
          }}
          story={chosenUpdate}
        />
      )}
    </>
  );
}
