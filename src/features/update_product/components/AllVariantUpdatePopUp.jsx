import React from "react";
import PopUp from "@/shared/components/PopUp/PopUp";
import { useState } from "react";
import styled from "styled-components";
import TextInput from "@/shared/components/Input/TextInput";
import { useEffect } from "react";
import MoneyInput from "@/shared/components/Input/MoneyInput";

const StyledPopUp = styled(PopUp)`
  max-width: 600px;
  padding: 0;
`;

const Header = styled.div`
  font-size: 18px;
  padding: 1rem;
`;

const Content = styled.div`
  & h4 {
    font-size: 14px;
    color: rgba(0, 0, 0, 0.7);
  }

  max-height: 30rem;
  overflow-y: scroll;
  padding: 0 2rem;

  &::-webkit-scrollbar-track {
    background-color: none;
  }

  &::-webkit-scrollbar {
    width: 4px;
    background-color: none;
  }

  &::-webkit-scrollbar-thumb {
    background-color: rgb(205, 205, 207);
  }
`;

const Button = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  padding: 1rem;

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

const ContentHeader = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
  margin: 1rem 0;

  & button {
    cursor: pointer;
  }

  > div {
    display: flex;
    gap: 1rem;

    > input {
      width: 20rem;
    }
  }
`;

const ContentBody = styled.div`
  display: flex;
  flex-direction: column;
  margin: 2rem 0;
  gap: 2rem;

  > div {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    align-items: center;
    gap: 1rem;
    align-items: center;
  }

  & input {
    width: 10rem;
  }
`;

const regex = /^(?=.*\d)\d*(?:\.\d*)?$/;

export default function AllVariantUpdatePopUp({ action, state, setState }) {
  const [allPrice, setAllPrice] = useState("");
  const [prices, setPrices] = useState(new Array(state.length).fill(""));
  const [fakePrices, setFakePrices] = useState(new Array(state.length).fill(""));

  const onConfirm = () => {
    for (let i = 0; i < prices.length; i++) {
      if (Number(fakePrices[i]) && Number(fakePrices[i]) <= Number(prices[i])) {
        alert("Fake price cant be smaller than real price");
        return;
      }
    }

    for (let i = 0; i < prices.length; i++) {
      state[i].price = prices[i] ? prices[i] : 0;
      state[i].saleprice = fakePrices[i] ? fakePrices[i] : 0;
    }

    setState();
    action();
  };

  useEffect(() => {
    state.forEach((item, index) => (prices[index] = item.price));
    state.forEach((item, index) => (fakePrices[index] = item.saleprice));
    setPrices([...prices]);
    setFakePrices([...fakePrices]);
  }, []);

  return (
    <StyledPopUp action={() => {}}>
      <Header>Edit price</Header>
      <hr />
      <Content>
        <ContentBody>
          <div>
            <span></span>
            <span>Price</span>
            <span>Compare price</span>
          </div>
          {state.map((item, key) => {
            if (item.selected == true) {
              return (
                <div key={key}>
                  <span>
                    {item.variantattributes
                      .map((attribute) => attribute.attributevalue)
                      .join(" / ")}
                  </span>
                  <TextInput
                    placeholder={0}
                    state={prices[key]}
                    setState={(value) => {
                      if (regex.test(value) || value == "") {
                        const newList = [...prices];
                        newList[key] = value;
                        setPrices(newList);
                      }
                    }}
                  />
                  <TextInput
                    placeholder={0}
                    state={fakePrices[key]}
                    setState={(value) => {
                      if (regex.test(value) || value == "") {
                        const newList = [...fakePrices];
                        newList[key] = value;
                        setFakePrices(newList);
                      }
                    }}
                  />
                </div>
              );
            }
          })}
        </ContentBody>
      </Content>
      <hr />
      <Button>
        <button onClick={onConfirm}>Ok</button>
        <button onClick={action}>Cancel</button>
      </Button>
    </StyledPopUp>
  );
}
