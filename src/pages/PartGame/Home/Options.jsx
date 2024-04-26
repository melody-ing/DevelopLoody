import React, { useState } from "react";
import styled from "styled-components";
import theme from "../../../components/css/theme";
import { updateRealTime } from "../../../utils/reviseRealTime";
import { useGameStore } from "../../../utils/hook/useGameStore";
import Buttons from "@/components/Buttons";
import { serverTimestamp } from "firebase/firestore";

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
    height: 90vh;
    top: 0;

    padding: 2rem;

    button {
      height: 100%;
    }
  }
`;

const WrapShortAnswer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;

const WrapShortAnswerInput = styled.div`
  width: 80%;
  height: 10rem;
  display: flex;
  align-items: center;
  box-shadow: 0px 0px 4px 0px #33333369;
  justify-content: space-around;
  padding: 1rem;
  padding-left: 2rem;
  border-radius: 5px;
  position: absolute;
  bottom: 10rem;
  background-color: #fff;

  ${theme.breakpoints.sm} {
    width: 100%;

    position: static;
    margin-top: 50%;
    margin-bottom: 3rem;
    height: 6rem;
  }
`;

const ShortAnswerInput = styled.input`
  width: 100%;
  outline: none;
  border: none;
  font-size: 2.6rem;
  text-align: center;
`;

const Options = ({ questions, addScore, user }) => {
  const [shortAnswer, setShortAnswer] = useState("");
  const { userId, documentId } = useGameStore();

  const [isAnswer, setIsAnswer] = useState(false);
  function handleAnswer(e) {
    if (questions.type === "mc" || questions.type === "tf") {
      updateRealTime(`${documentId}/users/${userId}`, {
        selected: +e.target.value,
        addScore,
        time: serverTimestamp(),
      });
    }
    if (questions.type === "sa") {
      updateRealTime(`${documentId}/users/${userId}`, {
        selected: shortAnswer,
        addScore,
        time: serverTimestamp(),
      });
    }
    setIsAnswer(true);
  }

  return isAnswer ? (
    <p>等一下別人喔</p>
  ) : (
    <>
      {questions.type === "sa" && (
        <WrapShortAnswer>
          <WrapShortAnswerInput>
            <ShortAnswerInput
              value={shortAnswer}
              onChange={(e) => setShortAnswer(e.target.value)}
              type="text"
              placeholder="請輸入答案"
            />
          </WrapShortAnswerInput>
          <div onClick={handleAnswer}>
            <Buttons>送出</Buttons>
          </div>
        </WrapShortAnswer>
      )}
      {(questions.type === "mc" || questions.type === "tf") && (
        <>
          <WrapOptions>
            {" "}
            {questions.options.map((item, index) => {
              return (
                <button key={index} onClick={handleAnswer} value={index}>
                  {item}
                </button>
              );
            })}
          </WrapOptions>
        </>
      )}
    </>
  );
};

export default Options;
