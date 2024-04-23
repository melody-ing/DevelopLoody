import React from "react";
import styled from "styled-components";

const WrapMedia = styled.div`
  max-width: 70rem;
  margin: 0 auto;

  img {
    max-height: 40rem;
    object-fit: contain;
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
