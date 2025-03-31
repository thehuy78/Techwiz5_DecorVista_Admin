import styled from "styled-components";
import { useState } from "react";
import Pagination from "@/shared/components/Pagination/pagination";
import WaitingIcon from "@/shared/components/AnimationIcon/WaitingIcon";
import Button2 from "@/shared/components/Button/Button2";
import Avatar from "react-avatar";
import getFirebaseImageUrl from "@/shared/utils/getFireBaseImage";
import TextEditor from "../product/components/TextEditor/TextEditor";
import PopUp from "@/shared/components/PopUp/PopUp";
import { getApprovedDesignerRequest } from "./api/designerListApi";
import { changeDesignerStatusRequest } from "./api/designerListApi";
import ConfirmPopUp from "@/shared/components/PopUp/ConfirmPopUp";
import TextInput from "@/shared/components/Input/TextInput";
import Button1 from "@/shared/components/Button/Button1";
import { useNavigate } from "react-router-dom";
import SelectInput from "@/shared/components/Input/SelectInput";

const Container = styled.div`
  background-color: white;
  margin: 2rem;
  padding: 2rem;
  min-height: 80vh;
`;

const WaitingContainer = styled.div`
  height: 70vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Footer = styled.div`
  margin-top: 5rem;
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

const PermissionColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;

  > div {
    display: flex;
    gap: 1rem;
    /* margin: 10px 0; */
  }
`;

const SearchContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 2rem;
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 10px;
`;

const CustomButton2 = styled(Button2)`
  width: 80px;
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

  > div {
    > div {
      display: flex;
      gap: 1rem;
    }
  }
`;

const activeOptions = [
  { label: "Active", value: true },
  { label: "Not active", value: false },
];

const CustomSelectInput = styled(SelectInput)`
  width: 15rem;
`;

export default function DesignerList() {
  const navigate = useNavigate();
  const [isFilterDropDown, setIsFilterDropDown] = useState(false);
  const [rangeValue, setRangeValue] = useState(0);
  const [specializeSearch, setSpecializeSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [active, setActive] = useState(activeOptions[0]);
  const getApprovedDesigner = getApprovedDesignerRequest(
    currentPage,
    10,
    rangeValue,
    active.value,
    specializeSearch,
    search
  );
  const changeDesignerStatus = changeDesignerStatusRequest();
  const [isPopUp, setIsPopUp] = useState();
  const [isConfirm, setIsConfirm] = useState();

  const onChangeDesignerStatus = (designerId) => {
    const formData = new FormData();

    formData.append("designerId", designerId);

    changeDesignerStatus.mutate(formData, {
      onSuccess: (response) => {
        if (response.status == 200) {
          setIsConfirm();
          getApprovedDesigner.refetch();
        }
      },
    });
  };

  return (
    <>
      <Container>
        {getApprovedDesigner.isLoading && (
          <WaitingContainer>
            <WaitingIcon />
          </WaitingContainer>
        )}

        <SearchContainer>
          <FilterBox>
            <Button1 onClick={() => setIsFilterDropDown((prev) => !prev)}>Filter Option</Button1>
            {isFilterDropDown && (
              <FilterDropDown>
                <div>
                  <h5>Year of experience from: </h5>
                  <div>
                    <input
                      value={rangeValue}
                      onChange={(ev) => setRangeValue(ev.target.value)}
                      type="range"
                      min={0}
                      max={100}
                    />
                    <span>{rangeValue}</span>
                  </div>
                </div>
                <div>
                  <h5>Specialize</h5>
                  <TextInput
                    state={specializeSearch}
                    setState={setSpecializeSearch}
                    placeholder={"Search for specialization"}
                  />
                </div>
              </FilterDropDown>
            )}
          </FilterBox>
          <TextInput
            state={search}
            setState={setSearch}
            placeholder={"Search for name, address, email"}
          />
          <CustomSelectInput state={active} setState={setActive} options={activeOptions} />
        </SearchContainer>
        {getApprovedDesigner.isSuccess && (
          <TableContent>
            <thead>
              <tr>
                <th>Email</th>
                <th>Full name</th>
                <th>Address</th>
                <th>Specialization</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {getApprovedDesigner.data.data.map((item, index) => {
                return (
                  <tr key={index}>
                    <td>
                      <EmailColumn>
                        <Avatar
                          round
                          size="60"
                          name={item.first_name}
                          src={getFirebaseImageUrl(item.avatar)}
                        />
                        <div>
                          <span>{item.user.email}</span>
                          <span>{item.yearsofexperience} Year of experience</span>
                        </div>
                      </EmailColumn>
                    </td>
                    <td>{item.first_name + " " + item.last_name}</td>
                    <td>{item.address}</td>
                    <td>{item.specialization}</td>
                    <td>
                      {item.status ? <Active>Active</Active> : <Deactive>Inactive</Deactive>}{" "}
                    </td>
                    <td>
                      <ButtonContainer>
                        <CustomButton2 onClick={() => setIsConfirm(item.id)}>
                          {item.status ? "Deactive" : "Active"}
                        </CustomButton2>
                        <CustomButton2
                          onClick={() => navigate("/designer_detail?id=" + item.user_id)}
                        >
                          Detail
                        </CustomButton2>
                      </ButtonContainer>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </TableContent>
        )}
        <Footer>
          {getApprovedDesigner.isSuccess && (
            <Pagination
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              totalPage={getApprovedDesigner.data.totalPages}
            />
          )}
        </Footer>
      </Container>
      {isPopUp && <PortfolioPopUp content={isPopUp} action={() => setIsPopUp("")} />}
      {isConfirm && (
        <ConfirmPopUp
          message={"confirm?"}
          cancel={() => setIsConfirm(false)}
          confirm={() => onChangeDesignerStatus(isConfirm)}
        />
      )}
    </>
  );
}

const PopUpContainer = styled(PopUp)`
  width: 70%;
`;

function PortfolioPopUp({ content, action }) {
  return (
    <PopUpContainer action={action}>
      <TextEditor state={content} />
    </PopUpContainer>
  );
}
