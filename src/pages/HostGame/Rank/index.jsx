import React from "react";
import styled from "styled-components";
import { updateRealTime } from "../../../utils/reviseRealTime";

const WrapRank = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const UsersRank = styled.div`
  display: flex;
  justify-content: space-between;
  width: 80%;
`;

const Rank = ({ users, documentId, userId }) => {
  return (
    <WrapRank>
      {Object.values(users)
        .sort((a, b) => b.score - a.score)
        .map((user, index) => {
          return (
            <UsersRank key={index}>
              <div>{user.name}</div>
              <div>{user.score}</div>
            </UsersRank>
          );
        })}
    </WrapRank>
  );
};

export default Rank;
