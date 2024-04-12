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
import { useStateStore } from "../../utils/hook/useStateStore";
import { useGetFireStore } from "../../utils/hook/useGetFireStore";

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

const Game = () => {
  const path = "qbank";
  const documentId = "uRjHQ7uQS06iBADYJSSH";

  const qbank = useGetFireStore(path, documentId);

  const { state, setState } = useStateStore();
  const [qNumber, setQNumber] = useState(0);
  const navigate = useNavigate();
  let title = "";
  let button = "";
  let content = null;
  let nextState = "";
  console.log(qbank);

  if (qbank) {
    const questions = qbank.questions[qNumber];
    const answer = qbank.questions[qNumber].answer;
    switch (state) {
      case "game":
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
      <div onClick={onClickBtn}>
        <Buttons>{button}</Buttons>
      </div>
      {content}
    </WrapGame>
  );
};

export default Game;
