import theme from "@/components/css/theme";
import React from "react";
import styled, { keyframes } from "styled-components";

const fadeIn = keyframes`
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }

`;

const WrapMedia = styled.div`
  width: 100%;
  margin: 0 auto;
  opacity: 0;
  animation: ${fadeIn} 0.1s 0.3s forwards;
  position: fixed;
  top: 18rem;
  left: 0;
  display: flex;
  justify-content: center;

  img {
    max-height: calc(100vh - 40rem);
    object-fit: contain;
    max-width: 50rem;
    margin: 0 auto;
  }

  ${theme.breakpoints.sm} {
    max-width: 100%;

    img {
      max-width: 34rem;
      max-height: 32vh;
    }
  }
`;

const Media = ({ questions }) => {
  return (
    <WrapMedia>
      <img src={questions.media} alt="" />
    </WrapMedia>
  );
};

export default Media;
