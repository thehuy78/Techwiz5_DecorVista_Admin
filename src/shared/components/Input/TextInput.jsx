import React from "react";
import styled from "styled-components";

const Input = styled.input`
  padding: 8px;
  border-radius: 3px;
  width: 100%;

  border: 1px solid rgba(0, 0, 0, 0.1);
  outline: none;
  transition: all 0.3s;

  &:focus {
    border: 1px solid rgba(0, 0, 255, 0.4);
  }

  &:active {
    border: 1px solid rgba(0, 0, 255, 0.4);
  }
`;

export default function TextInput({ state, setState, placeholder, type, className, readOnly }) {
  return (
    <Input
      readOnly={readOnly}
      className={className}
      type={type}
      placeholder={placeholder}
      value={state}
      onChange={(ev) => {
        setState(ev.target.value);
      }}
    />
  );
}
