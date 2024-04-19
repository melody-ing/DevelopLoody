import React from "react";
import styled from "styled-components";
import theme from "../../../components/css/theme";

const WrapRank = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const UsersRank = styled.div`
  margin-top: 3rem;
  display: flex;
  justify-content: space-between;
  width: 60%;
  font-size: 3rem;
  box-shadow: ${theme.shadow};
  padding: 2rem;
  border-radius: 10px;
`;

const End = ({ users }) => {
  return (
    <WrapRank>
      {Object.values(users)
        .sort((a, b) => b.score - a.score)
        .map((user, index) => {
          return (
            <UsersRank key={index}>
              <div>{index + 1}</div>
              <div>{user.name}</div>
              <div>{user.score}</div>
            </UsersRank>
          );
        })}
    </WrapRank>
  );
};

export default End;
