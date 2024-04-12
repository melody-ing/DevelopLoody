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
  const { state, answer, setState, setAnswer } = useStateStore();
  const navigate = useNavigate();
  let title = "";
  let button = "";
  let content = null;
  let nextState = "";

  switch (state) {
    case "game":
      title = "晚餐吃甚麼";
      button = "略過";
      content = (
        <>
          <Home />
          <Options />
        </>
      );
      nextState = "timeout";
      break;
    case "timeout":
      title = "晚餐吃甚麼";
      button = "排名";
      content = (
        <>
          <Timeout />
          <Options answer={answer} />
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

  function onClickBtn() {
    if (state === "end") {
      navigate("/");
    } else {
      setState(nextState);
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
