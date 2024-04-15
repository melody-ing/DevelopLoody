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
import { updateRealTime } from "../../utils/reviseRealTime";
import { useNavigate } from "react-router-dom";

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
  const { userId, documentId } = useGameStore();
  const navigation = useNavigate();

  const qbank = useGetFireStore("qbank", documentId);
  const user = useGetRealTime(`${documentId}/users/${userId}`);
  const qNumber = useGetRealTime(`${documentId}/question/id`);
  const state = useGetRealTime(`${documentId}/state`);
  const qTime = useGetRealTime(`${documentId}/time`);

  function setScore(time, userTime) {
    if (userTime & time) {
      const delayTime = parseInt((userTime - time) / 1000);
      const addScore = 1000 - delayTime * 79;
      if (user.selected !== undefined)
        updateRealTime(`${documentId}/users/${userId}`, { addScore });
      return addScore;
    }
  }

  let title = "";
  let content = null;
  let nextState = "";
  let addScore = 0;

  useEffect(() => {
    if (!userId) {
      navigation("/");
    }
  }, [userId, navigation]);

  if (qbank && user && qNumber !== null) {
    const questions = qbank.questions[qNumber];
    const answer = qbank.questions[qNumber].answer;
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
            <Options
              questions={questions}
              user={user}
              qTime={qTime}
              addScore={addScore}
            />
            <Score user={user} />
          </>
        );
        nextState = "timeout";
        addScore = setScore(qTime, user.time);

        break;

      case "timeout":
        title = questions.title;
        content = (
          <>
            <Timeout user={user} questions={questions} answer={answer} />
            <Score user={user} isRank={true} />
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
        updateRealTime(`${documentId}/users/${userId}`, {
          selected: null,
        });
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
