import React from "react";
import styled from "styled-components";
import { useState } from "react";
import PopUp from "@/shared/components/PopUp/PopUp";
import XButton from "@/shared/components/Button/XButton";
import SelectReact from "react-select";
import Button1 from "@/shared/components/Button/Button1";
import { sendAdminNotificationRequest } from "../api/adminNotificationApi";

const CustomPopUp = styled(PopUp)`
  margin: 0;
  padding: 0;
  min-width: 50rem;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  padding-top: 1rem;
`;

const Body = styled.div`
  padding: 1rem;
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

const Footer = styled.div`
  display: flex;
  justify-content: flex-end;
  padding-top: 1rem;
  padding-right: 1rem;
  padding-bottom: 1rem;
`;

const options = [
  { label: "Designer", value: "designer" },
  { label: "Customer", value: "customer" },
];

const SelectContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-bottom: 1rem;
`;

export default function SendNotification({ action }) {
  const sendAdminNotification = sendAdminNotificationRequest();
  const [message, setMessage] = useState("");
  const [sendTo, setSendTo] = useState();

  const onSendNotification = () => {
    if (!sendTo || sendTo.length == 0) {
      alert("Please select type of user");
      return;
    }

    if (!message) {
      alert("Message is empty");
      return;
    }

    const formData = new FormData();

    sendTo.forEach((to) => formData.append("sendTo", to.value));
    formData.append("message", message);
    sendAdminNotification.mutate(formData, {
      onSuccess: (response) => {
        if (response.status == 200) {
          alert("success");
          action();
        }
      },
    });
  };

  return (
    <CustomPopUp action={() => {}}>
      <Header>
        <span></span>
        <h5>Notification</h5>
        <XButton action={action} />
      </Header>
      <hr />
      <Body>
        <SelectContainer>
          <SelectReact
            value={sendTo}
            onChange={setSendTo}
            closeMenuOnSelect={false}
            isMulti
            options={options}
          />
        </SelectContainer>

        <TextArea value={message} onChange={(ev) => setMessage(ev.target.value)} />
      </Body>
      <Footer>
        <Button1 onClick={onSendNotification}>Send</Button1>
      </Footer>
    </CustomPopUp>
  );
}
