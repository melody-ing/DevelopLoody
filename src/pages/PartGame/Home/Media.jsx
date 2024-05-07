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
  max-width: 70rem;
  margin: 0 auto;
  opacity: 0;
  animation: ${fadeIn} 0.1s 0.3s forwards;

  img {
    max-height: calc(100vh - 40rem);
    object-fit: contain;
  }

  ${theme.breakpoints.sm} {
    max-width: 90%;
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
