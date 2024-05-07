import theme from "@/components/css/theme";
import React from "react";
import styled from "styled-components";

const WrapMedia = styled.div`
  max-width: 50rem;
  margin: 0 auto;

  img {
    max-height: calc(100vh - 40rem);
    object-fit: contain;
  }

  ${theme.breakpoints.sm} {
    position: absolute;
    left: calc(100vw - 45rem);

    img {
      max-height: 40rem;
      object-fit: contain;
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
