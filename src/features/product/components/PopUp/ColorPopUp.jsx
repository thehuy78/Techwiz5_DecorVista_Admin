import React from "react";
import PopUp from "@/shared/components/PopUp/PopUp";
import { useState } from "react";
import styled from "styled-components";
import TextInput from "@/shared/components/Input/TextInput";
import chroma from "chroma-js";

const StyledPopUp = styled(PopUp)`
  max-width: 600px;
  display: flex;
  flex-direction: column;
  gap: 2rem;
  padding: 0;
`;

const Header = styled.div`
  font-size: 18px;
  padding: 1rem 1rem 0;
`;

const Content = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  row-gap: 2rem;
  column-gap: 2rem;
  padding: 1rem;

  > div {
    display: flex;
    flex-direction: column;
    gap: 5px;
  }

  & h4 {
    font-size: 14px;
    color: rgba(0, 0, 0, 0.7);
  }
`;

const Button = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  padding: 0rem 1rem 1rem;

  > button {
    cursor: pointer;
    color: white;
    background-color: #2962ff;
    border: none;
    padding: 0.3rem 1rem;
    border-radius: 5px;

    &:hover {
      background-color: #0052cc;
    }
  }
`;

export default function ColorPopUp({ action, state, setState }) {
  return (
    <StyledPopUp action={() => {}}>
      <Header>
        <span>Edit Color</span>
      </Header>
      <hr />
      <Content>
        {state.map((colorObj, index) => {
          return (
            <div key={index}>
              <p>{colorObj.color}</p>
              <TextInput state={colorObj.hex} setState={() => {}} placeholder={"Input hexa code"} />
            </div>
          );
        })}
      </Content>
      <hr />
      <Button>
        <button>Ok</button>
        <button onClick={action}>Cancel</button>
      </Button>
    </StyledPopUp>
  );
}
