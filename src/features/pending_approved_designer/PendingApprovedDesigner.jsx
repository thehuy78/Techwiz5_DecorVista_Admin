import styled from "styled-components";
import { useState } from "react";
import Pagination from "@/shared/components/Pagination/pagination";
import { getPendingApprovedRequest } from "./api/pendingApprovedApi";
import WaitingIcon from "@/shared/components/AnimationIcon/WaitingIcon";
import Button2 from "@/shared/components/Button/Button2";
import Avatar from "react-avatar";
import getFirebaseImageUrl from "@/shared/utils/getFireBaseImage";
import { approveDesignerRequest } from "./api/pendingApprovedApi";
import { denyDesignerRequest } from "./api/pendingApprovedApi";
import ConfirmPopUp from "@/shared/components/PopUp/ConfirmPopUp";
import TextEditor from "../product/components/TextEditor/TextEditor";
import PopUp from "@/shared/components/PopUp/PopUp";
import TextInput from "@/shared/components/Input/TextInput";
import Button1 from "@/shared/components/Button/Button1";
import SelectReact from "react-select";
import NumberInput from "@/shared/components/Input/NumberInput";
import { useNavigate } from "react-router-dom";

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

const ButtonContainer = styled.div`
  display: flex;
  gap: 10px;
`;

const CustomButton2 = styled(Button2)`
  width: 80px;
`;

export default function PendingApprovedDesigner() {
  const [rangeValue, setRangeValue] = useState(0);
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const approveDesigner = approveDesignerRequest();
  const denyDesigner = denyDesignerRequest();
  const [search, setSearch] = useState("");
  const [specializeSearch, setSpecializeSearch] = useState("");
  const getPendingApproved = getPendingApprovedRequest(
    currentPage,
    10,
    rangeValue,
    specializeSearch,
    search
  );
  const [approveConfirm, setApproveConfirm] = useState();
  const [denyConfirm, setDenyConfirm] = useState();
  const [isPopUp, setIsPopUp] = useState();
  const [isFilterDropDown, setIsFilterDropDown] = useState(false);

  const [from, setFrom] = useState(0);

  const onApprove = (designerId) => {
    const formData = new FormData();

    formData.append("designerId", designerId);

    approveDesigner.mutate(formData, {
      onSuccess: (response) => {
        if (response.status == 200) {
          getPendingApproved.refetch();
          setApproveConfirm(false);
        }
      },
    });
  };

  const onDeny = (designerId) => {
    const formData = new FormData();

    formData.append("designerId", designerId);

    denyDesigner.mutate(formData, {
      onSuccess: (response) => {
        if (response.status == 200) {
          getPendingApproved.refetch();
          setDenyConfirm(false);
        }
      },
    });
  };

  return (
    <>
      <Container>
        {getPendingApproved.isLoading && (
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
        </SearchContainer>
        {getPendingApproved.isSuccess && (
          <TableContent>
            <thead>
              <tr>
                <th>Email</th>
                <th>Full name</th>
                <th>Address</th>
                <th>Specialization</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {getPendingApproved.data.data.map((item, index) => {
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
                      <ButtonContainer>
                        <CustomButton2 onClick={() => setApproveConfirm(item.id)}>
                          Accept
                        </CustomButton2>
                        <CustomButton2 onClick={() => setDenyConfirm(item.id)}>Deny</CustomButton2>
                        <CustomButton2
                          onClick={() => navigate("/pending_detail?id=" + item.user.id)}
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
          {getPendingApproved.isSuccess && (
            <Pagination
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              totalPage={getPendingApproved.data.totalPages}
            />
          )}
        </Footer>
      </Container>
      {approveConfirm && (
        <ConfirmPopUp
          message={"confirm?"}
          confirm={() => onApprove(approveConfirm)}
          cancel={() => setApproveConfirm()}
        />
      )}
      {denyConfirm && (
        <ConfirmPopUp
          message={"confirm?"}
          confirm={() => onDeny(denyConfirm)}
          cancel={() => setDenyConfirm()}
        />
      )}
      {isPopUp && <PortfolioPopUp content={isPopUp} action={() => setIsPopUp("")} />}
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
