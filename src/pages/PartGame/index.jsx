import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { styled } from "styled-components";
import Home from "./Home";
import theme from "../../components/css/theme";
import Options from "./Home/Options";
import Timeout from "./Timeout";
import End from "./End";
import Lobby from "./Lobby";
import PrimaryBg from "../../components/css/PrimaryBg";
import { useStateStore } from "../../utils/hook/useStateStore";
import { useGetFireStore } from "../../utils/hook/useGetFireStore";

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

const User = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 3rem;
  background-color: ${theme.colors.secondary};
  color: ${theme.colors.light};
  display: flex;
  justify-content: space-around;
  align-items: center;
`;

const PartGame = () => {
  const path = "qbank";
  const documentId = "uRjHQ7uQS06iBADYJSSH";

  const qbank = useGetFireStore(path, documentId);

  const { state, setState } = useStateStore();
  const [qNumber, setQNumber] = useState(0);
  const navigate = useNavigate();
  let title = "";
  let content = null;
  let nextState = "";
  console.log(qbank);

  if (qbank) {
    const questions = qbank.questions[qNumber];
    const answer = qbank.questions[qNumber].answer;
    switch (state) {
      case "lobby":
        title = questions.title;
        content = <Lobby />;
        break;
      case "game":
        title = questions.title;
        content = (
          <>
            <Home questions={questions} />
            <Options questions={questions} />
          </>
        );
        nextState = "timeout";
        break;
      case "timeout":
      case "rank":
        title = questions.title;
        content = <Timeout />;
        nextState = "rank";
        break;

      case "end":
        title = "結束";
        content = <End />;
    }
  }

  function onClickBtn() {
    if (state === "end") {
      navigate("/");
    } else {
      state === "rank" && setQNumber((qNumber) => qNumber + 1);
      qNumber === qbank.questions.length - 1 && state === "timeout"
        ? setState("end")
        : setState(nextState);
    }
  }

  return (
    <WrapGame>
      <Question>{title}</Question>

      {content}
      <User>
        <p>Melody</p>
        <p>646</p>
      </User>
    </WrapGame>
  );
};

export default PartGame;
