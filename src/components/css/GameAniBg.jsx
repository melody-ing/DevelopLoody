import React, { useEffect, useRef } from "react";
import Mryellow from "./animation/Mryellow";
import Yellowlines from "./animation/Yellowlines";
import styled from "styled-components";
import Mrpurple from "./animation/Mrpurple";
import Yellowsmall from "./animation/Yellowsmall";
import Bubbles from "./animation/Bubbles";
import Doodle from "./animation/Doodle";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import theme from "./theme";

const size = window.innerWidth < 940 ? 50 : 80;

const Wrapper = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  height: 100vh;
  overflow: hidden;
`;

const WrapGameAniBg = styled.div`
  position: relative;
  left: 0;
  right: 0;
  height: 100vh;
`;

const TopLeftMryellow = styled.div`
  position: absolute;
  top: -${size / 2}rem;
  left: -${size / 2}rem;
  z-index: -100;
`;

const BottomRightMryellow = styled.div`
  position: absolute;
  bottom: -${size / 1.8}rem;
  right: -${size / 1.8}rem;
  z-index: -100;
`;

const TopRightWrapMrpurple = styled.div`
  position: absolute;
  top: -${size / 1.8}rem;
  right: -${size / 1.8}rem;
  z-index: -100;

  ${theme.breakpoints.sm} {
    display: none;
  }
`;

const BottomLeftWrapMrpurple = styled.div`
  position: absolute;
  bottom: -${size / 1.8}rem;
  left: -${size / 1.8}rem;
  z-index: -100;

  ${theme.breakpoints.sm} {
    display: none;
  }
`;

const WrapYellowsmall = styled.div`
  position: absolute;
  bottom: 50%;
  right: 20rem;
  z-index: -100;

  ${theme.breakpoints.sm} {
    display: none;
  }
`;

const WrapYellowlines = styled.div`
  position: absolute;
  top: 10rem;
  left: 15rem;
  z-index: -100;

  ${theme.breakpoints.sm} {
    display: none;
  }
`;

const TopLeftBubbles = styled.div`
  position: absolute;
  top: -16rem;
  left: -10rem;
  z-index: -99;

  ${theme.breakpoints.sm} {
    top: -10rem;
  }
`;

const TopRightDoodle = styled.div`
  position: absolute;
  top: -20rem;
  right: -16rem;
  z-index: -99;

  ${theme.breakpoints.sm} {
    top: auto;
    bottom: -24rem;
    right: -20rem;
  }
`;

const GameAniBg = () => {
  const containerRef = useRef(null);

  gsap.registerPlugin(useGSAP);

  useGSAP(
    () => {
      gsap.to(".rotate", {
        rotate: 360,
        duration: 30,
        repeat: -1,
        ease: "linear",
      });
    },
    { scope: containerRef }
  );

  useGSAP(
    () => {
      const shakeTl = gsap.timeline({ repeat: -1, ease: "" });
      shakeTl.to(".shake", {
        x: -30,
        y: 30,
        duration: 1,
        delay: 1,
        ease: "back.inOut(1.7)",
      });
      shakeTl.to(".shake", {
        x: 0,
        y: 0,
        duration: 1,
        delay: 1,
        ease: "back.inOut(1.7)",
      });
    },
    { scope: containerRef }
  );

  return (
    <Wrapper>
      <WrapGameAniBg ref={containerRef}>
        <TopLeftMryellow className="rotate">
          <Mryellow />
        </TopLeftMryellow>
        <WrapYellowlines className="shake">
          <Yellowlines />
        </WrapYellowlines>
        <TopRightWrapMrpurple className="rotate">
          <Mrpurple />
        </TopRightWrapMrpurple>
        <BottomLeftWrapMrpurple className="rotate">
          <Mrpurple />
        </BottomLeftWrapMrpurple>
        <BottomRightMryellow className="rotate">
          <Mryellow />
        </BottomRightMryellow>

        <TopLeftBubbles>
          <Bubbles />
        </TopLeftBubbles>
        <TopRightDoodle>
          <Doodle />
        </TopRightDoodle>
      </WrapGameAniBg>
    </Wrapper>
  );
};

export default GameAniBg;
