import React, { useEffect } from "react";
import styled from "styled-components";
import theme from "../../../components/css/theme";
import { updateRealTime } from "../../../utils/reviseRealTime";
import { useGameStore } from "../../../utils/hook/useGameStore";

const User = styled.div`
  position: fixed;
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
    height: 5rem;

    p {
      font-size: 12.4;
    }
  }
`;

const Score = ({ user, isRank }) => {
  const { userId, documentId } = useGameStore();
  const totalScore = user.score + user.addScore;

  useEffect(() => {
    if (isRank)
      updateRealTime(`${documentId}/users/${userId}`, {
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
