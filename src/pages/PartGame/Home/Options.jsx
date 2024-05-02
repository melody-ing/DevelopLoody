import React, { useState } from "react";
import styled from "styled-components";
import theme from "../../../components/css/theme";
import { updateRealTime } from "../../../utils/reviseRealTime";
import Buttons from "@/components/Buttons";
import { Timestamp, serverTimestamp } from "firebase/firestore";
import { useParams } from "react-router-dom";

const WrapOptions = styled.div``;

const WrapChooseOptions = styled.div`
  position: fixed;
  width: 60%;
  left: 50%;
  bottom: 6rem;
  transform: translateX(-50%);
  display: grid;
  grid-template-columns: 50% 50%;
  gap: 10px;
  margin: 0 auto;

  ${theme.breakpoints.sm} {
    width: 90%;
  }
`;

const OptionsButton = styled.button`
  cursor: pointer;
  max-width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 8rem;
  font-size: larger;

  background: #ffffff;
  border: 2px solid goldenrod;
  border-radius: 4px;
  color: #a77e17;
  font-weight: bold;
  transition: 0.5s;

  &:hover {
    color: goldenrod;
    border: 1px solid;
    box-shadow: inset 0 0 20px #ac99396e, 0 0 20px #ac99396e;
    outline: 1px solid !important;
    outline-color: rgba(225, 51, 45, 0) !important;
    outline-offset: 15px;
    text-shadow: 0.5px 0.5px 1px #ac9939;
  }
`;

const WrapShortAnswer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  position: absolute;
  gap: 2rem;
  bottom: 10rem;
  width: 100%;
`;

const WrapShortAnswerInput = styled.div`
  width: 60%;
  height: 10rem;
  display: flex;
  align-items: center;
  box-shadow: 0px 0px 4px 0px #33333369;
  justify-content: space-around;
  padding: 1rem;
  padding-left: 2rem;
  border-radius: 5px;

  background-color: #fff;
`;

const ShortAnswerInput = styled.input`
  width: 100%;
  outline: none;
  border: none;
  font-size: 2.6rem;
  text-align: center;
`;

const ShortAnswerBtn = styled.div``;

const Options = ({
  questions,
  addScore,
  isAnswer,
  setIsAnswer,
  getUrlDocumentId,
  userId,
}) => {
  const [shortAnswer, setShortAnswer] = useState("");

  const { documentId } = useParams();
  console.log(documentId);

  function handleAnswer(e) {
    if (getUrlDocumentId === undefined) return;

    if (questions.type === "mc" || questions.type === "tf") {
      console.log(`${getUrlDocumentId}/users/${userId}`);
      updateRealTime(`${getUrlDocumentId}/users/${userId}`, {
        selected: +e.target.value,
        addScore,

        time: Timestamp.now(),
      });
    }
    if (questions.type === "sa") {
      updateRealTime(`${getUrlDocumentId}/users/${userId}`, {
        selected: shortAnswer,
        addScore,
        time: Timestamp.now(),
      });
    }
    setIsAnswer(true);
  }

  return isAnswer ? (
    <p>等一下別人喔</p>
  ) : (
    <WrapOptions>
      {questions.type === "sa" && (
        <WrapShortAnswer>
          <ShortAnswerBtn onClick={handleAnswer}>
            <Buttons size={window.innerWidth < 940 ? "medium" : "large"}>
              送出
            </Buttons>
          </ShortAnswerBtn>
          <WrapShortAnswerInput>
            <ShortAnswerInput
              value={shortAnswer}
              onChange={(e) => setShortAnswer(e.target.value)}
              type="text"
              placeholder="請輸入答案"
            />
          </WrapShortAnswerInput>
        </WrapShortAnswer>
      )}
      {(questions.type === "mc" || questions.type === "tf") && (
        <>
          <WrapChooseOptions>
            {" "}
            {questions.options.map((item, index) => {
              return (
                <OptionsButton key={index} onClick={handleAnswer} value={index}>
                  {item}
                  <span></span>
                  <span></span>
                  <span></span>
                  <span></span>
                </OptionsButton>
              );
            })}
          </WrapChooseOptions>
        </>
      )}
    </WrapOptions>
  );
};

export default Options;
