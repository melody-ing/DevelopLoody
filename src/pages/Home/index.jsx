import React from "react";
import styled from "styled-components";
import Buttons from "../../components/Buttons";

const WarpHome = styled.div`
  width: 100vw;
  height: 100vh;
  background-color: #ebdb86;
`;

const Home = () => {
  return (
    <WarpHome>
      <Buttons type="">主持</Buttons>
    </WarpHome>
  );
};

export default Home;
