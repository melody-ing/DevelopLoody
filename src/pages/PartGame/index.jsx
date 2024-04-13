import React, { useEffect, useState } from "react";
import { styled } from "styled-components";
import Home from "./Home";
import theme from "../../components/css/theme";
import Options from "./Home/Options";
import Timeout from "./Timeout";
import End from "./End";
import Lobby from "./Lobby";
import Score from "./Score";
import PrimaryBg from "../../components/css/PrimaryBg";
import { useGameStore } from "../../utils/hook/useGameStore";
import { useGetFireStore } from "../../utils/hook/useGetFireStore";
import { useGetRealTime } from "../../utils/hook/useGetRealTime";

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
  const { state, userId } = useGameStore();

  const qbank = useGetFireStore("qbank", documentId);

  const user = useGetRealTime(`users/-NvLufWobRKj-dtMesOb`);
  // const user = useGetRealTime(`users/${userId}`);
  console.log(user);
  const [qNumber, setQNumber] = useState(0);

  let title = "";
  let content = null;
  let nextState = "";

  if (qbank) {
    const questions = qbank.questions[qNumber];
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
            <Options questions={questions} />
            <Score user={user} />
          </>
        );
        nextState = "timeout";
        break;

      case "timeout":
      case "rank":
        title = questions.title;
        content = (
          <>
            <Timeout user={user} />
            <Score user={user} />
          </>
        );
        nextState = "rank";
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
