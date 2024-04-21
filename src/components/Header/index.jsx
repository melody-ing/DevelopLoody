import React from "react";
import theme from "../css/theme";
import styled from "styled-components";
import Buttons from "../Buttons";
import { useNavigate } from "react-router-dom";

const WarpHeader = styled.div`
  display: flex;
  align-items: center;
  background-color: ${theme.colors.primary};
  /* background: linear-gradient(to bottom, ${theme.colors.primary}, #fff); */

  height: 6rem;
  justify-content: space-between;
  padding: 0 3rem;
`;

const Logo = styled.img`
  height: 4rem;
  width: auto;
  cursor: pointer;
`;

const Header = ({ children }) => {
  const navigate = useNavigate();
  function handleHome() {
    navigate("/");
  }

  return (
    <WarpHeader>
      <Logo src="/logo.png" alt="" onClick={handleHome} />
      {children}
      <Buttons>登入</Buttons>
    </WarpHeader>
  );
};

export default Header;
