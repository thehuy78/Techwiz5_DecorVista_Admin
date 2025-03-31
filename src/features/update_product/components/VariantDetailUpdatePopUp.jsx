import React from "react";
import PopUp from "@/shared/components/PopUp/PopUp";
import { useState } from "react";
import styled from "styled-components";
import TextInput from "@/shared/components/Input/TextInput";

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

const regex = /^-?\d+(\.\d+)?$/;

const moneyRegex = /^(?=.*\d)\d*(?:\.\d*)?$/;

export default function VariantDetailUpdatePopUp({ action, state, setState }) {
  const [salePrice, setSalePrice] = useState(state.price);
  const [comparePrice, setComparePrice] = useState(state.saleprice);

  return (
    <StyledPopUp action={() => {}}>
      <Header>
        <span>Edit</span>{" "}
        {state.variantattributes.map((attribute) => attribute.attributevalue).join(" / ")}
      </Header>
      <hr />
      <Content>
        <div>
          <h4>Sale Price</h4>
          <TextInput
            placeholder={"0"}
            state={salePrice}
            setState={(value) => {
              if (moneyRegex.test(value) || value == "") {
                setSalePrice(value);
              }
            }}
          />
        </div>
        <div>
          <h4>Compare Price</h4>
          <TextInput
            placeholder={"0"}
            state={comparePrice}
            setState={(value) => {
              if (moneyRegex.test(value) || value == "") {
                setComparePrice(value);
              }
            }}
          />
        </div>
      </Content>
      <hr />
      <Button>
        <button
          onClick={() => {
            if (Number(comparePrice) && Number(comparePrice) <= Number(salePrice)) {
              alert("Fake price cant be smaller than real price");
              return;
            } else {
              state.price = salePrice ? salePrice : 0;
              state.saleprice = comparePrice ? comparePrice : 0;
              setState();
              action();
            }
          }}
        >
          Ok
        </button>
        <button onClick={action}>Cancel</button>
      </Button>
    </StyledPopUp>
  );
}
