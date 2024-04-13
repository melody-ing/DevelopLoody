import React from "react";
import styled from "styled-components";
import theme from "../../../components/css/theme";

const User = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 5rem;
  background-color: ${theme.colors.secondary};
  color: ${theme.colors.light};
  display: flex;
  justify-content: space-around;
  align-items: center;

  p {
    font-size: x-large;
  }

  ${theme.breakpoints.sm} {
    height: 3rem;

    p {
      font-size: large;
    }
  }
`;

const Score = ({ user }) => {
  return (
    <User>
      <p>{user?.name}</p>
      <p>{user?.score}</p>
    </User>
  );
};

export default Score;
