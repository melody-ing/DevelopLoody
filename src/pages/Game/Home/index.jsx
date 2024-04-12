import React from "react";
import theme from "../../../components/css/theme";
import Buttons from "../../../components/Buttons";
import { styled } from "styled-components";

const Question = styled.h2`
  width: auto;
  height: auto;
  padding: 1rem;
  background-color: ${theme.colors.light};
`;

const LimitTime = styled.div`
  position: absolute;
  bottom: 50%;
  padding: 2rem;
  background-color: ${theme.colors.tertiary}66;
  color: ${theme.colors.light};
  font-size: 5rem;
  width: 8rem;
  height: 8rem;
  line-height: 4rem;
`;

const Attenance = styled.div`
  position: absolute;
  bottom: 50%;
  padding: 2rem;
  right: 0;
  background-color: ${theme.colors.tertiary}66;
  color: ${theme.colors.light};
  font-size: 2rem;
  width: 18rem;
  height: 14rem;
  line-height: 4rem;

  p {
    font-size: 5rem;
  }
`;

const Home = () => {
  return (
    <>
      <LimitTime>5</LimitTime>

      <Attenance>
        作答人數： <p>5</p>
      </Attenance>
    </>
  );
};

export default Home;
