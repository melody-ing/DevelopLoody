import React from "react";
import styled from "styled-components";

const CloseDialog = styled.div`
  display: ${({ $isOpen }) => ($isOpen ? "block" : "none")};
  width: 100%;
  height: 100vh;
  position: fixed;
  background-color: #3e3b30ac;
  top: 0;
  left: 0;
  z-index: 400;
`;

const WrapDialog = styled.div`
  display: ${({ $isOpen }) => ($isOpen ? "block" : "none")};
  z-index: 500;
`;

const DialogBlock = styled.div`
  position: fixed;
  left: 50vw;
  top: 50vh;
  width: 50rem;
  height: 18rem;
  background-color: #fff;
  transform: translate(-50%, -50%);
  border-radius: 5px;
  padding: 3rem;
  text-align: start;
  z-index: 500;
`;

const Dialog = ({ children, isOpen, onClickCloseDialog }) => {
  return (
    <>
      {" "}
      <CloseDialog $isOpen={isOpen} onClick={onClickCloseDialog}>
        {" "}
      </CloseDialog>
      <WrapDialog $isOpen={isOpen}>
        <DialogBlock>{children}</DialogBlock>
      </WrapDialog>
    </>
  );
};

export default Dialog;
