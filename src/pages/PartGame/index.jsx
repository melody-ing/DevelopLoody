import React, { useEffect, useState } from "react";
import { styled } from "styled-components";
import Home from "./Home";
import theme from "../../components/css/theme";
import Options from "./Home/Options";
import Timeout from "./Timeout";
import Rank from "./Rank";
import End from "./End";
import Lobby from "./Lobby";
import Score from "./Score";
import PrimaryBg from "../../components/css/PrimaryBg";
import { useGameStore } from "../../utils/hook/useGameStore";
import { useGetFireStore } from "../../utils/hook/useGetFireStore";
import { useGetRealTime } from "../../utils/hook/useGetRealTime";
import { updateRealTime } from "../../utils/updateRealTime";

const WrapGame = styled(PrimaryBg)`
  width: 100%;
  height: 100vh;
  position: relative;
`;

const Question = styled.h2`
  width: auto;
  height: auto;
  padding: 1rem;
  background-color: ${theme.colors.light};

  ${theme.breakpoints.sm} {
    display: none;
  }
`;

const PartGame = () => {
  const documentId = "uRjHQ7uQS06iBADYJSSH";
  // const { state, userId } = useGameStore();

  const qbank = useGetFireStore("qbank", documentId);
  const user = useGetRealTime(`users/-NvLufWobRKj-dtMesOb`);
  // const user = useGetRealTime(`users/${userId}`);
  const qNumber = useGetRealTime("question/id");
  const state = useGetRealTime("state");

  let title = "";
  let content = null;
  let nextState = "";

  if (qbank && user && qNumber !== null) {
    const questions = qbank.questions[qNumber];
    const answer = qbank.questions[qNumber].answer;
    console.log(questions);
    switch (state) {
      case "lobby":
        title = questions.title;
        content = <Lobby user={user} />;
        break;

      case "game":
        title = questions.title;
        content = (
          <>
            <Home questions={questions} />
            <Options questions={questions} user={user} />
            <Score user={user} />
          </>
        );
        nextState = "timeout";
        break;

      case "timeout":
        title = questions.title;
        content = (
          <>
            <Timeout user={user} questions={questions} answer={answer} />
            <Score user={user} />
          </>
        );
        nextState = "rank";
        break;
      case "rank":
        title = questions.title;
        content = (
          <>
            <Rank user={user} />
            <Score user={user} />
          </>
        );
        nextState = "rank";
        updateRealTime(`users/-NvLufWobRKj-dtMesOb`, { selected: null });
        break;

      case "end":
        title = "結束";
        content = <End />;
    }
  }

  return (
    <WrapGame>
      <Question>{title}</Question>

      {content}
    </WrapGame>
  );
};

export default PartGame;
