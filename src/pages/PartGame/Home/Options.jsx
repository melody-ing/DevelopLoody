import React, { useState } from "react";
import styled from "styled-components";
import theme from "../../../components/css/theme";
import { updateRealTime } from "../../../utils/reviseRealTime";
import { useGameStore } from "../../../utils/hook/useGameStore";

const WrapOptions = styled.div`
  position: absolute;
  width: 99%;
  bottom: 6rem;
  left: 0;
  display: grid;
  grid-template-columns: 50% 50%;
  gap: 10px;

  button {
    cursor: pointer;
    max-width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 8rem;
    font-size: larger;
    background-color: ${theme.colors.light};
    border: none;
  }

  ${theme.breakpoints.sm} {
    bottom: 4rem;

    width: 100vw;
    height: 96vh;
    top: 0;

    padding: 2rem;

    button {
      height: 100%;
    }
  }
`;

const Correct = styled.svg`
  width: 4.4rem;
  height: 4.4rem;
  color: ${theme.colors.danger};
`;

const Options = ({ questions, addScore, user }) => {
  const { userId, documentId } = useGameStore();

  const [isAnswer, setIsAnswer] = useState(false);
  function handleAnswer(e) {
    updateRealTime(`${documentId}/users/${userId}`, {
      selected: +e.target.value,
      addScore,
      time: Date.now(),
    });
    setIsAnswer(true);
  }

  return isAnswer ? (
    <p>等一下別人喔</p>
  ) : (
    <WrapOptions>
      {questions.options.map((item, index) => {
        return (
          <button key={index} onClick={handleAnswer} value={index}>
            {item}
          </button>
        );
      })}
    </WrapOptions>
  );
};

export default Options;
