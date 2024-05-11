import { useState } from "react";
import styled from "styled-components";
import theme from "../../../components/css/theme";
import { updateRealTime } from "../../../utils/reviseRealTime";
import Buttons from "@/components/Buttons";
import { Timestamp } from "firebase/firestore";

import ReactLoading from "react-loading";

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
    bottom: 6rem;
  }
`;

const WrapWord = styled.div`
  font-size: 2rem;
  color: #a78d50;
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
  position: fixed;
  gap: 2rem;
  bottom: 8rem;
  width: 100%;

  ${theme.breakpoints.sm} {
    bottom: 3rem;
  }
`;

const WrapShortAnswerInput = styled.div`
  width: 60%;
  height: 8rem;
  display: flex;
  align-items: center;
  box-shadow: 0px 0px 4px 0px #33333369;
  justify-content: space-around;
  padding: 1rem;
  padding-left: 2rem;
  border-radius: 5px;
  position: relative;
  background-color: #fff;

  ${theme.breakpoints.sm} {
    width: 90%;
    height: 8rem;
  }
`;

const ShortAnswerInput = styled.input`
  width: 100%;
  outline: none;
  border: none;
  font-size: 2.6rem;
  text-align: center;
`;

const ShortAnswerBtn = styled.div`
  width: 60%;
  height: 2rem;

  ${theme.breakpoints.sm} {
    width: 90%;
    height: 8rem;
  }
`;

const Loading = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  margin-top: 10rem;
  align-items: center;
  gap: 0.4rem;
`;

const NameTextWarning = styled.div`
  position: absolute;
  color: #c7c7c7;
  right: 1rem;
  top: 5.4rem;
  font-size: 1.6rem;
`;

const Options = ({ questions, addScore, getUrlDocumentId, userId, user }) => {
  const [shortAnswer, setShortAnswer] = useState("");

  function handleAnswer(e) {
    if (getUrlDocumentId === undefined) return;

    if (questions.type === "mc" || questions.type === "tf") {
      updateRealTime(`${getUrlDocumentId}/users/${userId}`, {
        selected: +e.target.value,
        addScore,
        time: Timestamp.now(),
      });
    }
    if (questions.type === "sa") {
      updateRealTime(`${getUrlDocumentId}/users/${userId}`, {
        selected: shortAnswer.trim(),
        addScore,
        time: Timestamp.now(),
      });
    }
  }

  return user.selected !== undefined && user.selected !== "" ? (
    <>
      {" "}
      <Loading>
        <WrapWord>答案是</WrapWord>
        <ReactLoading type="balls" color="#a78d50" height={3} width={16} />
      </Loading>
    </>
  ) : (
    <WrapOptions>
      {questions.type === "sa" && (
        <WrapShortAnswer>
          <WrapShortAnswerInput>
            <ShortAnswerInput
              value={shortAnswer}
              onChange={(e) =>
                setShortAnswer(e.target.value.slice(0, 22).toUpperCase())
              }
              type="text"
              placeholder="請輸入答案"
            />
            <NameTextWarning>{`${shortAnswer.length}/22`}</NameTextWarning>
          </WrapShortAnswerInput>
          <ShortAnswerBtn onClick={handleAnswer}>
            <Buttons
              size={window.innerWidth < 940 ? "medium" : "large"}
              style={{ width: "100%", height: "4rem" }}
              type="success"
            >
              送出
            </Buttons>
          </ShortAnswerBtn>
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
