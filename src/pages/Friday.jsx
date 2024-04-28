import theme from "@/components/css/theme";
import React from "react";
import styled, { keyframes } from "styled-components";
const brightYellow = "#883567";

const bgColor = keyframes`
0% {
  background-color: ${brightYellow};
}
50% {
  background-color: #b78fa6;
}
100% {
  background-color:  ${brightYellow};
}`;

const bgRotate = keyframes`
from {
  transform: rotate(0deg);
}
from {
  transform: rotate(360deg);
}
`;

const progressbarWidth = keyframes` 
from{
  width: 100%;
}
to{
  width: 0%;
}
`;

const Container = styled.div`
  max-width: 500px;
  margin: 50px auto;
  h1 {
    text-align: center;
  }
  .progressbar-container {
    position: relative;
    width: 100%;
    height: 50px;
    border: 1px solid #fff;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    .progressbar-complete {
      position: absolute;
      left: 0;
      top: 0px;
      height: 100%;
      background-color: ${brightYellow};
      border-radius: 10px;
      animation: ${bgColor} 2500ms infinite ease-in-out;
      z-index: 2;
      animation-name: ${progressbarWidth};
      animation-duration: 10s;
      animation-iteration-count: 1;
      .progressbar-liquid {
        z-index: 1;
        width: 70px;
        height: 70px;
        animation: ${bgColor} 2500ms infinite ease-in-out,
          ${bgRotate} 3000ms infinite cubic-bezier(0.5, 0.5, 0.5, 0.5);
        position: absolute;
        right: -5px;
        top: -10px;
        background-color: ${brightYellow};
        border-radius: 40%;
      }
    }
    .progress {
      z-index: 2;
    }
  }
`;

const Fsfs = styled.div`
  height: 100vh;
  width: 100vw;
`;

const Friday = () => {
  const progress = 40;
  return (
    <Fsfs>
      <video autoPlay muted>
        {" "}
        <source src="/4KBG.mp4" type="video/mp4" />
      </video>
      <Container className="container">
        <div className="progressbar-container">
          <div className="progressbar-complete">
            <div className="progressbar-liquid"></div>
          </div>
        </div>
      </Container>
    </Fsfs>
  );
};

export default Friday;
