import { useState } from "react";
import styled from "styled-components";
import { getEmployeeRequest } from "./api/employeeListApi";
import Pagination from "@/shared/components/Pagination/pagination";
import WaitingIcon from "@/shared/components/AnimationIcon/WaitingIcon";
import Avatar from "react-avatar";
import { formatDate } from "@/shared/utils/DateTimeHandle";
import InputCheckBox from "@/shared/components/Input/InputCheckBox";
import { changeEmployeePermissionRequest } from "./api/employeeListApi";
import { changeEmployeeActiveRequest } from "./api/employeeListApi";
import ConfirmPopUp from "@/shared/components/PopUp/ConfirmPopUp";
import SuccessPopUp from "@/shared/components/PopUp/SuccessPopUp";
import Button2 from "@/shared/components/Button/Button2";
import { useNavigate } from "react-router-dom";
import getFirebaseImageUrl from "@/shared/utils/getFireBaseImage";

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

const ButtonContainer = styled.div`
  display: flex;
  gap: 10px;
`;

const CustomButton2 = styled(Button2)`
  width: 80px;
`;

export default function EmployeeList() {
  const navigate = useNavigate();
  const changeEmployeeActive = changeEmployeeActiveRequest();
  const changeEmployeePermission = changeEmployeePermissionRequest();

  const [changePermissionConfirm, setChangePermissionConfirm] = useState("");
  const [changeActiveConfirm, setChangeActiveConfirm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const employees = getEmployeeRequest(currentPage, 10);

  const onChangeEmployeeActive = (employeeId) => {
    const formData = new FormData();
    formData.append("userId", employeeId);

    changeEmployeeActive.mutate(formData, {
      onSuccess: (response) => {
        if (response.status == 200) {
          employees.refetch();
          setChangeActiveConfirm("");
          return;
        }
      },
      onError: (error) => {
        console.log(error);
      },
    });
  };

  const onChangeEmployeePermission = (employeeId, permissionName) => {
    const formData = new FormData();
    formData.append("userId", employeeId);
    formData.append("permissionName", permissionName);

    changeEmployeePermission.mutate(formData, {
      onSuccess: (response) => {
        if (response.status == 200) {
          employees.refetch();
          setChangePermissionConfirm("");
          return;
        }
      },
      onError: (error) => {
        console.log(error);
      },
    });
  };

  return (
    <>
      <Container>
        {employees.isLoading && (
          <WaitingContainer>
            <WaitingIcon />
          </WaitingContainer>
        )}

        {employees.isSuccess && (
          <TableContent>
            <thead>
              <tr>
                <th>Email</th>
                <th>Full name</th>
                <th>Phone number</th>
                <th>Gender</th>
                {/* <th>Dob</th> */}
                <th>Permission</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {employees.data.data.map((item, index) => {
                return (
                  <tr key={index}>
                    <td>
                      <EmailColumn>
                        <Avatar
                          round
                          size="60"
                          name={item.fullName}
                          src={getFirebaseImageUrl(item.avatar)}
                        />
                        <div>
                          <span>{item.email}</span>
                          <span>Added {formatDate(item.createdAt)}</span>
                        </div>
                      </EmailColumn>
                    </td>
                    <td>{item.fullName}</td>
                    <td>{item.phoneNumber}</td>
                    <td>{item.gender}</td>
                    {/* <td>{formatDate(item.dob)}</td> */}
                    <td>
                      <PermissionColumn>
                        <div>
                          <span>Permission A</span>
                          <InputCheckBox
                            onChange={() => {
                              setChangePermissionConfirm([item.id, "A"]);
                            }}
                            readOnly={false}
                            checked={item.permission.permissionA}
                          />
                        </div>
                        <div>
                          <span>Permission B</span>
                          <InputCheckBox
                            onChange={() => {
                              setChangePermissionConfirm([item.id, "B"]);
                            }}
                            readOnly={false}
                            checked={item.permission.permissionB}
                          />
                        </div>
                        <div>
                          <span>Permission C</span>
                          <InputCheckBox
                            onChange={() => {
                              setChangePermissionConfirm([item.id, "C"]);
                            }}
                            readOnly={false}
                            checked={item.permission.permissionC}
                          />
                        </div>
                      </PermissionColumn>
                    </td>
                    <td>
                      {item.isActive ? <Active>Active</Active> : <Deactive>Inactive</Deactive>}{" "}
                    </td>
                    <td>
                      <ButtonContainer>
                        <CustomButton2 onClick={() => setChangeActiveConfirm(item.id)}>
                          {item.isActive ? "Deactive" : "Active"}
                        </CustomButton2>
                        <CustomButton2
                          onClick={() => navigate(`/employee_update?employeeId=${item.id}`)}
                        >
                          Update
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
          {employees.isSuccess && (
            <Pagination
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              totalPage={employees.data.totalPages}
            />
          )}
        </Footer>
      </Container>
      {changeActiveConfirm && (
        <ConfirmPopUp
          message={`Confirm?`}
          confirm={() => onChangeEmployeeActive(changeActiveConfirm)}
          cancel={() => setChangeActiveConfirm("")}
        />
      )}
      {changePermissionConfirm && (
        <ConfirmPopUp
          message={`Confirm?`}
          confirm={() =>
            onChangeEmployeePermission(changePermissionConfirm[0], changePermissionConfirm[1])
          }
          cancel={() => setChangePermissionConfirm("")}
        />
      )}
    </>
  );
}
