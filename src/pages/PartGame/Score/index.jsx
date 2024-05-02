import React, { useEffect } from "react";
import styled from "styled-components";
import theme from "../../../components/css/theme";
import { updateRealTime } from "../../../utils/reviseRealTime";

const User = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  width: 100%;
  height: 3.4rem;
  background-color: #4c5845;
  color: ${theme.colors.light};
  display: flex;
  justify-content: space-around;
  align-items: center;

  p {
    font-size: 3rem;
    line-height: 3rem;
  }
`;

const Score = ({ user, isRank, getUrlDocumentId, userId }) => {
  const totalScore = user.score + user.addScore;

  useEffect(() => {
    if (isRank)
      updateRealTime(`${getUrlDocumentId}/users/${userId}`, {
        score: totalScore,
      });
  }, [isRank]);

  return (
    <User>
      <p>{user.name}</p>
      <p>{user.score}</p>
    </User>
  );
};

export default Score;
