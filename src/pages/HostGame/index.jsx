import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { styled } from "styled-components";
import Home from "./Home";
import theme from "../../components/css/theme";
import Buttons from "../../components/Buttons";
import Options from "./Home/Options";
import Timeout from "./Timeout";
import Rank from "./Rank";
import End from "./End";
import { useGameStore } from "../../utils/hook/useGameStore";
import { useGetFireStore } from "../../utils/hook/useGetFireStore";
import { useGetRealTime } from "../../utils/hook/useGetRealTime";
import { deleteRealTime, updateRealTime } from "../../utils/reviseRealTime";

const WrapGame = styled.div`
  width: 100%;
  height: 94vh;
  position: relative;
`;

const Question = styled.h2`
  width: auto;
  height: auto;
  padding: 1rem;
  background-color: ${theme.colors.light};
`;

const HostGame = () => {
  const { documentId } = useGameStore();

  const qbank = useGetFireStore("qbank", documentId);

  const qNumber = useGetRealTime(`${documentId}/question/id`);
  const state = useGetRealTime(`${documentId}/state`);
  const users = useGetRealTime(`${documentId}/users`);

  const navigate = useNavigate();
  let title = "";
  let button = "";
  let content = null;
  let nextState = "";

  if (qbank && qNumber !== null && users) {
    const questions = qbank.questions[qNumber];
    const answer = qbank.questions[qNumber].answer;
    switch (state) {
      case "game":
        title = questions.title;
        button = "略過";
        content = (
          <>
            <Home questions={questions} users={users} documentId={documentId} />
            <Options questions={questions} />
          </>
        );

        nextState = "timeout";
        break;
      case "timeout":
        title = questions.title;
        button = "排名";
        content = (
          <>
            <Timeout />
            <Options questions={questions} answer={answer} />
          </>
        );
        nextState = "rank";
        break;
      case "rank":
        title = "記分板";
        button = "下一題";
        content = <Rank />;
        nextState = "game";
        break;
      case "end":
        title = "結束";
        button = "首頁";
        content = <End />;
        updateRealTime(`${documentId}/question`, { id: 0 });
        nextState = "lobby";

        break;
      default:
        title = questions.title;
        button = "略過";
        content = (
          <>
            <Home questions={questions} />
            <Options questions={questions} />
          </>
        );
        nextState = "timeout";
        break;
    }
  }

  function setQNumber(qNumber) {
    updateRealTime(`${documentId}/question`, { id: qNumber + 1 });
  }

  function handleState() {
    updateRealTime(documentId, { state: nextState });

    if (state === "end") {
      navigate("/");
      deleteRealTime(documentId);
    } else {
      state === "rank" && setQNumber(qNumber);
      qNumber === qbank.questions.length - 1 &&
        state === "timeout" &&
        updateRealTime(documentId, { state: "end" });
    }
  }

  return (
    <WrapGame>
      <Question>{title}</Question>
      <div onClick={handleState}>
        <Buttons>{button}</Buttons>
      </div>
      {content}
    </WrapGame>
  );
};

export default HostGame;
