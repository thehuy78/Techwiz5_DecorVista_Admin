import { useState } from "react";
import styled, { css } from "styled-components";
import { getAdminNotificationRequest } from "./api/adminNotificationApi";
import { deleteNotificationRequest } from "./api/adminNotificationApi";
import Pagination from "@/shared/components/Pagination/pagination";
import { formatDate } from "@/shared/utils/DateTimeHandle";
import getWords from "@/shared/utils/getWords";
import { Link } from "react-router-dom";
import Button2 from "@/shared/components/Button/Button2";
import { FaUserAlt } from "react-icons/fa";
import { FaPen } from "react-icons/fa";
import { FaImages } from "react-icons/fa";
import { IoHome } from "react-icons/io5";
import { MdOutlineViewTimeline } from "react-icons/md";
import { readNotificationRequest } from "./api/adminNotificationApi";
import SendNotification from "./components/SendNotification";
import Button1 from "@/shared/components/Button/Button1";

const Container = styled.div`
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

const Footer = styled.div`
  margin-top: 5rem;
`;

const CustomButton2 = styled(Button2)`
  width: max-content;
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 10px;
`;

const Header = styled.div`
  display: flex;
  padding: 1rem;

  justify-content: space-between;
`;

const IconButton = styled.button`
  background-color: white;
  border: none;
  border-bottom: 2px solid rgba(0, 0, 0, 0.1);
  padding: 0 2rem 1rem 2rem;
  transition: all 0.5s;
  > svg {
    font-size: 25px;
    color: #563e7c;
  }

  ${(props) => {
    if (props.$active) {
      return css`
        border-bottom: 2px solid red;
      `;
    }
  }}
`;

const IconType = styled.div`
  font-size: 2rem;
  color: #563e7c;
`;

export default function AdminNotification() {
  const [currentPage, setCurrentPage] = useState(1);
  const [type, setType] = useState("");
  const getAdminNotification = getAdminNotificationRequest(type, currentPage, 10);
  const deleteNotification = deleteNotificationRequest();
  const readNotification = readNotificationRequest();
  const [isNotification, setIsNotification] = useState(false);

  const onDeleteNotification = (notificationId) => {
    const formData = new FormData();

    formData.append("notificationId", notificationId);

    deleteNotification.mutate(formData, {
      onSuccess: (response) => {
        if (response.status == 200) {
          getAdminNotification.refetch();
        }
      },
    });
  };

  const onReadNotification = (notificationId) => {
    const formData = new FormData();

    formData.append("notificationId", notificationId);

    readNotification.mutate(formData, {
      onSuccess: (response) => {
        if (response.status == 200) {
          getAdminNotification.refetch();
        }
      },
    });
  };

  return (
    <>
      <Container>
        <Header>
          <div>
            <IconButton $active={type == ""} onClick={() => setType("")}>
              <IoHome />
            </IconButton>
            <IconButton
              $active={type == "admin:designer"}
              onClick={() => setType("admin:designer")}
            >
              <FaUserAlt />
            </IconButton>
            <IconButton $active={type == "admin:blog"} onClick={() => setType("admin:blog")}>
              <FaPen />
            </IconButton>
            <IconButton $active={type == "admin:gallery"} onClick={() => setType("admin:gallery")}>
              <FaImages />
            </IconButton>
            <IconButton $active={type == "admin:order"} onClick={() => setType("admin:order")}>
              <MdOutlineViewTimeline />
            </IconButton>
          </div>
          <Button1 onClick={() => setIsNotification(true)}>Send Notification</Button1>
        </Header>
        <TableContent>
          <thead>
            <tr>
              <th>Added</th>
              <th>Type</th>
              <th>Message</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {getAdminNotification.isSuccess &&
              getAdminNotification.data.data.map((notification, index) => {
                return (
                  <tr key={index}>
                    <td>{formatDate(notification.created_date)}</td>
                    <td>
                      {notification.type == "admin:designer" && (
                        <IconType>
                          <FaUserAlt />
                        </IconType>
                      )}
                      {notification.type == "admin:gallery" && (
                        <IconType>
                          <FaImages />
                        </IconType>
                      )}
                      {notification.type == "admin:blog" && (
                        <IconType>
                          <FaPen />
                        </IconType>
                      )}
                      {notification.type == "admin:order" && (
                        <IconType>
                          <MdOutlineViewTimeline />
                        </IconType>
                      )}
                    </td>
                    <td>
                      {getWords(notification.message, 50)}{" "}
                      <Link to={notification.url}>See more</Link>
                    </td>
                    <td>
                      <ButtonContainer>
                        <Button2 onClick={() => onDeleteNotification(notification.id)}>
                          Delete
                        </Button2>
                        {!notification.is_read && (
                          <CustomButton2 onClick={() => onReadNotification(notification.id)}>
                            Mark as read
                          </CustomButton2>
                        )}
                      </ButtonContainer>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </TableContent>

        <Footer>
          {getAdminNotification.isSuccess && (
            <Pagination
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              totalPage={getAdminNotification.data.totalPages}
            />
          )}
        </Footer>
      </Container>
      {isNotification && <SendNotification action={() => setIsNotification(false)} />}
    </>
  );
}
