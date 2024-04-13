import React from "react";
import theme from "../../../components/css/theme";
import Buttons from "../../../components/Buttons";
import { styled } from "styled-components";

const TimeLimit = styled.div`
  position: absolute;
  bottom: 50%;
  padding: 2rem;
  background-color: ${theme.colors.secondary}66;
  color: ${theme.colors.tertiary};
  font-size: 5rem;
  width: auto;
  height: 8rem;
  line-height: 4rem;
`;

const Attenance = styled.div`
  position: absolute;
  bottom: 50%;
  padding: 2rem;
  right: 0;
  background-color: ${theme.colors.secondary}66;
  color: ${theme.colors.tertiary};
  font-size: 2rem;
  width: 18rem;
  height: 14rem;
  line-height: 4rem;

  p {
    font-size: 5rem;
  }
`;

const Home = ({ questions }) => {
  return <></>;
};

export default Home;
