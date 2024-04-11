import React from "react";
import { styled } from "styled-components";
import theme from "../../../components/css/theme";

const WrapGame = styled.div`
  width: 100%;
  height: 100vh;
  position: relative;
`;

const Question = styled.h2`
  width: 100%;
  height: auto;
  padding: 1rem;
  background-color: ${theme.colors.light};
`;

const Options = styled.div`
  position: absolute;
  width: 100%;
  bottom: 0;
  left: 0;
  display: grid;
  grid-template-columns: 50% 50%;
  gap: 10px;

  h3 {
    max-width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 8rem;
    background-color: ${theme.colors.light};
  }
`;

const Attenance = styled.div`
  position: absolute;
  bottom: 50%;
  padding: 2rem;
  background-color: ${theme.colors.tertiary}66;
  color: ${theme.colors.light};
  font-size: 3rem;
  width: 8rem;
  height: 8rem;
  line-height: 4rem;
`;

const Game = () => {
  return (
    <WrapGame>
      <Question>晚餐吃甚麼</Question>
      <Attenance>5</Attenance>
      <Options>
        <h3>牛肉麵</h3>
        <h3>牛肉麵</h3>
        <h3>牛肉麵</h3>
        <h3>牛肉麵</h3>
      </Options>
    </WrapGame>
  );
};

export default Game;
