import React from "react";
import styled from "styled-components";

const WrapLobby = styled.div`
  width: 100%;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  justify-content: center;

  h3 {
    margin-top: 4rem;
  }
`;

const Lobby = ({ user }) => {
  return (
    <WrapLobby>
      <h3>Hi: {user.name}</h3>
      <p>等待其他人的加入</p>
    </WrapLobby>
  );
};

export default Lobby;
